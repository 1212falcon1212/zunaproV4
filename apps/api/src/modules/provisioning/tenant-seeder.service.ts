import { Injectable, Logger } from '@nestjs/common';
import { getTenantClient, type TenantPrismaClient } from '@zunapro/db';
import {
  getSeedData,
  getCommonSeedData,
  type SeedProduct,
  type SeedCategory,
  type SeedPage,
  type SeedSetting,
} from '@zunapro/themes';
import type { PageContent } from '@zunapro/types';

interface BrandingConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

@Injectable()
export class TenantSeederService {
  private readonly logger = new Logger(TenantSeederService.name);

  async seedTenant(
    slug: string,
    sector: string,
    branding: BrandingConfig,
  ): Promise<void> {
    const prisma = getTenantClient(slug);
    const seedData = getSeedData(sector);
    const commonData = getCommonSeedData();

    await prisma.$transaction(async (tx) => {
      const client = tx as unknown as TenantPrismaClient;

      // 1. Categories
      const categoryMap = await this.seedCategories(client, seedData.categories);
      this.logger.log(
        `Seeded ${seedData.categories.length} categories (tenant: ${slug})`,
      );

      // 2. Products
      await this.seedProducts(client, seedData.products, categoryMap);
      this.logger.log(
        `Seeded ${seedData.products.length} products (tenant: ${slug})`,
      );

      // 3. Pages (sector + common, apply branding)
      const allPages = [...seedData.pages, ...commonData.pages];
      await this.seedPages(client, allPages, branding);
      this.logger.log(`Seeded ${allPages.length} pages (tenant: ${slug})`);

      // 4. Header & Footer
      const header =
        seedData.header.blocks.length > 0
          ? seedData.header
          : commonData.header;
      const footer =
        seedData.footer.blocks.length > 0
          ? seedData.footer
          : commonData.footer;
      await this.seedGlobalSections(client, header, footer);
      this.logger.log(`Seeded header + footer (tenant: ${slug})`);

      // 5. Settings
      const allSettings = [...seedData.settings, ...commonData.settings];
      await this.seedSettings(client, allSettings);
      this.logger.log(
        `Seeded ${allSettings.length} settings (tenant: ${slug})`,
      );
    });

    this.logger.log(`Tenant seed complete: ${slug} (sector: ${sector})`);
  }

  private async seedCategories(
    tx: TenantPrismaClient,
    categories: SeedCategory[],
  ): Promise<Map<string, string>> {
    const map = new Map<string, string>();

    for (const cat of categories) {
      const created = await tx.category.upsert({
        where: { slug: cat.slug },
        create: {
          name: JSON.parse(JSON.stringify(cat.name)),
          slug: cat.slug,
          image: cat.image ?? null,
          sortOrder: cat.sortOrder,
        },
        update: {},
      });
      map.set(cat.slug, created.id);
    }

    return map;
  }

  private async seedProducts(
    tx: TenantPrismaClient,
    products: SeedProduct[],
    categoryMap: Map<string, string>,
  ): Promise<void> {
    for (const prod of products) {
      const categoryId = categoryMap.get(prod.categorySlug) ?? null;

      await tx.product.upsert({
        where: { slug: prod.slug },
        create: {
          name: JSON.parse(JSON.stringify(prod.name)),
          slug: prod.slug,
          description: JSON.parse(JSON.stringify(prod.description)),
          price: prod.price,
          compareAtPrice: prod.compareAtPrice ?? null,
          sku: prod.sku,
          stock: prod.stock,
          images: JSON.parse(JSON.stringify(prod.images)),
          categoryId,
          seoMeta: prod.seoMeta
            ? JSON.parse(JSON.stringify(prod.seoMeta))
            : null,
          status: prod.status,
        },
        update: {},
      });
    }
  }

  private async seedPages(
    tx: TenantPrismaClient,
    pages: SeedPage[],
    branding: BrandingConfig,
  ): Promise<void> {
    for (const page of pages) {
      const brandedContent = this.applyBranding(page.content, branding);

      await tx.page.upsert({
        where: { slug: page.slug },
        create: {
          title: JSON.parse(JSON.stringify(page.title)),
          slug: page.slug,
          content: JSON.parse(JSON.stringify(brandedContent)),
          isPublished: page.isPublished,
          seoMeta: JSON.parse(JSON.stringify(page.seoMeta)),
        },
        update: {},
      });
    }
  }

  private async seedGlobalSections(
    tx: TenantPrismaClient,
    header: PageContent,
    footer: PageContent,
  ): Promise<void> {
    await tx.globalSection.upsert({
      where: { type: 'header' },
      create: {
        type: 'header',
        content: JSON.parse(JSON.stringify(header)),
      },
      update: {},
    });

    await tx.globalSection.upsert({
      where: { type: 'footer' },
      create: {
        type: 'footer',
        content: JSON.parse(JSON.stringify(footer)),
      },
      update: {},
    });
  }

  private async seedSettings(
    tx: TenantPrismaClient,
    settings: SeedSetting[],
  ): Promise<void> {
    for (const setting of settings) {
      await tx.setting.upsert({
        where: { key: setting.key },
        create: {
          key: setting.key,
          value: JSON.parse(JSON.stringify(setting.value)),
          group: setting.group,
        },
        update: {},
      });
    }
  }

  /**
   * Replace placeholder color tokens in block props with the tenant's branding colors.
   */
  private applyBranding(
    content: PageContent,
    branding: BrandingConfig,
  ): PageContent {
    const serialized = JSON.stringify(content);
    const branded = serialized
      .replace(/\{\{primaryColor\}\}/g, branding.primaryColor)
      .replace(/\{\{secondaryColor\}\}/g, branding.secondaryColor)
      .replace(/\{\{accentColor\}\}/g, branding.accentColor);
    return JSON.parse(branded) as PageContent;
  }
}
