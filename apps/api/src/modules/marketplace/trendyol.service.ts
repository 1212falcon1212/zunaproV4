import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { getTenantClient, masterPrisma } from '@zunapro/db';
import { BaseMarketplaceService } from './base-marketplace.service';
import { CurrencyService } from './currency.service';

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
  brand: string;
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

interface TrendyolShipmentPackage {
  shipmentPackageId: number;
  orderNumber: string;
  orderDate: number;
  status: string;
  cargoTrackingNumber?: string;
  cargoProviderName?: string;
  shipmentAddress: {
    firstName: string;
    lastName: string;
    address1: string;
    city: string;
    district: string;
    postalCode: string;
    phone?: string;
  };
  invoiceAddress: {
    firstName: string;
    lastName: string;
    address1: string;
    city: string;
    district: string;
    postalCode: string;
    taxNumber?: string;
    company?: string;
  };
  lines: Array<{
    lineItemId: number;
    productCode: number;
    barcode: string;
    merchantSku: string;
    productName: string;
    quantity: number;
    price: number;
    discount: number;
    currencyCode: string;
  }>;
  totalPrice: number;
  currencyCode: string;
}

interface TrendyolOrderResponse {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  content: TrendyolShipmentPackage[];
}

interface FetchOrdersOptions {
  startDate?: number;
  endDate?: number;
  status?: string;
  page?: number;
  size?: number;
}

interface FilterOptions {
  productIds?: string[];
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
  dimensionalWeight?: number;
  description: string;
  currencyType: string;
  listPrice: number;
  salePrice: number;
  vatRate: number;
  cargoCompanyId?: number;
  images: { url: string }[];
  attributes: Array<
    | { attributeId: number; attributeValueId: number }
    | { attributeId: number; customAttributeValue: string }
  >;
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
  constructor(private readonly currencyService: CurrencyService) {
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
  ): Promise<{ imported: number; skipped: number; errors: string[]; totalVariants: number; groupedInto: number }> {
    const prisma = getTenantClient(tenantSlug);
    const response = await this.getProducts(tenantSlug, filters);
    let products = response.content;

    // Filter by selected product IDs if provided
    const selectedIds = filters.productIds;
    if (selectedIds && selectedIds.length > 0) {
      const idSet = new Set(selectedIds.map(String));
      products = products.filter((p) => idSet.has(String(p.id)));
    }

    const syncLog = await prisma.syncLog.create({
      data: {
        marketplace: MARKETPLACE_NAME,
        action: 'import',
        status: 'started',
        itemCount: products.length,
      },
    });

    // ── Group by productMainId to detect variants ──
    const groups = new Map<string, TrendyolProduct[]>();
    for (const tp of products) {
      const key = tp.productMainId || String(tp.id);
      const arr = groups.get(key) ?? [];
      arr.push(tp);
      groups.set(key, arr);
    }

    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const [mainId, variants] of groups) {
      try {
        const mainProduct = variants[0];

        // Skip if any variant already imported (by productMainId stored in sku)
        const existing = await prisma.product.findFirst({
          where: {
            OR: [
              { sku: mainId },
              ...variants.map((v) => ({ barcode: v.barcode || undefined })).filter((c) => c.barcode),
            ],
          },
        });

        if (existing) {
          // Link all variant trendyol IDs
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
              marketplaceProductId: variants.map((v) => String(v.id)).join(','),
              status: 'approved',
              lastSyncedAt: new Date(),
            },
            update: {
              marketplaceProductId: variants.map((v) => String(v.id)).join(','),
              lastSyncedAt: new Date(),
            },
          });
          skipped++;
          continue;
        }

        // ── Resolve or create category tree ──
        const categoryId = await this.resolveOrCreateCategory(
          prisma,
          mainProduct.categoryName,
          mainProduct.brand,
        );

        // ── Collect all images from all variants (deduplicated) ──
        const allImageUrls = new Set<string>();
        for (const v of variants) {
          for (const img of v.images ?? []) {
            if (img.url) allImageUrls.add(img.url);
          }
        }
        const images = Array.from(allImageUrls);

        // ── Build variants array ──
        const extractVariantAttrs = (v: TrendyolProduct) => {
          const attrs = v.attributes ?? [];
          const result: Record<string, string> = {};
          for (const attr of attrs) {
            if (attr.attributeValue) {
              result[attr.attributeName] = attr.attributeValue;
            }
          }
          return result;
        };

        const variantData = variants.map((v) => ({
          name: v.title,
          sku: v.stockCode || v.barcode,
          barcode: v.barcode,
          price: v.salePrice,
          listPrice: v.listPrice,
          stock: v.quantity,
          trendyolId: v.id,
          attributes: extractVariantAttrs(v),
        }));

        // ── Total stock = sum of all variants ──
        const totalStock = variants.reduce((sum, v) => sum + v.quantity, 0);

        // ── Use lowest salePrice as main price ──
        const lowestPrice = Math.min(...variants.map((v) => v.salePrice));
        const highestListPrice = Math.max(...variants.map((v) => v.listPrice));

        // ── Currency conversion ──
        const prices = await this.currencyService.convertToAllCurrencies(lowestPrice, ['USD', 'EUR', 'GBP']);
        const comparePrices = highestListPrice > lowestPrice
          ? await this.currencyService.convertToAllCurrencies(highestListPrice, ['USD', 'EUR', 'GBP'])
          : null;

        // ── Determine title: use main product title or shortest ──
        const title = mainProduct.title;
        const slug = this.makeSlug(title);

        const product = await prisma.product.create({
          data: {
            name: { tr: title, en: title },
            slug: `${slug}-${Date.now()}`,
            description: mainProduct.description
              ? { tr: mainProduct.description, en: mainProduct.description }
              : {},
            price: lowestPrice,
            compareAtPrice: highestListPrice > lowestPrice ? highestListPrice : null,
            sku: mainId,
            barcode: mainProduct.barcode || null,
            stock: totalStock,
            categoryId,
            images,
            variants: variantData,
            status: 'draft',
            isFeatured: false,
            seoMeta: {
              source: 'trendyol',
              productMainId: mainId,
              trendyolIds: variants.map((v) => v.id),
              trendyolBrand: mainProduct.brand,
              trendyolCategory: mainProduct.categoryName,
              variantCount: variants.length,
              prices,
              comparePrices,
            },
          },
        });

        await prisma.marketplaceListing.create({
          data: {
            marketplace: MARKETPLACE_NAME,
            productId: product.id,
            marketplaceProductId: variants.map((v) => String(v.id)).join(','),
            status: 'approved',
            lastSyncedAt: new Date(),
            syncData: {
              productMainId: mainId,
              trendyolBrand: mainProduct.brand,
              trendyolCategory: mainProduct.categoryName,
              trendyolCategoryId: mainProduct.pimCategoryId,
              variantCount: variants.length,
            },
          },
        });

        imported++;
        this.logger.log(`Imported "${title}" with ${variants.length} variant(s)`);
      } catch (err) {
        const msg = err instanceof Error ? err.message : `Failed to import group: ${mainId}`;
        errors.push(msg);
        this.logger.warn(`Trendyol import error for group ${mainId}`, err);
      }
    }

    await prisma.syncLog.update({
      where: { id: syncLog.id },
      data: {
        status: 'completed',
        itemCount: imported,
        errorCount: errors.length,
        details: {
          totalProducts: products.length,
          groupedInto: groups.size,
          ...(errors.length > 0 ? { errors: errors.slice(0, 50) } : {}),
        },
      },
    });

    this.logger.log(
      `Trendyol import: ${imported} products (${products.length} variants grouped into ${groups.size}), ${skipped} skipped, ${errors.length} errors`,
    );

    return {
      imported,
      skipped,
      errors,
      totalVariants: products.length,
      groupedInto: groups.size,
    };
  }

  // -----------------------------------------------------------------------
  // 9. Send products (local DB -> Trendyol)
  // -----------------------------------------------------------------------

  async sendProducts(
    tenantSlug: string,
    productIds: string[],
  ): Promise<{ batchIds: string[]; sentCount: number; errors: string[] }> {
    const creds = await this.resolveCredentials(tenantSlug);
    const prisma = getTenantClient(tenantSlug);

    // 1. Fetch products with category mappings, marketplace attributes, and listings
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: {
        category: {
          include: {
            marketplaceMappings: {
              where: { marketplace: MARKETPLACE_NAME },
            },
          },
        },
        marketplaceAttributes: {
          where: { marketplace: MARKETPLACE_NAME },
        },
        marketplaceListings: {
          where: { marketplace: MARKETPLACE_NAME },
        },
      },
    });

    if (products.length === 0) {
      throw new NotFoundException('No products found for given IDs.');
    }

    const items: SendProductItem[] = [];
    const errors: string[] = [];
    const productItemMap = new Map<string, string[]>(); // productId -> barcodes sent

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

      // 2a. Category mapping — skip product if unmapped
      const mapping = product.category?.marketplaceMappings?.[0];
      if (!mapping) {
        errors.push(
          `Product "${name.en || name.tr}" (${product.id}) skipped: no Trendyol category mapping.`,
        );
        continue;
      }
      const trendyolCategoryId = Number(mapping.marketplaceCategoryId);

      // 2b. Brand resolution: check all possible brand fields in seoMeta + category name fallback
      const categoryName = product.category
        ? ((product.category.name as Record<string, string>)?.tr || (product.category.name as Record<string, string>)?.en || '')
        : '';
      const brandNameRaw =
        (seoMeta.trendyolBrandName as string) ||
        (seoMeta.trendyolBrand as string) ||
        (seoMeta.hepsiburadaBrand as string) ||
        (seoMeta.brand as string) ||
        categoryName ||
        '';

      if (!brandNameRaw) {
        errors.push(
          `Product "${name.en || name.tr}" (${product.id}) skipped: no brand found in product metadata or category.`,
        );
        continue;
      }

      const brandRecord = await prisma.marketplaceBrand.findFirst({
        where: {
          marketplace: MARKETPLACE_NAME,
          brandName: { equals: brandNameRaw, mode: 'insensitive' },
        },
      });

      if (!brandRecord) {
        errors.push(
          `Product "${name.en || name.tr}" (${product.id}) skipped: brand "${brandNameRaw}" not found in marketplace_brands. Sync brands first.`,
        );
        continue;
      }

      const brandId = Number(brandRecord.marketplaceBrandId);
      const productMainId = product.sku || product.barcode || product.id;

      // Load cached category attributes for attribute ID resolution
      const cachedCategory = await prisma.marketplaceCategory.findUnique({
        where: {
          marketplace_marketplaceCategoryId: {
            marketplace: MARKETPLACE_NAME,
            marketplaceCategoryId: String(trendyolCategoryId),
          },
        },
      });
      const categoryAttributes = (cachedCategory?.attributes ?? []) as Array<{
        attribute?: { id: number; name: string };
        attributeValues?: Array<{ id: number; name: string }>;
      }>;

      // Build lookup: attributeName (lowercase) -> { attributeId, values: { valueName -> valueId } }
      const attrLookup = new Map<
        string,
        { attributeId: number; values: Map<string, number> }
      >();
      for (const catAttr of categoryAttributes) {
        if (!catAttr.attribute) continue;
        const valMap = new Map<string, number>();
        for (const v of catAttr.attributeValues ?? []) {
          valMap.set(v.name.toLowerCase(), v.id);
        }
        attrLookup.set(catAttr.attribute.name.toLowerCase(), {
          attributeId: catAttr.attribute.id,
          values: valMap,
        });
      }

      // 2d. Collect product-level attributes from ProductMarketplaceAttribute
      // Only take variantIndex=-1 (product-level) here; variant-level handled in 2c
      const productAttributes: Array<{
        attributeId: number;
        attributeValueId?: number;
        customAttributeValue?: string;
      }> = [];

      for (const attr of product.marketplaceAttributes.filter(a => a.variantIndex === -1)) {
        // Resolve attributeId: could be numeric string "47" or name string "Renk"
        let numericId = Number(attr.attributeId);
        if (isNaN(numericId)) {
          // It's stored by name — look up the numeric ID from category attributes
          const lookup = attrLookup.get(attr.attributeId.toLowerCase());
          if (lookup) {
            numericId = lookup.attributeId;
          } else {
            continue; // Unknown attribute name, skip
          }
        }

        if (attr.valueId && !isNaN(Number(attr.valueId))) {
          productAttributes.push({
            attributeId: numericId,
            attributeValueId: Number(attr.valueId),
          });
        } else if (attr.value) {
          // Try to resolve value to a valueId from the attribute values list
          const lookup = attrLookup.get(attr.attributeName?.toLowerCase() ?? '');
          const resolvedValueId = lookup?.values.get(attr.value.toLowerCase());
          if (resolvedValueId) {
            productAttributes.push({
              attributeId: numericId,
              attributeValueId: resolvedValueId,
            });
          } else {
            productAttributes.push({
              attributeId: numericId,
              customAttributeValue: attr.value,
            });
          }
        }
      }

      // Merge attribute defaults from category mapping (only if not already set)
      const mappingDefaults = (mapping.attributeMapping ?? []) as Array<{
        attributeId: number;
        attributeValueId?: number;
        customAttributeValue?: string;
      }>;
      const seenAttrIds = new Set(productAttributes.map((a) => a.attributeId));
      for (const def of mappingDefaults) {
        if (!seenAttrIds.has(def.attributeId)) {
          productAttributes.push(def);
          seenAttrIds.add(def.attributeId);
        }
      }

      const title = name.tr || name.en || '';
      const desc = description.tr || description.en || title || 'Urun aciklamasi';
      const imageList = images.slice(0, 8).map((url) => ({ url }));
      const barcodesSent: string[] = [];

      // 2c. Variant expansion
      if (variants.length > 0) {
        for (let vi = 0; vi < variants.length; vi++) {
          const variant = variants[vi];
          const variantBarcode =
            variant.barcode || variant.sku || `${productMainId}-${vi}`;
          const variantSku = variant.sku || variantBarcode;
          const variantPrice = variant.price ?? Number(product.price);
          const variantStock = variant.stock ?? 0;

          // Build variant-specific attributes — prefer wizard-saved values over auto-match
          const variantAttributes = [...productAttributes];
          const variantSeenIds = new Set(variantAttributes.map((a) => a.attributeId));

          // First: use saved variant-level attributes from wizard (ProductMarketplaceAttribute with variantIndex)
          const savedVariantAttrs = product.marketplaceAttributes.filter(
            (a) => a.variantIndex === vi,
          );
          for (const saved of savedVariantAttrs) {
            const attrId = Number(saved.attributeId);
            if (variantSeenIds.has(attrId)) continue;
            if (saved.valueId) {
              variantAttributes.push({ attributeId: attrId, attributeValueId: Number(saved.valueId) });
            } else if (saved.value) {
              variantAttributes.push({ attributeId: attrId, customAttributeValue: saved.value });
            }
            variantSeenIds.add(attrId);
          }

          // Fallback: auto-match from variant.attributes only if no wizard value exists
          if (variant.attributes) {
            for (const [attrName, attrValue] of Object.entries(variant.attributes)) {
              const lookup = attrLookup.get(attrName.toLowerCase());
              if (!lookup) continue;
              if (variantSeenIds.has(lookup.attributeId)) continue;

              const valueId = lookup.values.get(attrValue.toLowerCase());
              if (valueId) {
                variantAttributes.push({ attributeId: lookup.attributeId, attributeValueId: valueId });
              } else if (lookup.values.size === 0) {
                // Only use custom value if attribute allows it (no enum values)
                variantAttributes.push({ attributeId: lookup.attributeId, customAttributeValue: attrValue });
              }
              // Skip if has enum values but no match — user must select in wizard
              variantSeenIds.add(lookup.attributeId);
            }
          }

          items.push({
            barcode: variantBarcode,
            title,
            productMainId,
            brandId,
            categoryId: trendyolCategoryId,
            quantity: variantStock,
            stockCode: variantSku,
            description: desc,
            currencyType: 'TRY',
            listPrice: Number(product.compareAtPrice ?? variantPrice),
            salePrice: variantPrice,
            vatRate: 20,
            cargoCompanyId: 17,
            images: imageList,
            attributes: variantAttributes.map(a => {
              if ('attributeValueId' in a && a.attributeValueId) return { attributeId: a.attributeId, attributeValueId: a.attributeValueId };
              if ('customAttributeValue' in a && a.customAttributeValue) return { attributeId: a.attributeId, customAttributeValue: a.customAttributeValue };
              return null;
            }).filter(Boolean) as SendProductItem['attributes'],
          });
          barcodesSent.push(variantBarcode);
        }
      } else {
        // Single product — no variants
        items.push({
          barcode: product.barcode || product.sku || product.id,
          title,
          productMainId,
          brandId,
          categoryId: trendyolCategoryId,
          quantity: product.stock,
          stockCode: product.sku || product.id,
          description: desc,
          currencyType: 'TRY',
          listPrice: Number(product.compareAtPrice ?? product.price),
          salePrice: Number(product.price),
          vatRate: 20,
          cargoCompanyId: 17,
          images: imageList,
          attributes: productAttributes.map(a => {
            if ('attributeValueId' in a && a.attributeValueId) return { attributeId: a.attributeId, attributeValueId: a.attributeValueId };
            if ('customAttributeValue' in a && a.customAttributeValue) return { attributeId: a.attributeId, customAttributeValue: a.customAttributeValue };
            return null;
          }).filter(Boolean) as SendProductItem['attributes'],
        });
        barcodesSent.push(product.barcode || product.sku || product.id);
      }

      productItemMap.set(product.id, barcodesSent);
    }

    if (items.length === 0) {
      throw new BadRequestException(
        `No products could be sent. Errors: ${errors.join('; ')}`,
      );
    }

    // 3. Chunk items into batches of 100 and POST each
    const BATCH_SIZE = 100;
    const batchIds: string[] = [];

    for (let i = 0; i < items.length; i += BATCH_SIZE) {
      const chunk = items.slice(i, i + BATCH_SIZE);

      try {
        const result = await this.apiPost<{ batchRequestId: string }>(
          `/integration/product/sellers/${creds.supplierId}/products`,
          creds,
          { items: chunk },
        );

        batchIds.push(result.batchRequestId);
        this.logger.log(
          `Trendyol batch ${batchIds.length}: sent ${chunk.length} items, batchId: ${result.batchRequestId}`,
        );
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        this.logger.error(`Trendyol batch send failed: ${msg}`);
        errors.push(`Batch ${i / BATCH_SIZE + 1} failed: ${msg}`);
      }
    }

    // 4. Update MarketplaceListing for each successfully mapped product
    const latestBatchId = batchIds[batchIds.length - 1];
    for (const product of products) {
      if (!productItemMap.has(product.id)) continue;

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
          batchId: latestBatchId,
          status: 'sent',
          lastSyncedAt: new Date(),
          syncData: {
            batchIds,
            barcodesSent: productItemMap.get(product.id),
          },
        },
        update: {
          batchId: latestBatchId,
          status: 'sent',
          lastSyncedAt: new Date(),
          errorMessage: null,
          syncData: {
            batchIds,
            barcodesSent: productItemMap.get(product.id),
          },
        },
      });
    }

    await prisma.syncLog.create({
      data: {
        marketplace: MARKETPLACE_NAME,
        action: 'export',
        status: 'completed',
        itemCount: items.length,
        errorCount: errors.length,
        details: {
          batchIds,
          totalItems: items.length,
          productCount: productItemMap.size,
          ...(errors.length > 0 ? { errors: errors.slice(0, 50) } : {}),
        },
      },
    });

    this.logger.log(
      `Sent ${items.length} items (${productItemMap.size} products) to Trendyol in ${batchIds.length} batch(es) (tenant: ${tenantSlug})`,
    );

    return { batchIds, sentCount: items.length, errors };
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
  // 12. Sync brands
  // -----------------------------------------------------------------------

  async syncBrands(tenantSlug: string): Promise<{ synced: number }> {
    const creds = await this.resolveCredentials(tenantSlug);
    const prisma = getTenantClient(tenantSlug);
    let page = 0;
    let synced = 0;

    while (true) {
      const response = await this.apiGet<{ brands: Array<{ id: number; name: string }> }>(
        `/integration/product/brands?page=${page}&size=500`,
        creds,
      );

      const brands = response.brands ?? [];
      if (brands.length === 0) break;

      for (const b of brands) {
        await prisma.marketplaceBrand.upsert({
          where: { marketplace_marketplaceBrandId: { marketplace: MARKETPLACE_NAME, marketplaceBrandId: String(b.id) } },
          create: { marketplace: MARKETPLACE_NAME, marketplaceBrandId: String(b.id), brandName: b.name },
          update: { brandName: b.name },
        });
        synced++;
      }

      if (brands.length < 500) break;
      page++;
    }

    this.logger.log(`Synced ${synced} Trendyol brands for tenant ${tenantSlug}`);
    return { synced };
  }

  // -----------------------------------------------------------------------
  // 10. Order fetching
  // -----------------------------------------------------------------------

  async fetchOrders(
    tenantSlug: string,
    options: FetchOrdersOptions = {},
  ): Promise<{ created: number; updated: number; errors: string[] }> {
    const creds = await this.resolveCredentials(tenantSlug);
    const prisma = getTenantClient(tenantSlug);

    const syncLog = await prisma.syncLog.create({
      data: {
        marketplace: MARKETPLACE_NAME,
        action: 'order_sync',
        status: 'started',
      },
    });

    let created = 0;
    let updated = 0;
    const errors: string[] = [];

    try {
      const now = Date.now();
      const startDate = options.startDate ?? now - 7 * 24 * 60 * 60 * 1000;
      const endDate = options.endDate ?? now;
      const size = options.size ?? 200;
      let page = options.page ?? 0;
      let totalPages = 1;

      do {
        const params = new URLSearchParams({
          startDate: String(startDate),
          endDate: String(endDate),
          size: String(size),
          page: String(page),
          orderByField: 'PackageLastModifiedDate',
          orderByDirection: 'DESC',
        });
        if (options.status) params.set('status', options.status);

        const response = await this.apiGet<TrendyolOrderResponse>(
          `/integration/order/sellers/${creds.supplierId}/orders?${params}`,
          creds,
        );

        totalPages = response.totalPages || 1;
        const packages = response.content ?? [];

        for (const pkg of packages) {
          try {
            const mpOrderId = `ty-${pkg.shipmentPackageId}`;
            const localStatus = this.mapTrendyolOrderStatus(pkg.status);

            const totalAmount = pkg.totalPrice ?? pkg.lines.reduce((s, l) => s + (l.price * l.quantity - l.discount), 0);
            const items = pkg.lines.map((line) => ({
              productId: String(line.productCode),
              name: { tr: line.productName, en: line.productName },
              slug: '',
              price: line.price,
              quantity: line.quantity,
              total: line.price * line.quantity - line.discount,
              image: '',
              sku: line.merchantSku,
              barcode: line.barcode,
            }));

            const shippingAddress = pkg.shipmentAddress ? JSON.parse(JSON.stringify({
              firstName: pkg.shipmentAddress.firstName,
              lastName: pkg.shipmentAddress.lastName,
              address: pkg.shipmentAddress.address1,
              city: pkg.shipmentAddress.city,
              district: pkg.shipmentAddress.district,
              postalCode: pkg.shipmentAddress.postalCode,
              phone: pkg.shipmentAddress.phone ?? '',
            })) : undefined;

            const existing = await prisma.order.findUnique({
              where: { marketplaceOrderId: mpOrderId },
            });

            if (existing) {
              await prisma.order.update({
                where: { marketplaceOrderId: mpOrderId },
                data: {
                  status: localStatus,
                  trackingNumber: pkg.cargoTrackingNumber ?? existing.trackingNumber,
                  shippingMethod: pkg.cargoProviderName ?? existing.shippingMethod,
                  marketplaceData: JSON.parse(JSON.stringify(pkg)),
                },
              });
              updated++;
            } else {
              const orderCount = await prisma.order.count();
              const orderNumber = `MP-TY-${String(orderCount + 1).padStart(6, '0')}`;

              // Try to find or create customer from shipment address
              let customerId: string | null = null;
              if (pkg.shipmentAddress?.firstName) {
                const customerEmail = `ty-${pkg.shipmentPackageId}@marketplace.local`;
                const customer = await prisma.customer.upsert({
                  where: { email: customerEmail },
                  create: {
                    email: customerEmail,
                    firstName: pkg.shipmentAddress.firstName,
                    lastName: pkg.shipmentAddress.lastName,
                    phone: pkg.shipmentAddress.phone ?? null,
                    isGuest: true,
                  },
                  update: {},
                });
                customerId = customer.id;
              }

              await prisma.order.create({
                data: {
                  orderNumber,
                  customerId,
                  status: localStatus,
                  paymentStatus: 'paid',
                  paymentMethod: 'marketplace',
                  totalAmount,
                  subtotalAmount: totalAmount,
                  taxAmount: 0,
                  discountAmount: pkg.lines.reduce((s, l) => s + l.discount, 0),
                  shippingCost: 0,
                  currency: pkg.currencyCode ?? 'TRY',
                  items,
                  shippingAddress,
                  trackingNumber: pkg.cargoTrackingNumber ?? null,
                  shippingMethod: pkg.cargoProviderName ?? null,
                  source: 'trendyol',
                  marketplaceOrderId: mpOrderId,
                  marketplaceData: JSON.parse(JSON.stringify(pkg)),
                  locale: 'tr',
                },
              });
              created++;
            }
          } catch (err) {
            errors.push(`Package ${pkg.shipmentPackageId}: ${err instanceof Error ? err.message : String(err)}`);
          }
        }

        page++;
      } while (page < totalPages);

      await prisma.syncLog.update({
        where: { id: syncLog.id },
        data: {
          status: 'completed',
          itemCount: created + updated,
          details: { created, updated, errors: errors.slice(0, 20) },
        },
      });

      this.logger.log(`Order sync for ${tenantSlug}: ${created} created, ${updated} updated`);
      return { created, updated, errors };
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
  // Helpers
  // -----------------------------------------------------------------------

  private mapTrendyolOrderStatus(tyStatus: string): string {
    const map: Record<string, string> = {
      Created: 'pending',
      UnPacked: 'pending',
      Picking: 'preparing',
      Invoiced: 'preparing',
      Shipped: 'shipped',
      AtCollectionPoint: 'shipped',
      Delivered: 'delivered',
      Cancelled: 'cancelled',
      UnSupplied: 'cancelled',
      Returned: 'refunded',
      UnDelivered: 'refunded',
    };
    return map[tyStatus] ?? 'pending';
  }
}
