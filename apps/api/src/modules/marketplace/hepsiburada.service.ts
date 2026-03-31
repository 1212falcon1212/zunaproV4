import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { getTenantClient } from '@zunapro/db';
import { BaseMarketplaceService } from './base-marketplace.service';

const HB_PRODUCT_BASE = 'https://mpop.hepsiburada.com';
const HB_LISTING_BASE = 'https://listing-external.hepsiburada.com';

interface HepsiburadaCredentials {
  merchantId: string;
  apiKey: string;
  apiSecret: string;
}

interface HBCategory {
  categoryId: number;
  name: string;
  parentCategoryId?: number;
}

interface HBCategoryAttributes {
  success: boolean;
  categoryId: number;
  baseAttributes: unknown[];
  attributes: unknown[];
  variantAttributes: unknown[];
}

interface HBProductItem {
  categoryId: number;
  merchant: string;
  attributes: Record<string, unknown>;
}

interface HBFilterOptions {
  page?: number;
  size?: number;
  status?: string;
}

@Injectable()
export class HepsiburadaService extends BaseMarketplaceService {
  constructor() {
    // 500 req/s rate limit
    super(
      { maxRequests: 500, windowMs: 1_000 },
      { maxRetries: 3, baseDelayMs: 1_000 },
    );
  }

  protected getMarketplaceName(): string {
    return 'Hepsiburada';
  }

  // ─── Auth helpers ───────────────────────────────────────

  private buildAuthHeader(credentials: HepsiburadaCredentials): string {
    const encoded = Buffer.from(
      `${credentials.apiKey}:${credentials.apiSecret}`,
    ).toString('base64');
    return `Basic ${encoded}`;
  }

  private buildHeaders(credentials: HepsiburadaCredentials): Record<string, string> {
    return {
      Authorization: this.buildAuthHeader(credentials),
      'User-Agent': `${credentials.merchantId} - SelfIntegration`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
  }

  // ─── HTTP wrappers ─────────────────────────────────────

  private async hbFetch<T>(
    baseUrl: string,
    path: string,
    credentials: HepsiburadaCredentials,
    options?: {
      method?: string;
      body?: unknown;
      query?: Record<string, string | number>;
    },
  ): Promise<T> {
    const params = options?.query
      ? '?' +
        new URLSearchParams(
          Object.entries(options.query).map(([k, v]) => [k, String(v)]),
        ).toString()
      : '';

    const url = `${baseUrl}${path}${params}`;
    const headers = this.buildHeaders(credentials);

    try {
      return await this.rateLimitedFetch<T>(url, {
        method: options?.method ?? 'GET',
        headers,
        body: options?.body ? JSON.stringify(options.body) : undefined,
      });
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      if (msg.includes('401')) {
        throw new UnauthorizedException(
          'Hepsiburada API authentication failed. Check your credentials.',
        );
      }
      throw new BadRequestException(`Hepsiburada API error: ${msg}`);
    }
  }

  /**
   * Hepsiburada product import requires multipart form-data with a JSON file attachment.
   * This bypasses the standard rateLimitedFetch because FormData sets its own Content-Type.
   */
  private async hbMultipartUpload<T>(
    path: string,
    credentials: HepsiburadaCredentials,
    jsonPayload: unknown,
  ): Promise<T> {
    const url = `${HB_PRODUCT_BASE}${path}`;
    const fileName = `products_${Date.now()}.json`;
    const jsonContent = JSON.stringify(jsonPayload);

    this.logger.log(
      `Hepsiburada multipart upload: ${(jsonPayload as unknown[]).length ?? 0} items`,
    );

    const formData = new FormData();
    const blob = new Blob([jsonContent], { type: 'application/json' });
    formData.append('file', blob, fileName);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: this.buildAuthHeader(credentials),
        'User-Agent': `${credentials.merchantId} - SelfIntegration`,
        Accept: 'application/json',
        // Content-Type intentionally omitted: fetch sets multipart boundary
      },
      body: formData,
    });

    if (response.status === 401) {
      throw new UnauthorizedException(
        'Hepsiburada API authentication failed. Check your credentials.',
      );
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new BadRequestException(
        `Hepsiburada product upload error (${response.status}): ${errorText}`,
      );
    }

    return response.json() as Promise<T>;
  }

  // ─── Credentials ────────────────────────────────────────

  async saveCredentials(
    tenantSlug: string,
    credentials: HepsiburadaCredentials,
  ): Promise<void> {
    const prisma = getTenantClient(tenantSlug);

    await prisma.marketplaceIntegration.upsert({
      where: { marketplace: 'hepsiburada' },
      create: {
        marketplace: 'hepsiburada',
        credentials: {
          merchantId: credentials.merchantId,
          apiKey: credentials.apiKey,
          apiSecret: credentials.apiSecret,
          connectedAt: new Date().toISOString(),
        },
        isActive: true,
      },
      update: {
        credentials: {
          merchantId: credentials.merchantId,
          apiKey: credentials.apiKey,
          apiSecret: credentials.apiSecret,
          connectedAt: new Date().toISOString(),
        },
        isActive: true,
      },
    });

    this.logger.log(`Hepsiburada credentials saved for tenant ${tenantSlug}`);
  }

  async getCredentials(
    tenantSlug: string,
  ): Promise<HepsiburadaCredentials | null> {
    const prisma = getTenantClient(tenantSlug);

    const integration = await prisma.marketplaceIntegration.findUnique({
      where: { marketplace: 'hepsiburada' },
    });

    if (!integration?.credentials || !integration.isActive) return null;

    const creds = integration.credentials as Record<string, string>;
    if (!creds.merchantId || !creds.apiKey || !creds.apiSecret) return null;

    return {
      merchantId: creds.merchantId,
      apiKey: creds.apiKey,
      apiSecret: creds.apiSecret,
    };
  }

  async removeCredentials(tenantSlug: string): Promise<void> {
    const prisma = getTenantClient(tenantSlug);
    await prisma.marketplaceIntegration
      .delete({ where: { marketplace: 'hepsiburada' } })
      .catch(() => {});

    this.logger.log(`Hepsiburada credentials removed for tenant ${tenantSlug}`);
  }

  // ─── Connection test ────────────────────────────────────

  async testConnectionWithCredentials(credentials: HepsiburadaCredentials): Promise<boolean> {
    return this.testConnectionRaw(credentials);
  }

  async testConnection(tenantSlugOrCreds: string | HepsiburadaCredentials): Promise<boolean> {
    if (typeof tenantSlugOrCreds === 'string') {
      const creds = await this.getCredentials(tenantSlugOrCreds);
      if (!creds) return false;
      return this.testConnectionRaw(creds);
    }
    return this.testConnectionRaw(tenantSlugOrCreds);
  }

  private async testConnectionRaw(credentials: HepsiburadaCredentials): Promise<boolean> {
    try {
      await this.hbFetch<unknown>(
        HB_PRODUCT_BASE,
        '/product/api/categories/get-all-categories',
        credentials,
        {
          query: {
            status: 'ACTIVE',
            type: 'HB',
            version: 1,
            page: 0,
            size: 1,
          },
        },
      );
      return true;
    } catch (error) {
      this.logger.warn('Hepsiburada connection test failed', error);
      return false;
    }
  }

  // ─── Categories ─────────────────────────────────────────

  async syncCategories(
    tenantSlug: string,
    credentials: HepsiburadaCredentials,
  ): Promise<{ synced: number }> {
    const prisma = getTenantClient(tenantSlug);
    let page = 0;
    const size = 2000;
    let totalSynced = 0;

    await prisma.syncLog.create({
      data: {
        marketplace: 'hepsiburada',
        action: 'category_sync',
        status: 'started',
      },
    });

    this.logger.log('Hepsiburada category sync started');

    try {
      while (true) {
        const result = await this.fetchCategoriesPage(credentials, page, size);

        if (result.categories.length === 0) break;

        for (const cat of result.categories) {
          await prisma.marketplaceCategory.upsert({
            where: {
              marketplace_marketplaceCategoryId: {
                marketplace: 'hepsiburada',
                marketplaceCategoryId: String(cat.categoryId),
              },
            },
            create: {
              marketplace: 'hepsiburada',
              marketplaceCategoryId: String(cat.categoryId),
              categoryName: cat.name ?? '',
              parentId: cat.parentCategoryId
                ? String(cat.parentCategoryId)
                : null,
            },
            update: {
              categoryName: cat.name ?? '',
              parentId: cat.parentCategoryId
                ? String(cat.parentCategoryId)
                : null,
            },
          });
        }

        totalSynced += result.categories.length;

        if (result.last) break;
        page++;
      }

      await prisma.syncLog.create({
        data: {
          marketplace: 'hepsiburada',
          action: 'category_sync',
          status: 'completed',
          itemCount: totalSynced,
        },
      });

      this.logger.log(
        `Hepsiburada category sync completed: ${totalSynced} categories`,
      );
      return { synced: totalSynced };
    } catch (error) {
      await prisma.syncLog.create({
        data: {
          marketplace: 'hepsiburada',
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

  private async fetchCategoriesPage(
    credentials: HepsiburadaCredentials,
    page: number,
    size: number,
  ): Promise<{
    categories: HBCategory[];
    last: boolean;
    totalPages: number;
    totalElements: number;
  }> {
    const json = await this.hbFetch<{
      data: HBCategory[];
      last: boolean;
      totalPages: number;
      totalElements: number;
    }>(
      HB_PRODUCT_BASE,
      '/product/api/categories/get-all-categories',
      credentials,
      {
        query: {
          status: 'ACTIVE',
          type: 'HB',
          version: 1,
          page,
          size,
        },
      },
    );

    return {
      categories: json.data ?? [],
      last: json.last ?? true,
      totalPages: json.totalPages ?? 1,
      totalElements: json.totalElements ?? 0,
    };
  }

  async getCategoryAttributes(
    credentials: HepsiburadaCredentials,
    categoryId: number,
  ): Promise<HBCategoryAttributes> {
    try {
      const json = await this.hbFetch<{
        success?: boolean;
        data?: {
          baseAttributes?: unknown[];
          attributes?: unknown[];
          variantAttributes?: unknown[];
        };
        baseAttributes?: unknown[];
        attributes?: unknown[];
        variantAttributes?: unknown[];
      }>(
        HB_PRODUCT_BASE,
        `/product/api/categories/${categoryId}/attributes`,
        credentials,
        { query: { version: 2 } },
      );

      if (json.success === false) {
        return {
          success: false,
          categoryId,
          baseAttributes: [],
          attributes: [],
          variantAttributes: [],
        };
      }

      const data = json.data ?? json;

      return {
        success: json.success ?? true,
        categoryId,
        baseAttributes: data.baseAttributes ?? [],
        attributes: data.attributes ?? [],
        variantAttributes: data.variantAttributes ?? [],
      };
    } catch {
      return {
        success: false,
        categoryId,
        baseAttributes: [],
        attributes: [],
        variantAttributes: [],
      };
    }
  }

  async getAttributeValues(
    credentials: HepsiburadaCredentials,
    categoryId: number,
    attributeId: string,
  ): Promise<{
    categoryId: number;
    attributeId: string;
    values: unknown[];
  }> {
    const json = await this.hbFetch<{ data?: unknown[] }>(
      HB_PRODUCT_BASE,
      `/product/api/categories/${categoryId}/attribute/${attributeId}/values`,
      credentials,
      { query: { version: 5, page: 0, size: 1000 } },
    );

    const data = json.data ?? [];

    return {
      categoryId,
      attributeId,
      values: Array.isArray(data) ? data : [],
    };
  }

  // ─── Products ───────────────────────────────────────────

  async getProducts(
    credentials: HepsiburadaCredentials,
    filters: HBFilterOptions = {},
  ): Promise<{
    products: unknown[];
    totalElements: number;
    totalPages: number;
    page: number;
  }> {
    const json = await this.hbFetch<{
      data?: unknown[];
      totalElements?: number;
      totalPages?: number;
      number?: number;
    }>(
      HB_PRODUCT_BASE,
      '/product/api/products/products-by-merchant-and-status',
      credentials,
      {
        query: {
          merchantId: credentials.merchantId,
          productStatus: filters.status ?? 'MATCHED',
          page: filters.page ?? 0,
          size: Math.min(filters.size ?? 50, 200),
        },
      },
    );

    return {
      products: json.data ?? [],
      totalElements: json.totalElements ?? 0,
      totalPages: json.totalPages ?? 0,
      page: json.number ?? 0,
    };
  }

  async importProducts(
    tenantSlug: string,
    credentials: HepsiburadaCredentials,
    filters: HBFilterOptions = {},
  ): Promise<{ imported: number; skipped: number; errors: string[] }> {
    const prisma = getTenantClient(tenantSlug);
    const response = await this.getProducts(credentials, filters);
    const products = response.products as Record<string, unknown>[];

    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const hbProduct of products) {
      try {
        const title = String(
          hbProduct.productName ?? hbProduct.merchantSku ?? '',
        );
        const barcode = String(hbProduct.barcode ?? '');
        const sku = String(hbProduct.merchantSku ?? '');
        const slug = this.generateSlug(title);

        const existing = await prisma.product.findFirst({
          where: {
            OR: [
              ...(sku ? [{ sku }] : []),
              ...(barcode ? [{ barcode }] : []),
              { slug },
            ],
          },
        });

        if (existing) {
          skipped++;
          continue;
        }

        const images: string[] = [];
        for (let i = 1; i <= 8; i++) {
          const imgUrl = hbProduct[`Image${i}`];
          if (imgUrl && typeof imgUrl === 'string') images.push(imgUrl);
        }

        const price = parseFloat(
          String(hbProduct.price ?? '0').replace(',', '.'),
        );
        const stock = parseInt(String(hbProduct.stock ?? '0'), 10);

        await prisma.product.create({
          data: {
            name: { en: title, tr: title },
            slug: `${slug}-${Date.now()}`,
            description: hbProduct.description
              ? {
                  en: String(hbProduct.description),
                  tr: String(hbProduct.description),
                }
              : {},
            price,
            sku: sku || null,
            barcode: barcode || null,
            weight: hbProduct.kg
              ? parseFloat(String(hbProduct.kg))
              : null,
            stock,
            images,
            status: 'draft',
            isFeatured: false,
            seoMeta: {
              hepsiburadaMerchantSku: sku,
              hepsiburadaBarcode: barcode,
              source: 'hepsiburada',
            },
          },
        });

        imported++;
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : `Failed to import HB product: ${String(hbProduct.merchantSku ?? '')}`;
        errors.push(msg);
        this.logger.warn('Hepsiburada import error', err);
      }
    }

    await prisma.syncLog.create({
      data: {
        marketplace: 'hepsiburada',
        action: 'import',
        status: 'completed',
        itemCount: imported,
        errorCount: errors.length,
        details: { imported, skipped, errors },
      },
    });

    this.logger.log(
      `Hepsiburada import: ${imported} imported, ${skipped} skipped, ${errors.length} errors (tenant: ${tenantSlug})`,
    );

    return { imported, skipped, errors };
  }

  // ─── Send Products to HB ───────────────────────────────

  async sendProducts(
    tenantSlug: string,
    credentials: HepsiburadaCredentials,
    productIds: string[],
  ): Promise<{ trackingId: string | null; sentCount: number }> {
    const prisma = getTenantClient(tenantSlug);

    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, status: 'active' },
      include: {
        category: {
          include: {
            marketplaceMappings: {
              where: { marketplace: 'hepsiburada' },
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

    const hbItems: HBProductItem[] = [];

    for (const product of products) {
      const mapping = product.category?.marketplaceMappings?.[0];
      if (!mapping) {
        this.logger.warn(
          `Product ${product.id} skipped: no HB category mapping for category ${product.categoryId}`,
        );
        continue;
      }

      const name =
        (product.name as Record<string, string>)?.en ??
        (product.name as Record<string, string>)?.tr ??
        '';
      const description = product.description
        ? ((product.description as Record<string, string>)?.en ??
            (product.description as Record<string, string>)?.tr ??
            '')
        : '';
      const images = (product.images as string[]) ?? [];
      const sku = (product.sku ?? product.id).toUpperCase();

      // HB expects Turkish decimal format (comma separator)
      const priceFormatted = Number(product.price).toFixed(2).replace('.', ',');

      const attributes: Record<string, unknown> = {
        merchantSku: sku,
        VaryantGroupID: sku,
        Barcode: product.barcode ?? '',
        UrunAdi: name,
        UrunAciklamasi: description,
        Marka: '',
        GarantiSuresi: '24',
        kg: product.weight ? Number(product.weight) : 0,
        tax_vat_rate: '10',
        price: priceFormatted,
        stock: String(product.stock),
      };

      // Add up to 8 images (Image1 .. Image8)
      images.slice(0, 8).forEach((imgUrl, idx) => {
        attributes[`Image${idx + 1}`] = imgUrl;
      });

      // Merge saved attribute mapping defaults from category mapping
      if (mapping.attributeMapping) {
        const defaults = mapping.attributeMapping as Record<string, unknown>;
        Object.assign(attributes, defaults);
      }

      hbItems.push({
        categoryId: parseInt(mapping.marketplaceCategoryId, 10),
        merchant: credentials.merchantId,
        attributes,
      });
    }

    if (hbItems.length === 0) {
      throw new BadRequestException(
        'No products could be mapped to Hepsiburada categories. Check category mappings.',
      );
    }

    this.logger.log(`Sending ${hbItems.length} products to Hepsiburada`);

    const result = await this.hbMultipartUpload<{
      data?: { trackingId?: string };
      trackingId?: string;
    }>('/product/api/products/import?version=1', credentials, hbItems);

    const trackingId =
      result.data?.trackingId ?? result.trackingId ?? null;

    // Upsert marketplace listings for each product sent
    for (const product of products) {
      await prisma.marketplaceListing.upsert({
        where: {
          marketplace_productId: {
            marketplace: 'hepsiburada',
            productId: product.id,
          },
        },
        create: {
          marketplace: 'hepsiburada',
          productId: product.id,
          batchId: trackingId,
          status: 'sent',
          lastSyncedAt: new Date(),
        },
        update: {
          batchId: trackingId,
          status: 'sent',
          lastSyncedAt: new Date(),
          errorMessage: null,
        },
      });
    }

    await prisma.syncLog.create({
      data: {
        marketplace: 'hepsiburada',
        action: 'export',
        status: 'completed',
        itemCount: hbItems.length,
        details: { trackingId },
      },
    });

    return { trackingId, sentCount: hbItems.length };
  }

  // ─── Price & Stock Sync ─────────────────────────────────

  async syncPriceAndStock(
    tenantSlug: string,
    credentials: HepsiburadaCredentials,
    productIds?: string[],
  ): Promise<{
    priceResult: string;
    stockResult: string;
    count: number;
  }> {
    const prisma = getTenantClient(tenantSlug);

    const whereClause = productIds?.length
      ? {
          marketplace: 'hepsiburada' as const,
          productId: { in: productIds },
        }
      : { marketplace: 'hepsiburada' as const };

    const listings = await prisma.marketplaceListing.findMany({
      where: whereClause,
      include: { product: true },
    });

    if (listings.length === 0) {
      return { priceResult: 'no_items', stockResult: 'no_items', count: 0 };
    }

    const stockPayload = listings.map((listing) => ({
      merchantSku: (listing.product.sku ?? listing.product.id).toUpperCase(),
      quantity: listing.product.stock,
    }));

    const pricePayload = listings.map((listing) => ({
      merchantSku: (listing.product.sku ?? listing.product.id).toUpperCase(),
      price: Number(listing.product.price),
    }));

    let stockResult = 'skipped';
    let priceResult = 'skipped';

    // Stock update via listing-external endpoint
    try {
      await this.hbFetch(
        HB_LISTING_BASE,
        `/listings/merchantid/${credentials.merchantId}/stock-uploads`,
        credentials,
        { method: 'POST', body: stockPayload },
      );
      stockResult = 'success';
    } catch (error) {
      stockResult =
        error instanceof Error ? error.message : 'failed';
      this.logger.error('Hepsiburada stock sync failed', error);
    }

    // Price update via listing-external endpoint
    try {
      await this.hbFetch(
        HB_LISTING_BASE,
        `/listings/merchantid/${credentials.merchantId}/price-uploads`,
        credentials,
        { method: 'POST', body: pricePayload },
      );
      priceResult = 'success';
    } catch (error) {
      priceResult =
        error instanceof Error ? error.message : 'failed';
      this.logger.error('Hepsiburada price sync failed', error);
    }

    // Update listing sync timestamps
    for (const listing of listings) {
      await prisma.marketplaceListing.update({
        where: { id: listing.id },
        data: { lastSyncedAt: new Date() },
      });
    }

    await prisma.syncLog.create({
      data: {
        marketplace: 'hepsiburada',
        action: 'price_sync',
        status:
          priceResult === 'success' && stockResult === 'success'
            ? 'completed'
            : 'failed',
        itemCount: listings.length,
        details: { priceResult, stockResult },
      },
    });

    return { priceResult, stockResult, count: listings.length };
  }

  // ─── Product status tracking ────────────────────────────

  async getProductStatus(
    credentials: HepsiburadaCredentials,
    trackingId: string,
  ): Promise<unknown> {
    return this.hbFetch(
      HB_PRODUCT_BASE,
      `/product/api/products/status/${trackingId}`,
      credentials,
      { query: { version: 1, page: 0, size: 1000 } },
    );
  }

  // ─── Utilities ──────────────────────────────────────────

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9çğıöşü]+/gi, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 80);
  }
}
