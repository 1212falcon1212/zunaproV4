import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { getTenantClient } from '@zunapro/db';
import { BaseMarketplaceService } from './base-marketplace.service';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TrendyolCredentials {
  supplierId: string;
  apiKey: string;
  apiSecret: string;
}

interface TrendyolProduct {
  id: number;
  barcode: string;
  title: string;
  productMainId: string;
  brandId: number;
  brandName: string;
  categoryName: string;
  pimCategoryId: number;
  quantity: number;
  salePrice: number;
  listPrice: number;
  stockCode: string;
  description: string;
  images: { url: string }[];
  attributes: { attributeId: number; attributeValueId: number; attributeName: string; attributeValue: string }[];
  approved: boolean;
  onSale: boolean;
  archived: boolean;
  rejected: boolean;
}

interface TrendyolProductResponse {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  content: TrendyolProduct[];
}

interface TrendyolCategory {
  id: number;
  name: string;
  subCategories?: TrendyolCategory[];
}

interface FilterOptions {
  page?: number;
  size?: number;
  approved?: boolean;
  onSale?: boolean;
  barcode?: string;
  stockCode?: string;
}

interface SendProductItem {
  barcode: string;
  title: string;
  productMainId: string;
  brandId: number;
  categoryId: number;
  quantity: number;
  stockCode: string;
  description: string;
  currencyType: string;
  listPrice: number;
  salePrice: number;
  vatRate: number;
  images: { url: string }[];
  attributes: { attributeId: number; attributeValueId: number }[];
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TRENDYOL_API_BASE = 'https://apigw.trendyol.com';
const MARKETPLACE_NAME = 'trendyol';
const MAX_PRICE_STOCK_BATCH = 1000;

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

@Injectable()
export class TrendyolService extends BaseMarketplaceService {
  constructor() {
    super(
      { maxRequests: 50, windowMs: 10_000 },
      { maxRetries: 3, baseDelayMs: 1_000 },
    );
  }

  protected getMarketplaceName(): string {
    return 'Trendyol';
  }

  // -----------------------------------------------------------------------
  // Auth helpers
  // -----------------------------------------------------------------------

  private buildHeaders(credentials: TrendyolCredentials): Record<string, string> {
    const encoded = Buffer.from(
      `${credentials.apiKey}:${credentials.apiSecret}`,
    ).toString('base64');

    return {
      Authorization: `Basic ${encoded}`,
      'User-Agent': `${credentials.supplierId} - SelfIntegration`,
      'Content-Type': 'application/json',
    };
  }

  private async apiGet<T>(
    path: string,
    credentials: TrendyolCredentials,
  ): Promise<T> {
    return this.rateLimitedFetch<T>(`${TRENDYOL_API_BASE}${path}`, {
      method: 'GET',
      headers: this.buildHeaders(credentials),
    });
  }

  private async apiPost<T>(
    path: string,
    credentials: TrendyolCredentials,
    body: unknown,
  ): Promise<T> {
    return this.rateLimitedFetch<T>(`${TRENDYOL_API_BASE}${path}`, {
      method: 'POST',
      headers: this.buildHeaders(credentials),
      body: JSON.stringify(body),
    });
  }

  // -----------------------------------------------------------------------
  // 1. Credentials CRUD
  // -----------------------------------------------------------------------

  async saveCredentials(
    tenantSlug: string,
    credentials: TrendyolCredentials,
  ): Promise<void> {
    const prisma = getTenantClient(tenantSlug);

    await prisma.marketplaceIntegration.upsert({
      where: { marketplace: MARKETPLACE_NAME },
      create: {
        marketplace: MARKETPLACE_NAME,
        credentials: {
          supplierId: credentials.supplierId,
          apiKey: credentials.apiKey,
          apiSecret: credentials.apiSecret,
        },
        isActive: true,
      },
      update: {
        credentials: {
          supplierId: credentials.supplierId,
          apiKey: credentials.apiKey,
          apiSecret: credentials.apiSecret,
        },
        isActive: true,
      },
    });

    this.logger.log(`Trendyol credentials saved for tenant ${tenantSlug}`);
  }

  async getCredentials(
    tenantSlug: string,
  ): Promise<TrendyolCredentials | null> {
    const prisma = getTenantClient(tenantSlug);

    const integration = await prisma.marketplaceIntegration.findUnique({
      where: { marketplace: MARKETPLACE_NAME },
    });

    if (!integration?.credentials) return null;

    const creds = integration.credentials as Record<string, string>;
    if (!creds.supplierId || !creds.apiKey || !creds.apiSecret) return null;

    return {
      supplierId: creds.supplierId,
      apiKey: creds.apiKey,
      apiSecret: creds.apiSecret,
    };
  }

  async removeCredentials(tenantSlug: string): Promise<void> {
    const prisma = getTenantClient(tenantSlug);

    await prisma.marketplaceIntegration
      .delete({ where: { marketplace: MARKETPLACE_NAME } })
      .catch(() => {
        /* no-op if row missing */
      });

    this.logger.log(`Trendyol credentials removed for tenant ${tenantSlug}`);
  }

  // -----------------------------------------------------------------------
  // Helper: resolve credentials or throw
  // -----------------------------------------------------------------------

  private async resolveCredentials(
    tenantSlug: string,
  ): Promise<TrendyolCredentials> {
    const creds = await this.getCredentials(tenantSlug);
    if (!creds) {
      throw new UnauthorizedException(
        'Trendyol is not connected. Save credentials first.',
      );
    }
    return creds;
  }

  // -----------------------------------------------------------------------
  // 4. Test connection
  // -----------------------------------------------------------------------

  async testConnection(tenantSlug: string): Promise<boolean> {
    try {
      const creds = await this.resolveCredentials(tenantSlug);
      await this.apiGet<TrendyolProductResponse>(
        `/integration/product/sellers/${creds.supplierId}/products?page=0&size=1`,
        creds,
      );
      return true;
    } catch (error) {
      this.logger.warn('Trendyol connection test failed', error);
      return false;
    }
  }

  /**
   * Variant that accepts raw credentials (used during the connect flow
   * before credentials are persisted).
   */
  async testConnectionWithCredentials(
    credentials: TrendyolCredentials,
  ): Promise<boolean> {
    try {
      await this.apiGet<TrendyolProductResponse>(
        `/integration/product/sellers/${credentials.supplierId}/products?page=0&size=1`,
        credentials,
      );
      return true;
    } catch (error) {
      this.logger.warn('Trendyol connection test failed', error);
      return false;
    }
  }

  // -----------------------------------------------------------------------
  // 5. Sync categories
  // -----------------------------------------------------------------------

  async syncCategories(
    tenantSlug: string,
  ): Promise<{ synced: number }> {
    const creds = await this.resolveCredentials(tenantSlug);
    const prisma = getTenantClient(tenantSlug);

    const syncLog = await prisma.syncLog.create({
      data: {
        marketplace: MARKETPLACE_NAME,
        action: 'category_sync',
        status: 'started',
      },
    });

    try {
      const data = await this.apiGet<{ categories: TrendyolCategory[] }>(
        '/integration/product/product-categories',
        creds,
      );

      const categories = data.categories ?? [];
      let count = 0;

      const saveRecursive = async (
        cats: TrendyolCategory[],
        parentId: string | null,
      ): Promise<void> => {
        for (const cat of cats) {
          await prisma.marketplaceCategory.upsert({
            where: {
              marketplace_marketplaceCategoryId: {
                marketplace: MARKETPLACE_NAME,
                marketplaceCategoryId: String(cat.id),
              },
            },
            create: {
              marketplace: MARKETPLACE_NAME,
              marketplaceCategoryId: String(cat.id),
              categoryName: cat.name,
              parentId,
            },
            update: {
              categoryName: cat.name,
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

      await prisma.syncLog.update({
        where: { id: syncLog.id },
        data: { status: 'completed', itemCount: count },
      });

      this.logger.log(`Synced ${count} Trendyol categories for tenant ${tenantSlug}`);
      return { synced: count };
    } catch (error) {
      await prisma.syncLog.update({
        where: { id: syncLog.id },
        data: {
          status: 'failed',
          details: { error: error instanceof Error ? error.message : String(error) },
          errorCount: 1,
        },
      });
      throw error;
    }
  }

  // -----------------------------------------------------------------------
  // 6. Category attributes
  // -----------------------------------------------------------------------

  async getCategoryAttributes(
    tenantSlug: string,
    marketplaceCategoryId: string,
  ): Promise<{ categoryAttributes: unknown[] }> {
    const creds = await this.resolveCredentials(tenantSlug);

    const data = await this.apiGet<{ categoryAttributes: unknown[] }>(
      `/integration/product/product-categories/${marketplaceCategoryId}/attributes`,
      creds,
    );

    // Cache in DB
    const prisma = getTenantClient(tenantSlug);
    await prisma.marketplaceCategory
      .update({
        where: {
          marketplace_marketplaceCategoryId: {
            marketplace: MARKETPLACE_NAME,
            marketplaceCategoryId,
          },
        },
        data: { attributes: (data.categoryAttributes ?? []) as object },
      })
      .catch(() => {
        /* category might not be synced yet */
      });

    return data;
  }

  // -----------------------------------------------------------------------
  // 7. Get products from Trendyol
  // -----------------------------------------------------------------------

  async getProducts(
    tenantSlug: string,
    filters: FilterOptions = {},
  ): Promise<TrendyolProductResponse> {
    const creds = await this.resolveCredentials(tenantSlug);

    const params = new URLSearchParams();
    params.set('page', String(filters.page ?? 0));
    params.set('size', String(Math.min(filters.size ?? 50, 200)));

    if (filters.approved !== undefined) params.set('approved', String(filters.approved));
    if (filters.onSale !== undefined) params.set('onSale', String(filters.onSale));
    if (filters.barcode) params.set('barcode', filters.barcode);
    if (filters.stockCode) params.set('stockCode', filters.stockCode);

    return this.apiGet<TrendyolProductResponse>(
      `/integration/product/sellers/${creds.supplierId}/products?${params.toString()}`,
      creds,
    );
  }

  // -----------------------------------------------------------------------
  // 8. Import products (Trendyol -> local DB)
  // -----------------------------------------------------------------------

  async importProducts(
    tenantSlug: string,
    filters: FilterOptions = {},
  ): Promise<{ imported: number; skipped: number; errors: string[] }> {
    const prisma = getTenantClient(tenantSlug);
    const response = await this.getProducts(tenantSlug, filters);
    const products = response.content;

    const syncLog = await prisma.syncLog.create({
      data: {
        marketplace: MARKETPLACE_NAME,
        action: 'import',
        status: 'started',
        itemCount: products.length,
      },
    });

    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const tp of products) {
      try {
        const slug = this.generateSlug(tp.title);

        // Skip if already imported
        const existing = await prisma.product.findFirst({
          where: {
            OR: [
              { barcode: tp.barcode || undefined },
              { sku: tp.stockCode || undefined },
            ].filter((clause) => Object.values(clause).some(Boolean)),
          },
        });

        if (existing) {
          // Ensure a MarketplaceListing link exists
          await prisma.marketplaceListing.upsert({
            where: {
              marketplace_productId: {
                marketplace: MARKETPLACE_NAME,
                productId: existing.id,
              },
            },
            create: {
              marketplace: MARKETPLACE_NAME,
              productId: existing.id,
              marketplaceProductId: String(tp.id),
              status: 'approved',
              lastSyncedAt: new Date(),
            },
            update: {
              marketplaceProductId: String(tp.id),
              lastSyncedAt: new Date(),
            },
          });
          skipped++;
          continue;
        }

        const images = tp.images?.map((img) => img.url) ?? [];

        const product = await prisma.product.create({
          data: {
            name: { tr: tp.title, en: tp.title },
            slug: `${slug}-${Date.now()}`,
            description: tp.description
              ? { tr: tp.description, en: tp.description }
              : {},
            price: tp.salePrice,
            compareAtPrice: tp.listPrice > tp.salePrice ? tp.listPrice : null,
            sku: tp.stockCode || null,
            barcode: tp.barcode || null,
            stock: tp.quantity,
            images,
            status: 'draft',
            isFeatured: false,
          },
        });

        await prisma.marketplaceListing.create({
          data: {
            marketplace: MARKETPLACE_NAME,
            productId: product.id,
            marketplaceProductId: String(tp.id),
            status: 'approved',
            lastSyncedAt: new Date(),
            syncData: {
              trendyolBrand: tp.brandName,
              trendyolCategory: tp.categoryName,
              trendyolCategoryId: tp.pimCategoryId,
            },
          },
        });

        imported++;
      } catch (err) {
        const msg = err instanceof Error ? err.message : `Failed to import: ${tp.title}`;
        errors.push(msg);
        this.logger.warn(`Trendyol import error for ${tp.title}`, err);
      }
    }

    await prisma.syncLog.update({
      where: { id: syncLog.id },
      data: {
        status: errors.length > 0 ? 'completed' : 'completed',
        itemCount: imported,
        errorCount: errors.length,
        details: errors.length > 0 ? { errors: errors.slice(0, 50) } : undefined,
      },
    });

    this.logger.log(
      `Trendyol import: ${imported} imported, ${skipped} skipped, ${errors.length} errors (tenant: ${tenantSlug})`,
    );

    return { imported, skipped, errors };
  }

  // -----------------------------------------------------------------------
  // 9. Send products (local DB -> Trendyol)
  // -----------------------------------------------------------------------

  async sendProducts(
    tenantSlug: string,
    productIds: string[],
  ): Promise<{ batchId: string }> {
    const creds = await this.resolveCredentials(tenantSlug);
    const prisma = getTenantClient(tenantSlug);

    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { marketplaceListings: true },
    });

    if (products.length === 0) {
      throw new NotFoundException('No products found for given IDs.');
    }

    // Resolve marketplace category mappings for the products
    const categoryIds = [
      ...new Set(products.map((p) => p.categoryId).filter(Boolean)),
    ] as string[];

    const categoryMappings = await prisma.marketplaceCategoryMapping.findMany({
      where: {
        marketplace: MARKETPLACE_NAME,
        localCategoryId: { in: categoryIds },
      },
    });

    const categoryMap = new Map(
      categoryMappings.map((m) => [m.localCategoryId, m]),
    );

    const items: SendProductItem[] = [];

    for (const product of products) {
      const name = product.name as Record<string, string>;
      const description = (product.description ?? {}) as Record<string, string>;
      const images = (product.images ?? []) as string[];

      const mapping = product.categoryId
        ? categoryMap.get(product.categoryId)
        : null;

      if (!mapping) {
        throw new BadRequestException(
          `Product "${name.en || name.tr}" has no Trendyol category mapping. Map the category first.`,
        );
      }

      const attributeMapping = (mapping.attributeMapping ?? []) as {
        attributeId: number;
        attributeValueId: number;
      }[];

      items.push({
        barcode: product.barcode || product.sku || product.id,
        title: name.tr || name.en || '',
        productMainId: product.sku || product.barcode || product.id,
        brandId: 0, // Must be set via attribute mapping or defaults
        categoryId: Number(mapping.marketplaceCategoryId),
        quantity: product.stock,
        stockCode: product.sku || product.id,
        description: description.tr || description.en || '',
        currencyType: 'TRY',
        listPrice: Number(product.compareAtPrice ?? product.price),
        salePrice: Number(product.price),
        vatRate: 20,
        images: images.map((url) => ({ url })),
        attributes: attributeMapping,
      });
    }

    const result = await this.apiPost<{ batchRequestId: string }>(
      `/integration/product/sellers/${creds.supplierId}/products`,
      creds,
      { items },
    );

    const batchId = result.batchRequestId;

    // Create/update MarketplaceListing for each product
    for (const product of products) {
      await prisma.marketplaceListing.upsert({
        where: {
          marketplace_productId: {
            marketplace: MARKETPLACE_NAME,
            productId: product.id,
          },
        },
        create: {
          marketplace: MARKETPLACE_NAME,
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
        marketplace: MARKETPLACE_NAME,
        action: 'export',
        status: 'completed',
        itemCount: items.length,
        details: { batchId },
      },
    });

    this.logger.log(
      `Sent ${items.length} products to Trendyol, batchId: ${batchId} (tenant: ${tenantSlug})`,
    );

    return { batchId };
  }

  // -----------------------------------------------------------------------
  // 10. Sync price and stock
  // -----------------------------------------------------------------------

  async syncPriceAndStock(
    tenantSlug: string,
    productIds?: string[],
  ): Promise<{ batchId: string }> {
    const creds = await this.resolveCredentials(tenantSlug);
    const prisma = getTenantClient(tenantSlug);

    const listings = await prisma.marketplaceListing.findMany({
      where: {
        marketplace: MARKETPLACE_NAME,
        productId: { in: productIds },
        marketplaceProductId: { not: null },
      },
      include: { product: true },
    });

    if (listings.length === 0) {
      throw new NotFoundException(
        'No Trendyol listings found for given product IDs.',
      );
    }

    if (listings.length > MAX_PRICE_STOCK_BATCH) {
      throw new BadRequestException(
        `Maximum ${MAX_PRICE_STOCK_BATCH} items per price/stock sync.`,
      );
    }

    const items = listings.map((listing) => ({
      barcode:
        listing.product.barcode ||
        listing.product.sku ||
        listing.product.id,
      quantity: listing.product.stock,
      salePrice: Number(listing.product.price),
      listPrice: Number(listing.product.compareAtPrice ?? listing.product.price),
    }));

    const result = await this.apiPost<{ batchRequestId: string }>(
      `/integration/inventory/sellers/${creds.supplierId}/products/price-and-inventory`,
      creds,
      { items },
    );

    const batchId = result.batchRequestId;

    // Update listing sync timestamps
    await prisma.marketplaceListing.updateMany({
      where: {
        marketplace: MARKETPLACE_NAME,
        productId: { in: productIds },
      },
      data: { lastSyncedAt: new Date() },
    });

    await prisma.syncLog.create({
      data: {
        marketplace: MARKETPLACE_NAME,
        action: 'price_sync',
        status: 'completed',
        itemCount: items.length,
        details: { batchId },
      },
    });

    this.logger.log(
      `Price/stock sync for ${items.length} products, batchId: ${batchId} (tenant: ${tenantSlug})`,
    );

    return { batchId };
  }

  // -----------------------------------------------------------------------
  // 11. Batch status
  // -----------------------------------------------------------------------

  async getBatchStatus(
    tenantSlug: string,
    batchId: string,
  ): Promise<Record<string, unknown>> {
    const creds = await this.resolveCredentials(tenantSlug);

    return this.apiGet<Record<string, unknown>>(
      `/integration/product/sellers/${creds.supplierId}/products/batch-requests/${batchId}`,
      creds,
    );
  }

  // -----------------------------------------------------------------------
  // Helpers
  // -----------------------------------------------------------------------

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\u00e7\u011f\u0131\u00f6\u015f\u00fc]+/gi, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 80);
  }
}
