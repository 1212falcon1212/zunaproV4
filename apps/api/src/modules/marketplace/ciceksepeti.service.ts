import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { getTenantClient } from '@zunapro/db';
import { BaseMarketplaceService } from './base-marketplace.service';

const CS_BASE_URL = 'https://apis.ciceksepeti.com/api/v1';
const CS_MAX_PRODUCTS_PER_BATCH = 1000;
const CS_MAX_PRICE_STOCK_PER_BATCH = 200;

interface CiceksepetiCredentials {
  apiKey: string;
}

interface CSCategory {
  id: number;
  name: string;
  subCategories?: CSCategory[];
}

interface CSProductPayload {
  productName: string;
  mainProductCode: string;
  stockCode: string;
  categoryId: number;
  description: string;
  deliveryMessageType: number;
  deliveryType: number;
  stockQuantity: number;
  salesPrice: number;
  listPrice: number;
  barcode: string;
  images: string[];
  Attributes: { Id: number; ValueId: number; TextLength: number }[];
}

interface CSPriceStockItem {
  stockCode: string;
  salesPrice: number;
  listPrice: number;
  stockQuantity: number;
}

interface CSFilterOptions {
  page?: number;
  size?: number;
}

@Injectable()
export class CiceksepetiService extends BaseMarketplaceService {
  constructor() {
    // Ciceksepeti strict rate limit: 1 request per 5 seconds
    super(
      { maxRequests: 1, windowMs: 5_000 },
      { maxRetries: 3, baseDelayMs: 5_000 },
    );
  }

  protected getMarketplaceName(): string {
    return 'Ciceksepeti';
  }

  // ─── Auth helpers ───────────────────────────────────────

  private buildHeaders(credentials: CiceksepetiCredentials): Record<string, string> {
    return {
      'x-api-key': credentials.apiKey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
  }

  // ─── HTTP wrapper ───────────────────────────────────────

  private async csFetch<T>(
    path: string,
    credentials: CiceksepetiCredentials,
    options?: {
      method?: string;
      body?: unknown;
    },
  ): Promise<T> {
    const url = `${CS_BASE_URL}${path}`;
    const headers = this.buildHeaders(credentials);

    try {
      return await this.rateLimitedFetch<T>(url, {
        method: options?.method ?? 'GET',
        headers,
        body: options?.body ? JSON.stringify(options.body) : undefined,
      });
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      if (msg.includes('401') || msg.includes('403')) {
        throw new UnauthorizedException(
          'Ciceksepeti API authentication failed. Check your API key.',
        );
      }
      throw new BadRequestException(`Ciceksepeti API error: ${msg}`);
    }
  }

  // ─── Credentials ────────────────────────────────────────

  async saveCredentials(
    tenantSlug: string,
    credentials: CiceksepetiCredentials,
  ): Promise<void> {
    const prisma = getTenantClient(tenantSlug);

    await prisma.marketplaceIntegration.upsert({
      where: { marketplace: 'ciceksepeti' },
      create: {
        marketplace: 'ciceksepeti',
        credentials: {
          apiKey: credentials.apiKey,
          connectedAt: new Date().toISOString(),
        },
        isActive: true,
      },
      update: {
        credentials: {
          apiKey: credentials.apiKey,
          connectedAt: new Date().toISOString(),
        },
        isActive: true,
      },
    });

    this.logger.log(`Ciceksepeti credentials saved for tenant ${tenantSlug}`);
  }

  async getCredentials(
    tenantSlug: string,
  ): Promise<CiceksepetiCredentials | null> {
    const prisma = getTenantClient(tenantSlug);

    const integration = await prisma.marketplaceIntegration.findUnique({
      where: { marketplace: 'ciceksepeti' },
    });

    if (!integration?.credentials || !integration.isActive) return null;

    const creds = integration.credentials as Record<string, string>;
    if (!creds.apiKey) return null;

    return { apiKey: creds.apiKey };
  }

  async removeCredentials(tenantSlug: string): Promise<void> {
    const prisma = getTenantClient(tenantSlug);
    await prisma.marketplaceIntegration
      .delete({ where: { marketplace: 'ciceksepeti' } })
      .catch(() => {});

    this.logger.log(`Ciceksepeti credentials removed for tenant ${tenantSlug}`);
  }

  // ─── Connection test ────────────────────────────────────

  async testConnection(credentials: CiceksepetiCredentials): Promise<boolean> {
    try {
      await this.csFetch<unknown>('/Categories', credentials);
      return true;
    } catch (error) {
      this.logger.warn('Ciceksepeti connection test failed', error);
      return false;
    }
  }

  // ─── Categories ─────────────────────────────────────────

  async syncCategories(
    tenantSlug: string,
    credentials: CiceksepetiCredentials,
  ): Promise<{ synced: number }> {
    const prisma = getTenantClient(tenantSlug);

    await prisma.syncLog.create({
      data: {
        marketplace: 'ciceksepeti',
        action: 'category_sync',
        status: 'started',
      },
    });

    this.logger.log('Ciceksepeti category sync started');

    try {
      const json = await this.csFetch<{ categories?: CSCategory[] }>(
        '/Categories',
        credentials,
      );

      const categories = json.categories ?? [];
      let count = 0;

      const saveRecursive = async (
        cats: CSCategory[],
        parentId: string | null,
      ): Promise<void> => {
        for (const cat of cats) {
          await prisma.marketplaceCategory.upsert({
            where: {
              marketplace_marketplaceCategoryId: {
                marketplace: 'ciceksepeti',
                marketplaceCategoryId: String(cat.id),
              },
            },
            create: {
              marketplace: 'ciceksepeti',
              marketplaceCategoryId: String(cat.id),
              categoryName: cat.name ?? '',
              parentId,
            },
            update: {
              categoryName: cat.name ?? '',
              parentId,
            },
          });
          count++;

          if (cat.subCategories?.length) {
            await saveRecursive(cat.subCategories, String(cat.id));
          }
        }
      };

      await saveRecursive(categories, null);

      await prisma.syncLog.create({
        data: {
          marketplace: 'ciceksepeti',
          action: 'category_sync',
          status: 'completed',
          itemCount: count,
        },
      });

      this.logger.log(
        `Ciceksepeti category sync completed: ${count} categories`,
      );
      return { synced: count };
    } catch (error) {
      await prisma.syncLog.create({
        data: {
          marketplace: 'ciceksepeti',
          action: 'category_sync',
          status: 'failed',
          details: {
            error: error instanceof Error ? error.message : String(error),
          },
        },
      });
      throw error;
    }
  }

  async getCategoryAttributes(
    credentials: CiceksepetiCredentials,
    categoryId: number,
  ): Promise<unknown[]> {
    const json = await this.csFetch<{ categoryAttributes?: unknown[] }>(
      `/Categories/${categoryId}/attributes`,
      credentials,
    );

    return json.categoryAttributes ?? [];
  }

  // ─── Products ───────────────────────────────────────────

  async getProducts(
    tenantSlug: string,
    _credentials: CiceksepetiCredentials,
    _filters: CSFilterOptions = {},
  ): Promise<{
    products: unknown[];
    totalElements: number;
  }> {
    // Ciceksepeti does not provide a standard product listing endpoint.
    // Products are tracked via batch status after submission.
    const prisma = getTenantClient(tenantSlug);

    const listings = await prisma.marketplaceListing.findMany({
      where: { marketplace: 'ciceksepeti' },
      include: { product: true },
      take: _filters.size ?? 50,
      skip: (_filters.page ?? 0) * (_filters.size ?? 50),
    });

    return {
      products: listings.map((l) => ({
        listingId: l.id,
        productId: l.productId,
        status: l.status,
        batchId: l.batchId,
        product: l.product,
      })),
      totalElements: listings.length,
    };
  }

  async importProducts(
    tenantSlug: string,
    credentials: CiceksepetiCredentials,
    _filters: CSFilterOptions = {},
  ): Promise<{ imported: number; skipped: number; errors: string[] }> {
    // Ciceksepeti does not expose a product pull endpoint.
    // Import is not available; products are pushed to CS, not pulled from it.
    this.logger.warn(
      'Ciceksepeti does not support product import (pull). Use sendProducts to push products.',
    );

    const prisma = getTenantClient(tenantSlug);

    await prisma.syncLog.create({
      data: {
        marketplace: 'ciceksepeti',
        action: 'import',
        status: 'completed',
        details: {
          message:
            'Ciceksepeti does not support product import. Use sendProducts instead.',
        },
      },
    });

    return { imported: 0, skipped: 0, errors: [] };
  }

  // ─── Send Products to CS ────────────────────────────────

  async sendProducts(
    tenantSlug: string,
    credentials: CiceksepetiCredentials,
    productIds: string[],
  ): Promise<{ batchId: string | null; sentCount: number }> {
    const prisma = getTenantClient(tenantSlug);

    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, status: 'active' },
      include: {
        category: {
          include: {
            marketplaceMappings: {
              where: { marketplace: 'ciceksepeti' },
            },
          },
        },
      },
    });

    if (products.length === 0) {
      throw new BadRequestException(
        'No active products found with the given IDs.',
      );
    }

    const csProducts: CSProductPayload[] = [];

    for (const product of products) {
      const mapping = product.category?.marketplaceMappings?.[0];
      if (!mapping) {
        this.logger.warn(
          `Product ${product.id} skipped: no Ciceksepeti category mapping for category ${product.categoryId}`,
        );
        continue;
      }

      const name =
        (product.name as Record<string, string>)?.en ??
        (product.name as Record<string, string>)?.tr ??
        '';
      let description = product.description
        ? ((product.description as Record<string, string>)?.en ??
            (product.description as Record<string, string>)?.tr ??
            '')
        : '';

      // Ciceksepeti requires minimum 30 characters description
      if (description.length < 30) {
        description = description.padEnd(30, ' ');
      }

      const images = (product.images as string[]) ?? [];
      const sku = product.sku ?? product.id;
      const compareAtPrice = product.compareAtPrice
        ? Number(product.compareAtPrice)
        : Number(product.price);

      // Build attribute array from mapping defaults
      const attributeDefaults = mapping.attributeMapping as
        | { Id: number; ValueId: number; TextLength?: number }[]
        | null;
      const attributes = (attributeDefaults ?? []).map((attr) => ({
        Id: attr.Id,
        ValueId: attr.ValueId,
        TextLength: attr.TextLength ?? 0,
      }));

      csProducts.push({
        productName: name,
        mainProductCode: sku,
        stockCode: sku,
        categoryId: parseInt(mapping.marketplaceCategoryId, 10),
        description,
        deliveryMessageType: 5,
        deliveryType: 2,
        stockQuantity: product.stock,
        salesPrice: Number(product.price),
        listPrice: compareAtPrice,
        barcode: product.barcode ?? '',
        images,
        Attributes: attributes,
      });
    }

    if (csProducts.length === 0) {
      throw new BadRequestException(
        'No products could be mapped to Ciceksepeti categories. Check category mappings.',
      );
    }

    if (csProducts.length > CS_MAX_PRODUCTS_PER_BATCH) {
      throw new BadRequestException(
        `Ciceksepeti allows max ${CS_MAX_PRODUCTS_PER_BATCH} products per batch. Got ${csProducts.length}.`,
      );
    }

    this.logger.log(
      `Sending ${csProducts.length} products to Ciceksepeti`,
    );

    const result = await this.csFetch<{ batchId?: string }>(
      '/Products',
      credentials,
      {
        method: 'POST',
        body: { products: csProducts },
      },
    );

    const batchId = result.batchId ?? null;

    // Upsert marketplace listings
    for (const product of products) {
      await prisma.marketplaceListing.upsert({
        where: {
          marketplace_productId: {
            marketplace: 'ciceksepeti',
            productId: product.id,
          },
        },
        create: {
          marketplace: 'ciceksepeti',
          productId: product.id,
          batchId,
          status: 'sent',
          lastSyncedAt: new Date(),
        },
        update: {
          batchId,
          status: 'sent',
          lastSyncedAt: new Date(),
          errorMessage: null,
        },
      });
    }

    await prisma.syncLog.create({
      data: {
        marketplace: 'ciceksepeti',
        action: 'export',
        status: 'completed',
        itemCount: csProducts.length,
        details: { batchId },
      },
    });

    return { batchId, sentCount: csProducts.length };
  }

  // ─── Price & Stock Sync ─────────────────────────────────

  async syncPriceAndStock(
    tenantSlug: string,
    credentials: CiceksepetiCredentials,
    productIds?: string[],
  ): Promise<{
    batchId: string | null;
    count: number;
  }> {
    const prisma = getTenantClient(tenantSlug);

    const whereClause = productIds?.length
      ? {
          marketplace: 'ciceksepeti' as const,
          productId: { in: productIds },
        }
      : { marketplace: 'ciceksepeti' as const };

    const listings = await prisma.marketplaceListing.findMany({
      where: whereClause,
      include: { product: true },
    });

    if (listings.length === 0) {
      return { batchId: null, count: 0 };
    }

    if (listings.length > CS_MAX_PRICE_STOCK_PER_BATCH) {
      throw new BadRequestException(
        `Ciceksepeti allows max ${CS_MAX_PRICE_STOCK_PER_BATCH} items for price/stock update. Got ${listings.length}.`,
      );
    }

    const items: CSPriceStockItem[] = listings.map((listing) => {
      const sku = listing.product.sku ?? listing.product.id;
      const compareAtPrice = listing.product.compareAtPrice
        ? Number(listing.product.compareAtPrice)
        : Number(listing.product.price);

      return {
        stockCode: sku,
        salesPrice: Number(listing.product.price),
        listPrice: compareAtPrice,
        stockQuantity: listing.product.stock,
      };
    });

    const result = await this.csFetch<{ batchId?: string }>(
      '/Products/price-and-stock',
      credentials,
      {
        method: 'PUT',
        body: { items },
      },
    );

    const batchId = result.batchId ?? null;

    // Update listing sync timestamps
    for (const listing of listings) {
      await prisma.marketplaceListing.update({
        where: { id: listing.id },
        data: { lastSyncedAt: new Date() },
      });
    }

    await prisma.syncLog.create({
      data: {
        marketplace: 'ciceksepeti',
        action: 'price_sync',
        status: 'completed',
        itemCount: listings.length,
        details: { batchId },
      },
    });

    return { batchId, count: listings.length };
  }

  // ─── Batch status tracking ──────────────────────────────

  async getBatchStatus(
    credentials: CiceksepetiCredentials,
    batchId: string,
  ): Promise<unknown> {
    return this.csFetch(
      `/Products/batch-status/${batchId}`,
      credentials,
    );
  }

  async getBatchFailedItems(
    credentials: CiceksepetiCredentials,
    batchId: string,
  ): Promise<
    { stockCode: string | null; reasons: { message: string; code: string | null }[] }[]
  > {
    const result = (await this.getBatchStatus(credentials, batchId)) as {
      items?: {
        status?: string;
        data?: { stockCode?: string };
        failureReasons?: { message?: string; code?: string }[];
      }[];
    };

    const failedItems: {
      stockCode: string | null;
      reasons: { message: string; code: string | null }[];
    }[] = [];

    for (const item of result.items ?? []) {
      if (item.status === 'Failed') {
        const reasons = (item.failureReasons ?? []).map((reason) => ({
          message: reason.message ?? '',
          code: reason.code ?? null,
        }));

        failedItems.push({
          stockCode: item.data?.stockCode ?? null,
          reasons,
        });
      }
    }

    return failedItems;
  }
}
