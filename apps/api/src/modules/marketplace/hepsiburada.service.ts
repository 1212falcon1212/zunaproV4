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
      'User-Agent': 'tedarix_dev',
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
        'User-Agent': 'tedarix_dev',
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

  async getListings(
    credentials: HepsiburadaCredentials,
    offset = 0,
    limit = 100,
  ): Promise<Record<string, { price: number; stock: number }>> {
    try {
      const json = await this.hbFetch<{ listings?: Array<{ merchantSku: string; price: number; availableStock: number }> }>(
        HB_LISTING_BASE,
        `/listings/merchantid/${credentials.merchantId}`,
        credentials,
        { query: { offset, limit } },
      );

      const map: Record<string, { price: number; stock: number }> = {};
      for (const l of json.listings ?? []) {
        if (l.merchantSku) {
          map[l.merchantSku] = { price: l.price ?? 0, stock: l.availableStock ?? 0 };
        }
      }
      return map;
    } catch (err) {
      this.logger.warn('Failed to fetch HB listings for price/stock', err);
      return {};
    }
  }

  async importProducts(
    tenantSlug: string,
    credentials: HepsiburadaCredentials,
    filters: HBFilterOptions = {},
  ): Promise<{ imported: number; skipped: number; errors: string[]; totalVariants: number; groupedInto: number }> {
    const prisma = getTenantClient(tenantSlug);
    const response = await this.getProducts(credentials, filters);
    const rawProducts = response.products as Record<string, unknown>[];

    // Fetch price/stock from listing API
    const listingMap = await this.getListings(credentials, 0, 1000);

    // ── Extract info from HB response format ──
    interface HBParsed {
      merchantSku: string;
      barcode: string;
      title: string;
      hbSku: string;
      variantGroupId: string;
      brand: string;
      images: string[];
      attributes: Record<string, string>;
      status: string;
    }

    const parsed: HBParsed[] = rawProducts.map((p) => {
      const matched = (p.matchedHbProductInfo as Array<Record<string, unknown>>)?.[0];
      const hbImages = ((matched?.images as string[]) ?? []).map((url) =>
        url.replace('{size}', '500'),
      );
      const variantAttrs: Record<string, string> = {};
      const vtAttrs = (matched?.variantTypeAttributes as Array<{ name: string; value: string }>) ?? [];
      for (const a of vtAttrs) {
        if (a.name && a.value) variantAttrs[a.name] = a.value;
      }

      return {
        merchantSku: String(p.merchantSku ?? ''),
        barcode: String(p.barcode ?? ''),
        title: String(matched?.productName ?? p.productName ?? ''),
        hbSku: String(p.hbSku ?? ''),
        variantGroupId: String(p.variantGroupId ?? ''),
        brand: String(matched?.brand ?? ''),
        images: hbImages,
        attributes: variantAttrs,
        status: String(p.productStatus ?? ''),
      };
    });

    // ── Group by variantGroupId (like Trendyol productMainId) ──
    const groups = new Map<string, HBParsed[]>();
    for (const p of parsed) {
      const key = p.variantGroupId || p.merchantSku;
      const arr = groups.get(key) ?? [];
      arr.push(p);
      groups.set(key, arr);
    }

    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const [groupId, variants] of groups) {
      try {
        const main = variants[0];

        // Skip if already exists
        const existing = await prisma.product.findFirst({
          where: {
            OR: [
              { sku: groupId },
              ...variants.map((v) => ({ barcode: v.barcode || undefined })).filter((c) => c.barcode),
            ],
          },
        });

        if (existing) {
          await prisma.marketplaceListing.upsert({
            where: { marketplace_productId: { marketplace: 'hepsiburada', productId: existing.id } },
            create: { marketplace: 'hepsiburada', productId: existing.id, marketplaceProductId: main.hbSku, status: 'approved', lastSyncedAt: new Date() },
            update: { marketplaceProductId: main.hbSku, lastSyncedAt: new Date() },
          });
          skipped++;
          continue;
        }

        // Collect all images (deduplicated)
        const allImages = [...new Set(variants.flatMap((v) => v.images))];

        // Build variant data with price/stock from listing API
        const variantData = variants.map((v) => {
          const listing = listingMap[v.merchantSku];
          return {
            name: v.title,
            sku: v.merchantSku,
            barcode: v.barcode,
            hbSku: v.hbSku,
            price: listing?.price ?? 0,
            stock: listing?.stock ?? 0,
            attributes: v.attributes,
          };
        });

        const totalStock = variantData.reduce((s, v) => s + v.stock, 0);
        const prices = variantData.map((v) => v.price).filter((p) => p > 0);
        const mainPrice = prices.length > 0 ? Math.min(...prices) : 0;

        // Brand & category
        const brandName = main.brand;
        const categoryId = await this.resolveOrCreateCategory(
          prisma,
          undefined,
          brandName || undefined,
        );

        const slug = this.makeSlug(main.title);

        const product = await prisma.product.create({
          data: {
            name: { tr: main.title, en: main.title },
            slug: `${slug}-${Date.now()}`,
            description: {},
            price: mainPrice,
            sku: groupId,
            barcode: main.barcode || null,
            stock: totalStock,
            categoryId,
            images: allImages,
            variants: variantData,
            status: 'draft',
            isFeatured: false,
            seoMeta: {
              source: 'hepsiburada',
              hbGroupId: groupId,
              hbSkus: variants.map((v) => v.hbSku),
              hepsiburadaBrand: brandName,
              variantCount: variants.length,
            },
          },
        });

        await prisma.marketplaceListing.create({
          data: {
            marketplace: 'hepsiburada',
            productId: product.id,
            marketplaceProductId: variants.map((v) => v.hbSku).join(','),
            status: 'approved',
            lastSyncedAt: new Date(),
            syncData: { groupId, brand: brandName, variantCount: variants.length },
          },
        });

        imported++;
        this.logger.log(`HB imported "${main.title}" with ${variants.length} variant(s)`);
      } catch (err) {
        const msg = err instanceof Error ? err.message : `Failed to import HB group: ${groupId}`;
        errors.push(msg);
        this.logger.warn(`HB import error for group ${groupId}`, err);
      }
    }

    await prisma.syncLog.create({
      data: {
        marketplace: 'hepsiburada',
        action: 'import',
        status: 'completed',
        itemCount: imported,
        errorCount: errors.length,
        details: { totalProducts: parsed.length, groupedInto: groups.size, imported, skipped, errors: errors.slice(0, 50) },
      },
    });

    this.logger.log(
      `HB import: ${imported} products (${parsed.length} variants → ${groups.size} groups), ${skipped} skipped`,
    );

    return { imported, skipped, errors, totalVariants: parsed.length, groupedInto: groups.size };
  }

  // ─── Send Products to HB ───────────────────────────────

  async sendProducts(
    tenantSlug: string,
    credentials: HepsiburadaCredentials,
    productIds: string[],
  ): Promise<{ trackingId: string | null; sentCount: number; errors: string[] }> {
    const prisma = getTenantClient(tenantSlug);

    // 1. Fetch products with category mappings, marketplace attributes, and listings
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: {
        category: {
          include: {
            marketplaceMappings: {
              where: { marketplace: 'hepsiburada' },
            },
          },
        },
        marketplaceAttributes: {
          where: { marketplace: 'hepsiburada' },
        },
        marketplaceListings: {
          where: { marketplace: 'hepsiburada' },
        },
      },
    });

    if (products.length === 0) {
      throw new BadRequestException(
        'No products found with the given IDs.',
      );
    }

    const hbItems: HBProductItem[] = [];
    const errors: string[] = [];
    const sentProductIds: string[] = [];

    for (const product of products) {
      const name = product.name as Record<string, string>;
      const description = (product.description ?? {}) as Record<string, string>;
      const images = (product.images ?? []) as string[];
      const seoMeta = (product.seoMeta ?? {}) as Record<string, unknown>;
      const variants = (product.variants ?? []) as Array<{
        name?: string;
        sku?: string;
        barcode?: string;
        price?: number;
        stock?: number;
        attributes?: Record<string, string>;
      }>;

      // 2a. Category mapping — skip if unmapped
      const mapping = product.category?.marketplaceMappings?.[0];
      if (!mapping) {
        errors.push(
          `Product "${name.en || name.tr}" (${product.id}) skipped: no HB category mapping.`,
        );
        continue;
      }
      const hbCategoryId = parseInt(mapping.marketplaceCategoryId, 10);

      // 2b. Brand resolution — HB uses brand name string (not ID)
      // Check all possible brand fields + category name fallback
      const categoryName = product.category
        ? ((product.category.name as Record<string, string>)?.tr || (product.category.name as Record<string, string>)?.en || '')
        : '';
      const brandName =
        (seoMeta.hepsiburadaBrand as string) ||
        (seoMeta.hepsiburadaBrandName as string) ||
        (seoMeta.trendyolBrand as string) ||
        (seoMeta.trendyolBrandName as string) ||
        (seoMeta.brand as string) ||
        categoryName ||
        '';

      if (!brandName) {
        errors.push(
          `Product "${name.en || name.tr}" (${product.id}) skipped: no brand found.`,
        );
        continue;
      }

      const productTitle = name.tr || name.en || '';
      const productDesc = description.tr || description.en || productTitle || 'Urun aciklamasi';
      const productMainId = (product.sku ?? product.id).toUpperCase();

      // Collect product-level dynamic attributes from ProductMarketplaceAttribute (variantIndex=-1 only)
      const dynamicAttributes: Record<string, unknown> = {};
      for (const attr of product.marketplaceAttributes.filter(a => a.variantIndex === -1)) {
        // Use attributeName as key (HB uses name-based attributes, not numeric IDs)
        const key = attr.attributeName || attr.attributeId;
        dynamicAttributes[key] = attr.value;
      }

      // Merge attribute defaults from category mapping (lower priority than product-level)
      if (mapping.attributeMapping) {
        const defaults = mapping.attributeMapping as Record<string, unknown>;
        for (const [key, val] of Object.entries(defaults)) {
          if (!(key in dynamicAttributes)) {
            dynamicAttributes[key] = val;
          }
        }
      }

      // 2c. Variant expansion
      if (variants.length > 0) {
        for (let vi = 0; vi < variants.length; vi++) {
          const variant = variants[vi];
          const variantSku = (
            variant.sku || variant.barcode || `${productMainId}-${vi}`
          ).toUpperCase();
          const variantBarcode = variant.barcode || variantSku;
          const variantPrice = variant.price ?? Number(product.price);
          const variantStock = variant.stock ?? 0;

          // HB expects Turkish decimal format (comma separator)
          const priceFormatted = variantPrice.toFixed(2).replace('.', ',');

          const attributes: Record<string, unknown> = {
            merchantSku: variantSku,
            VaryantGroupID: productMainId,
            Barcode: variantBarcode,
            UrunAdi: productTitle,
            UrunAciklamasi: productDesc,
            Marka: brandName,
            GarantiSuresi: '24',
            kg: product.weight ? Number(product.weight) : 0,
            tax_vat_rate: '20',
            price: priceFormatted,
            stock: String(variantStock),
          };

          // Add up to 8 images (Image1 .. Image8)
          images.slice(0, 8).forEach((imgUrl, idx) => {
            attributes[`Image${idx + 1}`] = imgUrl;
          });

          // Merge product-level dynamic attributes
          Object.assign(attributes, dynamicAttributes);

          // Add wizard-saved variant-level attributes (priority over raw variant attrs)
          const savedVariantAttrs = product.marketplaceAttributes.filter(a => a.variantIndex === vi);
          for (const saved of savedVariantAttrs) {
            const key = saved.attributeName || saved.attributeId;
            attributes[key] = saved.value;
          }

          // Add raw variant attributes (only if not already set by wizard)
          if (variant.attributes) {
            for (const [attrName, attrValue] of Object.entries(variant.attributes)) {
              if (!(attrName in attributes)) {
                attributes[attrName] = attrValue;
              }
            }
          }

          hbItems.push({
            categoryId: hbCategoryId,
            merchant: credentials.merchantId,
            attributes,
          });
        }
      } else {
        // Single product — no variants
        const sku = productMainId;
        const priceFormatted = Number(product.price).toFixed(2).replace('.', ',');

        const attributes: Record<string, unknown> = {
          merchantSku: sku,
          VaryantGroupID: sku,
          Barcode: product.barcode ?? '',
          UrunAdi: productTitle,
          UrunAciklamasi: productDesc,
          Marka: brandName,
          GarantiSuresi: '24',
          kg: product.weight ? Number(product.weight) : 0,
          tax_vat_rate: '20',
          price: priceFormatted,
          stock: String(product.stock),
        };

        // Add up to 8 images (Image1 .. Image8)
        images.slice(0, 8).forEach((imgUrl, idx) => {
          attributes[`Image${idx + 1}`] = imgUrl;
        });

        // Merge product-level dynamic attributes
        Object.assign(attributes, dynamicAttributes);

        hbItems.push({
          categoryId: hbCategoryId,
          merchant: credentials.merchantId,
          attributes,
        });
      }

      sentProductIds.push(product.id);
    }

    if (hbItems.length === 0) {
      throw new BadRequestException(
        `No products could be sent to Hepsiburada. Errors: ${errors.join('; ')}`,
      );
    }

    this.logger.log(
      `Sending ${hbItems.length} items (${sentProductIds.length} products) to Hepsiburada`,
    );

    // 3. Upload via multipart form-data
    let trackingId: string | null = null;
    try {
      const result = await this.hbMultipartUpload<{
        data?: { trackingId?: string };
        trackingId?: string;
      }>('/product/api/products/import?version=1', credentials, hbItems);

      trackingId = result.data?.trackingId ?? result.trackingId ?? null;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.error(`Hepsiburada send failed: ${msg}`);
      errors.push(`HB upload failed: ${msg}`);
    }

    // 4. Update MarketplaceListing for each successfully mapped product
    for (const product of products) {
      if (!sentProductIds.includes(product.id)) continue;

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
          syncData: { trackingId, itemCount: hbItems.length },
        },
        update: {
          batchId: trackingId,
          status: 'sent',
          lastSyncedAt: new Date(),
          errorMessage: null,
          syncData: { trackingId, itemCount: hbItems.length },
        },
      });
    }

    await prisma.syncLog.create({
      data: {
        marketplace: 'hepsiburada',
        action: 'export',
        status: 'completed',
        itemCount: hbItems.length,
        errorCount: errors.length,
        details: {
          trackingId,
          totalItems: hbItems.length,
          productCount: sentProductIds.length,
          ...(errors.length > 0 ? { errors: errors.slice(0, 50) } : {}),
        },
      },
    });

    return { trackingId, sentCount: hbItems.length, errors };
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

}
