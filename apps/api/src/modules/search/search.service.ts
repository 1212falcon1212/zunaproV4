import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MeiliSearch, Index } from 'meilisearch';
import { getTenantClient } from '@zunapro/db';

interface ProductDocument {
  id: string;
  name: Record<string, string>;
  slug: string;
  description: Record<string, string> | null;
  price: number;
  sku: string | null;
  stock: number;
  categoryId: string | null;
  status: string;
  images: unknown;
  createdAt: string;
}

interface SearchOptions {
  q: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);
  private readonly client: MeiliSearch;

  constructor(private readonly configService: ConfigService) {
    this.client = new MeiliSearch({
      host: this.configService.get('MEILISEARCH_URL', 'http://localhost:7700'),
      apiKey: this.configService.get('MEILISEARCH_API_KEY', ''),
    });
  }

  private getIndexName(tenantSlug: string): string {
    return `tenant_${tenantSlug}_products`;
  }

  private async getOrCreateIndex(tenantSlug: string): Promise<Index> {
    const indexName = this.getIndexName(tenantSlug);

    try {
      return await this.client.getIndex(indexName);
    } catch {
      const task = await this.client.createIndex(indexName, {
        primaryKey: 'id',
      });
      await this.client.waitForTask(task.taskUid);

      const index = this.client.index(indexName);

      await index.updateFilterableAttributes([
        'categoryId',
        'status',
        'price',
      ]);
      await index.updateSortableAttributes(['price', 'createdAt']);
      await index.updateSearchableAttributes([
        'name.en',
        'name.tr',
        'name.de',
        'name.fr',
        'name.es',
        'slug',
        'sku',
        'description.en',
        'description.tr',
      ]);

      this.logger.log(`Meilisearch index created: ${indexName}`);
      return index;
    }
  }

  async syncProduct(
    tenantSlug: string,
    product: {
      id: string;
      name: unknown;
      slug: string;
      description: unknown;
      price: unknown;
      sku: string | null;
      stock: number;
      categoryId: string | null;
      status: string;
      images: unknown;
      createdAt: Date;
    },
  ): Promise<void> {
    try {
      const index = await this.getOrCreateIndex(tenantSlug);
      const doc: ProductDocument = {
        id: product.id,
        name: product.name as Record<string, string>,
        slug: product.slug,
        description: product.description as Record<string, string> | null,
        price: Number(product.price),
        sku: product.sku,
        stock: product.stock,
        categoryId: product.categoryId,
        status: product.status,
        images: product.images,
        createdAt: product.createdAt.toISOString(),
      };

      await index.addDocuments([doc]);
    } catch (error) {
      this.logger.error(
        `Failed to sync product ${product.id} to search index`,
        error,
      );
    }
  }

  async removeProduct(tenantSlug: string, productId: string): Promise<void> {
    try {
      const index = await this.getOrCreateIndex(tenantSlug);
      await index.deleteDocument(productId);
    } catch (error) {
      this.logger.error(
        `Failed to remove product ${productId} from search index`,
        error,
      );
    }
  }

  async search(tenantSlug: string, options: SearchOptions) {
    const { q, categoryId, minPrice, maxPrice, status, page = 1, limit = 20 } =
      options;

    const index = await this.getOrCreateIndex(tenantSlug);

    const filter: string[] = [];
    if (categoryId) filter.push(`categoryId = "${categoryId}"`);
    if (status) filter.push(`status = "${status}"`);
    if (minPrice !== undefined) filter.push(`price >= ${minPrice}`);
    if (maxPrice !== undefined) filter.push(`price <= ${maxPrice}`);

    const result = await index.search(q, {
      filter: filter.length > 0 ? filter : undefined,
      limit,
      offset: (page - 1) * limit,
      sort: ['createdAt:desc'],
    });

    const prisma = getTenantClient(tenantSlug);
    const productIds = result.hits.map((hit) => hit.id as string);

    let products: unknown[] = [];
    if (productIds.length > 0) {
      products = await prisma.product.findMany({
        where: { id: { in: productIds } },
        include: {
          category: { select: { id: true, name: true, slug: true } },
        },
      });

      const productMap = new Map(
        products.map((p) => [(p as { id: string }).id, p]),
      );
      products = productIds
        .map((id) => productMap.get(id))
        .filter(Boolean);
    }

    return {
      data: products,
      meta: {
        total: result.estimatedTotalHits ?? 0,
        page,
        limit,
        query: q,
        processingTimeMs: result.processingTimeMs,
      },
    };
  }

  async reindex(tenantSlug: string): Promise<{ indexed: number }> {
    const prisma = getTenantClient(tenantSlug);
    const index = await this.getOrCreateIndex(tenantSlug);

    await index.deleteAllDocuments();

    const products = await prisma.product.findMany();
    const documents: ProductDocument[] = products.map((p) => ({
      id: p.id,
      name: p.name as Record<string, string>,
      slug: p.slug,
      description: p.description as Record<string, string> | null,
      price: Number(p.price),
      sku: p.sku,
      stock: p.stock,
      categoryId: p.categoryId,
      status: p.status,
      images: p.images,
      createdAt: p.createdAt.toISOString(),
    }));

    if (documents.length > 0) {
      await index.addDocuments(documents);
    }

    this.logger.log(
      `Reindexed ${documents.length} products (tenant: ${tenantSlug})`,
    );
    return { indexed: documents.length };
  }
}
