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
      if (!dto.merchantId) throw new BadRequestException('merchantId required');
      const c = { merchantId: dto.merchantId, apiKey: dto.apiKey, apiSecret: dto.apiSecret };
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

  async getCategories(ts: string, mp: string, search?: string, page = 0, limit = 50) {
    this.v(mp);
    const p = getTenantClient(ts);
    const w: Record<string, unknown> = { marketplace: mp };
    if (search) w.categoryName = { contains: search, mode: 'insensitive' };
    const [cats, total] = await Promise.all([
      p.marketplaceCategory.findMany({ where: w, skip: page * limit, take: limit, orderBy: { categoryName: 'asc' } }),
      p.marketplaceCategory.count({ where: w }),
    ]);
    return { categories: cats, total, page, limit };
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
    return getTenantClient(ts).marketplaceCategoryMapping.findMany({ where: { marketplace: mp }, include: { localCategory: true } });
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

  private xn(name: unknown): string {
    if (typeof name === 'string') return name;
    if (name && typeof name === 'object') { const o = name as Record<string, string>; return o.en ?? o.tr ?? Object.values(o)[0] ?? ''; }
    return '';
  }
}
