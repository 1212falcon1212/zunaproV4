import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { getTenantClient } from '@zunapro/db';
import { TrendyolService } from './trendyol.service';
import { HepsiburadaService } from './hepsiburada.service';
import { CiceksepetiService } from './ciceksepeti.service';
import { MarketplaceConnectDto } from './dto/connect.dto';
import { CategoryMappingDto } from './dto/category-mapping.dto';

const SUPPORTED = ['trendyol', 'hepsiburada', 'ciceksepeti'] as const;

@Injectable()
export class MarketplaceSyncService {
  private readonly logger = new Logger(MarketplaceSyncService.name);

  constructor(
    private readonly ty: TrendyolService,
    private readonly hb: HepsiburadaService,
    private readonly cs: CiceksepetiService,
  ) {}

  private v(mp: string) {
    if (!(SUPPORTED as readonly string[]).includes(mp))
      throw new BadRequestException(`Unsupported: ${mp}`);
  }

  async connect(ts: string, mp: string, dto: MarketplaceConnectDto) {
    this.v(mp);
    if (mp === 'trendyol') {
      if (!dto.supplierId) throw new BadRequestException('supplierId required');
      const c = { supplierId: dto.supplierId, apiKey: dto.apiKey, apiSecret: dto.apiSecret };
      if (!(await this.ty.testConnectionWithCredentials(c))) return { success: false, message: 'Failed' };
      await this.ty.saveCredentials(ts, c);
    } else if (mp === 'hepsiburada') {
      if (!dto.apiKey || !dto.apiSecret) throw new BadRequestException('apiKey and apiSecret required');
      const c = { merchantId: dto.apiKey, apiKey: dto.apiKey, apiSecret: dto.apiSecret };
      if (!(await this.hb.testConnectionWithCredentials(c))) return { success: false, message: 'Failed' };
      await this.hb.saveCredentials(ts, c);
    } else {
      const c = { apiKey: dto.apiKey };
      if (!(await this.cs.testConnection(c))) return { success: false, message: 'Failed' };
      await this.cs.saveCredentials(ts, c);
    }
    return { success: true, message: `${mp} connected.` };
  }

  async disconnect(ts: string, mp: string) {
    this.v(mp);
    if (mp === 'trendyol') await this.ty.removeCredentials(ts);
    else if (mp === 'hepsiburada') await this.hb.removeCredentials(ts);
    else await this.cs.removeCredentials(ts);
    return { success: true };
  }

  async getStatus(ts: string, mp: string) {
    this.v(mp);
    let connected = false;
    if (mp === 'trendyol') connected = await this.ty.testConnection(ts);
    else if (mp === 'hepsiburada') connected = await this.hb.testConnection(ts);
    else { const cr = await this.cs.getCredentials(ts); connected = cr ? await this.cs.testConnection(cr) : false; }
    return { connected, marketplace: mp };
  }

  async syncCategories(ts: string, mp: string) {
    this.v(mp);
    if (mp === 'trendyol') return this.ty.syncCategories(ts);
    if (mp === 'hepsiburada') { const cr = await this.resolveHb(ts); return this.hb.syncCategories(ts, cr); }
    const cr = await this.cs.getCredentials(ts);
    if (!cr) throw new BadRequestException('Not connected');
    return this.cs.syncCategories(ts, cr);
  }

  async getCategories(ts: string, mp: string, search?: string, page = 0, limit = 50, leafOnly = true) {
    this.v(mp);
    const prisma = getTenantClient(ts);

    // Get all categories for this marketplace (to build paths)
    const allCats = await prisma.marketplaceCategory.findMany({
      where: { marketplace: mp },
      select: { id: true, marketplaceCategoryId: true, categoryName: true, parentId: true },
    });

    // Build parent lookup map
    const byMpId = new Map(allCats.map(c => [c.marketplaceCategoryId, c]));

    // Find leaf categories (those whose marketplaceCategoryId is NOT a parentId of any other)
    const parentIds = new Set(allCats.map(c => c.parentId).filter(Boolean));
    const leafCats = leafOnly
      ? allCats.filter(c => !parentIds.has(c.marketplaceCategoryId))
      : allCats;

    // Build full path for each category
    const buildPath = (cat: typeof allCats[0]): string => {
      const parts: string[] = [cat.categoryName];
      let current = cat;
      while (current.parentId) {
        const parent = byMpId.get(current.parentId);
        if (!parent) break;
        parts.unshift(parent.categoryName);
        current = parent;
      }
      return parts.join(' > ');
    };

    // Filter by search
    let filtered = leafCats.map(c => ({ ...c, path: buildPath(c) }));
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(c => c.path.toLowerCase().includes(q) || c.categoryName.toLowerCase().includes(q));
    }

    // Sort and paginate
    filtered.sort((a, b) => a.path.localeCompare(b.path, 'tr'));
    const total = filtered.length;
    const paginated = filtered.slice(page * limit, (page + 1) * limit);

    return { categories: paginated, total, page, limit };
  }

  async getCategoryAttributes(ts: string, mp: string, catId: string) {
    this.v(mp);
    if (mp === 'trendyol') return this.ty.getCategoryAttributes(ts, catId);
    if (mp === 'hepsiburada') { const cr = await this.resolveHb(ts); return this.hb.getCategoryAttributes(cr, parseInt(catId, 10)); }
    const cr = await this.cs.getCredentials(ts);
    if (!cr) throw new BadRequestException('Not connected');
    return this.cs.getCategoryAttributes(cr, parseInt(catId, 10));
  }

  async getCategoryMappings(ts: string, mp: string) {
    this.v(mp);
    const prisma = getTenantClient(ts);
    const mappings = await prisma.marketplaceCategoryMapping.findMany({ where: { marketplace: mp }, include: { localCategory: true } });

    // Build local category paths
    const allLocalCats = await prisma.category.findMany({ select: { id: true, name: true, parentId: true } });
    const localById = new Map(allLocalCats.map(c => [c.id, c]));
    const buildLocalPath = (catId: string): string => {
      const parts: string[] = [];
      let current = localById.get(catId);
      while (current) {
        const name = this.xn(current.name);
        parts.unshift(name);
        current = current.parentId ? localById.get(current.parentId) : undefined;
      }
      return parts.join(' > ');
    };

    // Build marketplace category paths
    const allMpCats = await prisma.marketplaceCategory.findMany({
      where: { marketplace: mp },
      select: { marketplaceCategoryId: true, categoryName: true, parentId: true },
    });
    const mpById = new Map(allMpCats.map(c => [c.marketplaceCategoryId, c]));
    const buildMpPath = (mpCatId: string): string => {
      const parts: string[] = [];
      let current = mpById.get(mpCatId);
      while (current) {
        parts.unshift(current.categoryName);
        current = current.parentId ? mpById.get(current.parentId) : undefined;
      }
      return parts.join(' > ');
    };

    return mappings.map(m => ({
      ...m,
      localCategoryPath: buildLocalPath(m.localCategoryId),
      marketplaceCategoryName: mpById.get(m.marketplaceCategoryId)?.categoryName ?? null,
      marketplaceCategoryPath: buildMpPath(m.marketplaceCategoryId),
    }));
  }

  async saveCategoryMapping(ts: string, mp: string, dto: CategoryMappingDto) {
    this.v(mp);
    return getTenantClient(ts).marketplaceCategoryMapping.upsert({
      where: { marketplace_localCategoryId: { marketplace: mp, localCategoryId: dto.localCategoryId } },
      create: { marketplace: mp, localCategoryId: dto.localCategoryId, marketplaceCategoryId: dto.marketplaceCategoryId },
      update: { marketplaceCategoryId: dto.marketplaceCategoryId },
    });
  }

  async autoMatchCategories(ts: string, mp: string) {
    this.v(mp);
    const pr = getTenantClient(ts);
    const [lcs, mcs] = await Promise.all([
      pr.category.findMany({ select: { id: true, name: true } }),
      pr.marketplaceCategory.findMany({ where: { marketplace: mp }, select: { marketplaceCategoryId: true, categoryName: true } }),
    ]);
    let matched = 0;
    for (const l of lcs) {
      const ln = this.xn(l.name).toLowerCase();
      if (!ln) continue;
      const m = mcs.find((c) => { const n = (c.categoryName ?? '').toLowerCase(); return n === ln || n.includes(ln) || ln.includes(n); });
      if (m) {
        await pr.marketplaceCategoryMapping.upsert({
          where: { marketplace_localCategoryId: { marketplace: mp, localCategoryId: l.id } },
          create: { marketplace: mp, localCategoryId: l.id, marketplaceCategoryId: m.marketplaceCategoryId },
          update: { marketplaceCategoryId: m.marketplaceCategoryId },
        });
        matched++;
      }
    }
    return { matched, total: lcs.length };
  }

  async getMarketplaceProducts(ts: string, mp: string, filters: Record<string, unknown>) {
    this.v(mp);
    if (mp === 'trendyol') return this.ty.getProducts(ts, filters);
    if (mp === 'hepsiburada') { const cr = await this.resolveHb(ts); return this.hb.getProducts(cr, filters); }
    const cr = await this.resolveCs(ts);
    return this.cs.getProducts(ts, cr, filters);
  }

  async importProducts(ts: string, mp: string, filters: Record<string, unknown>) {
    this.v(mp);
    if (mp === 'trendyol') return this.ty.importProducts(ts, filters);
    if (mp === 'hepsiburada') { const cr = await this.resolveHb(ts); return this.hb.importProducts(ts, cr, filters); }
    const cr = await this.resolveCs(ts);
    return this.cs.importProducts(ts, cr, filters);
  }

  async getLocalProducts(ts: string, mp: string, page = 0, limit = 50) {
    this.v(mp);
    const pr = getTenantClient(ts);
    const prods = await pr.product.findMany({ skip: page * limit, take: limit, include: { marketplaceListings: { where: { marketplace: mp } } }, orderBy: { createdAt: 'desc' } });
    const total = await pr.product.count();
    return { products: prods.map((p) => ({ ...p, listingStatus: p.marketplaceListings[0]?.status ?? null, marketplaceProductId: p.marketplaceListings[0]?.marketplaceProductId ?? null })), total, page, limit };
  }

  async sendProducts(ts: string, mp: string, productIds: string[]) {
    this.v(mp);
    if (mp === 'trendyol') return this.ty.sendProducts(ts, productIds);
    if (mp === 'hepsiburada') { const cr = await this.resolveHb(ts); return this.hb.sendProducts(ts, cr, productIds); }
    const cr = await this.resolveCs(ts);
    return this.cs.sendProducts(ts, cr, productIds);
  }

  async syncPriceAndStock(ts: string, mp: string, productIds?: string[]) {
    this.v(mp);
    if (mp === 'trendyol') return this.ty.syncPriceAndStock(ts, productIds);
    if (mp === 'hepsiburada') { const cr = await this.resolveHb(ts); return this.hb.syncPriceAndStock(ts, cr, productIds); }
    const cr = await this.resolveCs(ts);
    return this.cs.syncPriceAndStock(ts, cr, productIds);
  }

  async getSyncLogs(ts: string, mp: string, page = 0, limit = 50) {
    this.v(mp);
    const pr = getTenantClient(ts);
    const [logs, total] = await Promise.all([pr.syncLog.findMany({ where: { marketplace: mp }, skip: page * limit, take: limit, orderBy: { createdAt: 'desc' } }), pr.syncLog.count({ where: { marketplace: mp } })]);
    return { logs, total, page, limit };
  }

  async getBatchStatus(ts: string, mp: string, batchId: string) {
    this.v(mp);
    if (mp === 'trendyol') return this.ty.getBatchStatus(ts, batchId);
    if (mp === 'ciceksepeti') { const cr = await this.cs.getCredentials(ts); if (!cr) throw new BadRequestException('Not connected'); return this.cs.getBatchStatus(cr, batchId); }
    return { batchId, status: 'unknown' };
  }

  private async resolveHb(ts: string) {
    const cr = await this.hb.getCredentials(ts);
    if (!cr) throw new BadRequestException('Hepsiburada not connected');
    return cr;
  }

  private async resolveCs(ts: string) {
    const cr = await this.cs.getCredentials(ts);
    if (!cr) throw new BadRequestException('Ciceksepeti not connected');
    return cr;
  }

  async prepareSend(ts: string, mp: string, productIds: string[]) {
    this.v(mp);
    const prisma = getTenantClient(ts);

    // Fetch products with category and existing marketplace attributes
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: {
        category: { include: { marketplaceMappings: { where: { marketplace: mp } } } },
        marketplaceAttributes: { where: { marketplace: mp } },
        marketplaceListings: { where: { marketplace: mp } },
      },
    });

    // Group by categoryId
    const groups = new Map<string, typeof products>();
    const noCategoryProducts: typeof products = [];

    for (const p of products) {
      if (!p.categoryId) { noCategoryProducts.push(p); continue; }
      const arr = groups.get(p.categoryId) ?? [];
      arr.push(p);
      groups.set(p.categoryId, arr);
    }

    // Build category groups with marketplace mapping and attributes
    const categoryGroups = [];

    for (const [, prods] of groups) {
      const cat = prods[0].category!;
      const mapping = cat.marketplaceMappings?.[0];

      let categoryAttributes: unknown[] = [];
      if (mapping) {
        // Get cached attributes from marketplace_categories
        const mpCat = await prisma.marketplaceCategory.findFirst({
          where: { marketplace: mp, marketplaceCategoryId: mapping.marketplaceCategoryId },
        });
        if (mpCat?.attributes && Array.isArray(mpCat.attributes) && (mpCat.attributes as unknown[]).length > 0) {
          categoryAttributes = mpCat.attributes as unknown[];
        } else {
          // Fetch live from API and cache
          try {
            const liveAttrs = await this.getCategoryAttributes(ts, mp, mapping.marketplaceCategoryId);
            const raw = liveAttrs as Record<string, unknown>;

            // Normalize: Trendyol uses categoryAttributes, HB uses baseAttributes+attributes+variantAttributes
            let attrsArray: unknown[] = [];
            if (Array.isArray(raw.categoryAttributes) && raw.categoryAttributes.length > 0) {
              // Trendyol format
              attrsArray = raw.categoryAttributes;
            } else if (raw.baseAttributes || raw.attributes || raw.variantAttributes) {
              // HB format — normalize, skip system fields that are auto-filled by sendProducts
              const HB_SYSTEM_FIELDS = new Set([
                'merchantsku', 'barcode', 'urunadi', 'urunaciklamasi', 'marka',
                'garantisuresi', 'kg', 'tax_vat_rate', 'price', 'stock',
                'image1', 'image2', 'image3', 'image4', 'image5', 'image6', 'image7', 'image8',
                'varyantgroupid', 'satıcı stok kodu', 'ürün adı', 'barkod', 'görsel1',
                'görsel2', 'görsel3', 'görsel4', 'görsel5', 'kdv',
              ]);

              const hbAttrs = (raw.attributes ?? []) as Array<Record<string, unknown>>;
              const hbVariant = (raw.variantAttributes ?? []) as Array<Record<string, unknown>>;
              // Skip baseAttributes entirely (system fields) — only use attributes + variantAttributes
              const all = [...hbAttrs, ...hbVariant];
              const filtered = all
                .filter(a => !HB_SYSTEM_FIELDS.has(String(a.id ?? a.name ?? '').toLowerCase()))
                .filter(a => a.type !== 'media');

              // For HB enum attributes without values, fetch values from separate endpoint
              const enriched = [];
              for (const a of filtered) {
                let vals: Array<{ id: unknown; name: string }> = [];
                if (Array.isArray(a.values) && a.values.length > 0) {
                  vals = (a.values as Array<Record<string, unknown>>).map(v => ({
                    id: v.id ?? v.value ?? v.name,
                    name: String(v.value ?? v.name ?? v.id ?? ''),
                  }));
                } else if (a.type === 'enum' && a.id && (a.mandatory || hbVariant.includes(a))) {
                  // Fetch enum values for mandatory/variant attributes
                  try {
                    const valRes = await this.hb.getAttributeValues(
                      await this.resolveHb(ts),
                      parseInt(String(mapping.marketplaceCategoryId), 10),
                      String(a.id),
                    );
                    vals = ((valRes as Record<string, unknown>).values as Array<Record<string, unknown>> ?? []).map(v => ({
                      id: v.id ?? v.value ?? v.name,
                      name: String(v.value ?? v.name ?? v.id ?? ''),
                    }));
                  } catch {
                    // Values couldn't be fetched — will show as text input
                  }
                }

                enriched.push({
                  allowCustom: a.type === 'string' || (a.type === 'enum' && vals.length === 0),
                  required: !!a.mandatory,
                  varianter: hbVariant.includes(a),
                  slicer: false,
                  attribute: { id: a.id ?? a.name, name: String(a.name ?? a.id ?? '') },
                  attributeValues: vals,
                });
              }
              attrsArray = enriched;
            } else if (Array.isArray(liveAttrs)) {
              attrsArray = liveAttrs;
            }

            if (attrsArray.length > 0) {
              categoryAttributes = attrsArray;
              if (mpCat) {
                await prisma.marketplaceCategory.update({
                  where: { id: mpCat.id },
                  data: { attributes: attrsArray as object[] },
                });
              }
            }
          } catch (err) {
            this.logger.warn(`Failed to fetch attributes for category ${mapping.marketplaceCategoryId}`, err);
          }
        }
      }

      // Extract variant attribute names for auto-matching
      const variantAttrNames = new Set<string>();
      for (const p of prods) {
        const variants = (p.variants as Array<{ attributes?: Record<string, string> }>) ?? [];
        for (const v of variants) {
          if (v.attributes) {
            Object.keys(v.attributes).forEach(k => variantAttrNames.add(k.toLowerCase()));
          }
        }
      }

      categoryGroups.push({
        localCategory: { id: cat.id, name: cat.name },
        marketplaceCategory: mapping ? { id: mapping.marketplaceCategoryId, name: '' } : null,
        mapped: !!mapping,
        categoryAttributes,
        variantAttributeNames: Array.from(variantAttrNames),
        products: prods.map(p => ({
          id: p.id,
          name: p.name,
          sku: p.sku,
          barcode: p.barcode,
          price: p.price,
          stock: p.stock,
          variants: p.variants,
          images: p.images,
          existingAttributes: p.marketplaceAttributes.map(a => ({
            attributeId: a.attributeId,
            attributeName: a.attributeName,
            value: a.value,
            valueId: a.valueId,
            variantIndex: a.variantIndex,
          })),
          listingStatus: p.marketplaceListings[0]?.status ?? null,
          seoMeta: p.seoMeta,
        })),
      });
    }

    const zeroStockProductIds = products.filter(p => p.stock <= 0).map(p => p.id);

    return { categoryGroups, noCategoryCount: noCategoryProducts.length, zeroStockProductIds };
  }

  async saveProductAttributes(ts: string, mp: string, productId: string, attributes: Array<{ attributeId: string; attributeName: string; value: string; valueId?: string; variantIndex?: number }>) {
    this.v(mp);
    const prisma = getTenantClient(ts);

    for (const attr of attributes) {
      const variantIndex = attr.variantIndex ?? -1;
      await prisma.productMarketplaceAttribute.upsert({
        where: {
          productId_marketplace_attributeId_variantIndex: {
            productId,
            marketplace: mp,
            attributeId: attr.attributeId,
            variantIndex,
          },
        },
        create: {
          productId,
          marketplace: mp,
          attributeId: attr.attributeId,
          attributeName: attr.attributeName,
          value: attr.value,
          valueId: attr.valueId ?? null,
          variantIndex,
        },
        update: {
          value: attr.value,
          valueId: attr.valueId ?? null,
          attributeName: attr.attributeName,
        },
      });
    }

    return { saved: attributes.length };
  }

  async syncBrands(ts: string, mp: string) {
    this.v(mp);
    if (mp === 'trendyol') return this.ty.syncBrands(ts);
    throw new BadRequestException(`Brand sync not supported for ${mp}`);
  }

  async searchBrands(ts: string, mp: string, query?: string, page = 0, limit = 50) {
    this.v(mp);
    const prisma = getTenantClient(ts);
    const where: Record<string, unknown> = { marketplace: mp };
    if (query) where.brandName = { contains: query, mode: 'insensitive' };
    const [brands, total] = await Promise.all([
      prisma.marketplaceBrand.findMany({ where, skip: page * limit, take: limit, orderBy: { brandName: 'asc' } }),
      prisma.marketplaceBrand.count({ where }),
    ]);
    return { brands, total, page, limit };
  }

  async getLocalBrands(ts: string) {
    const prisma = getTenantClient(ts);
    // Extract unique brand names from product seoMeta
    const products = await prisma.product.findMany({
      select: { seoMeta: true },
      where: { seoMeta: { not: null as unknown as undefined } },
    });

    const brandSet = new Set<string>();
    for (const p of products) {
      const meta = p.seoMeta as Record<string, unknown> | null;
      if (!meta) continue;
      const brand = (meta.trendyolBrand || meta.hepsiburadaBrand || meta.brand) as string | undefined;
      if (brand?.trim()) brandSet.add(brand.trim());
    }

    return Array.from(brandSet).sort((a, b) => a.localeCompare(b, 'tr'));
  }

  async getBrandMappings(ts: string, mp: string) {
    this.v(mp);
    const prisma = getTenantClient(ts);

    // Get local brands
    const localBrands = await this.getLocalBrands(ts);

    // For each local brand, find if there's a matching marketplace brand
    const mappings = [];
    for (const brandName of localBrands) {
      const mpBrand = await prisma.marketplaceBrand.findFirst({
        where: {
          marketplace: mp,
          brandName: { equals: brandName, mode: 'insensitive' },
        },
      });
      mappings.push({
        localBrand: brandName,
        marketplaceBrand: mpBrand ? { id: mpBrand.marketplaceBrandId, name: mpBrand.brandName } : null,
        mapped: !!mpBrand,
      });
    }

    return mappings;
  }

  async saveBrandMapping(ts: string, mp: string, localBrand: string, marketplaceBrandId: string) {
    this.v(mp);
    const prisma = getTenantClient(ts);

    // Get marketplace brand name
    const mpBrand = await prisma.marketplaceBrand.findFirst({
      where: { marketplace: mp, marketplaceBrandId },
    });
    if (!mpBrand) throw new BadRequestException('Marketplace brand not found');

    // Update all products with this local brand to use the marketplace brand name
    // This ensures sendProducts can resolve the brandId
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { seoMeta: { path: ['trendyolBrand'], equals: localBrand } },
          { seoMeta: { path: ['hepsiburadaBrand'], equals: localBrand } },
          { seoMeta: { path: ['brand'], equals: localBrand } },
        ],
      },
    });

    for (const p of products) {
      const meta = (p.seoMeta ?? {}) as Record<string, unknown>;
      meta[`${mp}BrandId`] = marketplaceBrandId;
      meta[`${mp}BrandName`] = mpBrand.brandName;
      await prisma.product.update({
        where: { id: p.id },
        data: { seoMeta: meta as object },
      });
    }

    return { mapped: products.length, brandName: mpBrand.brandName, brandId: marketplaceBrandId };
  }

  async autoMatchBrands(ts: string, mp: string) {
    this.v(mp);
    const prisma = getTenantClient(ts);
    const localBrands = await this.getLocalBrands(ts);

    let matched = 0;
    for (const brandName of localBrands) {
      const mpBrand = await prisma.marketplaceBrand.findFirst({
        where: {
          marketplace: mp,
          brandName: { equals: brandName, mode: 'insensitive' },
        },
      });
      if (mpBrand) {
        await this.saveBrandMapping(ts, mp, brandName, mpBrand.marketplaceBrandId);
        matched++;
      }
    }

    return { matched, total: localBrands.length };
  }

  async checkBatch(ts: string, mp: string, batchId: string) {
    this.v(mp);
    const prisma = getTenantClient(ts);

    // Get batch status from marketplace API
    let batchStatus: Record<string, unknown>;
    if (mp === 'trendyol') batchStatus = await this.ty.getBatchStatus(ts, batchId);
    else if (mp === 'hepsiburada') {
      try {
        const cr = await this.resolveHb(ts);
        batchStatus = await this.hb.getProductStatus(cr, batchId) as Record<string, unknown>;
      } catch {
        batchStatus = { trackingId: batchId, status: 'checking' };
      }
    } else if (mp === 'ciceksepeti') {
      const cr = await this.resolveCs(ts);
      batchStatus = await this.cs.getBatchStatus(cr, batchId) as Record<string, unknown>;
    } else {
      batchStatus = { batchId, status: 'unknown' };
    }

    // Update MarketplaceListing statuses for this batch
    const listings = await prisma.marketplaceListing.findMany({
      where: { marketplace: mp, batchId },
    });

    const failedItems = (batchStatus.failedItems ?? batchStatus.items ?? []) as Array<{ productId?: string; errors?: unknown[] }>;
    const failedProductIds = new Set(failedItems.map(i => i.productId).filter(Boolean));

    for (const listing of listings) {
      const isFailed = failedProductIds.has(listing.productId);
      const newStatus = failedItems.length === 0 ? 'approved' : isFailed ? 'failed' : 'approved';

      await prisma.marketplaceListing.update({
        where: { id: listing.id },
        data: {
          status: newStatus,
          errorMessage: isFailed ? JSON.stringify(failedItems.find(i => i.productId === listing.productId)?.errors) : null,
        },
      });
    }

    return { batchStatus, updatedListings: listings.length };
  }

  private xn(name: unknown): string {
    if (typeof name === 'string') return name;
    if (name && typeof name === 'object') { const o = name as Record<string, string>; return o.en ?? o.tr ?? Object.values(o)[0] ?? ''; }
    return '';
  }

  // -----------------------------------------------------------------------
  // Order sync
  // -----------------------------------------------------------------------

  async syncOrders(
    ts: string,
    mp: string,
    options?: { startDate?: number; endDate?: number },
  ) {
    this.v(mp);
    if (mp === 'trendyol') return this.ty.fetchOrders(ts, options);
    // Future: HB / CS order sync
    throw new BadRequestException(`Order sync not yet supported for ${mp}`);
  }

  async getMarketplaceOrders(
    ts: string,
    mp: string,
    page = 0,
    limit = 50,
    status?: string,
  ) {
    this.v(mp);
    const prisma = getTenantClient(ts);
    const where: Record<string, unknown> = { source: mp };
    if (status && status !== 'all') where.status = status;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip: page * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: {
            select: { id: true, email: true, firstName: true, lastName: true },
          },
        },
      }),
      prisma.order.count({ where }),
    ]);

    return {
      data: orders,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getMarketplaceOrderStats(ts: string) {
    const prisma = getTenantClient(ts);
    const marketplaces = ['trendyol', 'hepsiburada', 'ciceksepeti'];
    const stats = [];

    for (const mp of marketplaces) {
      const [total, byStatus, revenue] = await Promise.all([
        prisma.order.count({ where: { source: mp } }),
        prisma.order.groupBy({
          by: ['status'],
          where: { source: mp },
          _count: { id: true },
        }),
        prisma.order.aggregate({
          where: { source: mp, paymentStatus: 'paid' },
          _sum: { totalAmount: true },
        }),
      ]);

      stats.push({
        marketplace: mp,
        totalOrders: total,
        totalRevenue: Number(revenue._sum.totalAmount ?? 0),
        byStatus: Object.fromEntries(
          byStatus.map((s) => [s.status, s._count.id]),
        ),
      });
    }

    // Web orders too
    const [webTotal, webRevenue] = await Promise.all([
      prisma.order.count({ where: { source: 'web' } }),
      prisma.order.aggregate({
        where: { source: 'web', paymentStatus: 'paid' },
        _sum: { totalAmount: true },
      }),
    ]);

    stats.unshift({
      marketplace: 'web',
      totalOrders: webTotal,
      totalRevenue: Number(webRevenue._sum.totalAmount ?? 0),
      byStatus: {},
    });

    return stats;
  }
}
