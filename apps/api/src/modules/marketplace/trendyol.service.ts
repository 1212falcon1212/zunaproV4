import {
  Injectable,
  Logger,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { getTenantClient } from '@zunapro/db';

const TRENDYOL_API_BASE = 'https://apigw.trendyol.com';
const TRENDYOL_STAGE_BASE = 'https://stageapigw.trendyol.com';

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
  attributes: { attributeName: string; attributeValue: string }[];
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

interface FilterOptions {
  page?: number;
  size?: number;
  approved?: boolean;
  onSale?: boolean;
  barcode?: string;
  stockCode?: string;
}

@Injectable()
export class TrendyolService {
  private readonly logger = new Logger(TrendyolService.name);

  private buildAuthHeader(credentials: TrendyolCredentials): string {
    const encoded = Buffer.from(
      `${credentials.apiKey}:${credentials.apiSecret}`,
    ).toString('base64');
    return `Basic ${encoded}`;
  }

  private buildUserAgent(supplierId: string): string {
    return `${supplierId} - SelfIntegration`;
  }

  private async trendyolFetch<T>(
    path: string,
    credentials: TrendyolCredentials,
    options?: { method?: string; body?: unknown },
  ): Promise<T> {
    const url = `${TRENDYOL_API_BASE}${path}`;
    const headers: Record<string, string> = {
      Authorization: this.buildAuthHeader(credentials),
      'User-Agent': this.buildUserAgent(credentials.supplierId),
      'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
      method: options?.method ?? 'GET',
      headers,
      body: options?.body ? JSON.stringify(options.body) : undefined,
    });

    if (response.status === 401) {
      throw new UnauthorizedException(
        'Trendyol API authentication failed. Check your credentials.',
      );
    }

    if (response.status === 403) {
      throw new UnauthorizedException(
        'Trendyol API access forbidden. Check User-Agent header.',
      );
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new BadRequestException(
        `Trendyol API error (${response.status}): ${errorText}`,
      );
    }

    return response.json() as Promise<T>;
  }

  async testConnection(credentials: TrendyolCredentials): Promise<boolean> {
    try {
      await this.trendyolFetch<TrendyolProductResponse>(
        `/integration/product/sellers/${credentials.supplierId}/products?page=0&size=1`,
        credentials,
      );
      return true;
    } catch (error) {
      this.logger.warn('Trendyol connection test failed', error);
      return false;
    }
  }

  async getProducts(
    credentials: TrendyolCredentials,
    filters: FilterOptions = {},
  ): Promise<TrendyolProductResponse> {
    const params = new URLSearchParams();
    params.set('page', String(filters.page ?? 0));
    params.set('size', String(Math.min(filters.size ?? 50, 200)));

    if (filters.approved !== undefined)
      params.set('approved', String(filters.approved));
    if (filters.onSale !== undefined)
      params.set('onSale', String(filters.onSale));
    if (filters.barcode) params.set('barcode', filters.barcode);
    if (filters.stockCode) params.set('stockCode', filters.stockCode);

    return this.trendyolFetch<TrendyolProductResponse>(
      `/integration/product/sellers/${credentials.supplierId}/products?${params.toString()}`,
      credentials,
    );
  }

  async importProductsToStore(
    tenantSlug: string,
    credentials: TrendyolCredentials,
    filters: FilterOptions = {},
  ): Promise<{ imported: number; skipped: number; errors: string[] }> {
    const prisma = getTenantClient(tenantSlug);
    const response = await this.getProducts(credentials, filters);
    const products = response.content;

    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const tp of products) {
      try {
        const slug = this.generateSlug(tp.title);

        // Check if product already imported (by stockCode or barcode)
        const existing = await prisma.product.findFirst({
          where: {
            OR: [
              { sku: tp.stockCode || undefined },
              { slug },
            ],
          },
        });

        if (existing) {
          skipped++;
          continue;
        }

        const images = tp.images?.map((img) => img.url) ?? [];

        await prisma.product.create({
          data: {
            name: { tr: tp.title, en: tp.title },
            slug: `${slug}-${Date.now()}`,
            description: tp.description
              ? { tr: tp.description, en: tp.description }
              : {},
            price: tp.salePrice,
            compareAtPrice: tp.listPrice > tp.salePrice ? tp.listPrice : null,
            sku: tp.stockCode || null,
            stock: tp.quantity,
            images,
            status: 'draft',
            isFeatured: false,
            seoMeta: {
              trendyolId: tp.id,
              trendyolBarcode: tp.barcode,
              trendyolBrand: tp.brandName,
              trendyolCategory: tp.categoryName,
              source: 'trendyol',
            },
          },
        });

        imported++;
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : `Failed to import: ${tp.title}`;
        errors.push(msg);
        this.logger.warn(`Trendyol import error for ${tp.title}`, err);
      }
    }

    this.logger.log(
      `Trendyol import: ${imported} imported, ${skipped} skipped, ${errors.length} errors (tenant: ${tenantSlug})`,
    );

    return { imported, skipped, errors };
  }

  async saveCredentials(
    tenantSlug: string,
    credentials: TrendyolCredentials,
  ): Promise<void> {
    const prisma = getTenantClient(tenantSlug);

    await prisma.setting.upsert({
      where: { key: 'trendyol_config' },
      create: {
        key: 'trendyol_config',
        value: {
          supplierId: credentials.supplierId,
          apiKey: credentials.apiKey,
          apiSecret: credentials.apiSecret,
          connectedAt: new Date().toISOString(),
        },
      },
      update: {
        value: {
          supplierId: credentials.supplierId,
          apiKey: credentials.apiKey,
          apiSecret: credentials.apiSecret,
          connectedAt: new Date().toISOString(),
        },
      },
    });
  }

  async getCredentials(
    tenantSlug: string,
  ): Promise<TrendyolCredentials | null> {
    const prisma = getTenantClient(tenantSlug);

    const setting = await prisma.setting.findUnique({
      where: { key: 'trendyol_config' },
    });

    if (!setting?.value) return null;

    const val = setting.value as Record<string, string>;
    if (!val.supplierId || !val.apiKey || !val.apiSecret) return null;

    return {
      supplierId: val.supplierId,
      apiKey: val.apiKey,
      apiSecret: val.apiSecret,
    };
  }

  async removeCredentials(tenantSlug: string): Promise<void> {
    const prisma = getTenantClient(tenantSlug);
    await prisma.setting
      .delete({ where: { key: 'trendyol_config' } })
      .catch(() => {});
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9çğıöşü]+/gi, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 80);
  }
}
