import { Injectable, Logger } from '@nestjs/common';
import { getTenantClient, type TenantPrismaClient } from '@zunapro/db';
import {
  getSeedData,
  getCommonSeedData,
  type SeedProduct,
  type SeedCategory,
  type SeedPage,
  type SeedSetting,
  type SeedCustomer,
  type SeedOrder,
  type SeedMenu,
  type SeedBlogPost,
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
      const productMap = await this.seedProducts(client, seedData.products, categoryMap);
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

      // 5.5. Menus
      const allMenus = seedData.menus ?? commonData.menus ?? [];
      await this.seedMenus(client, allMenus);
      this.logger.log(`Seeded ${allMenus.length} menus (tenant: ${slug})`);

      // 5.6. Blog Posts
      const allBlogPosts = seedData.blogPosts ?? [];
      if (allBlogPosts.length > 0) {
        await this.seedBlogPosts(client, allBlogPosts);
        this.logger.log(`Seeded ${allBlogPosts.length} blog posts (tenant: ${slug})`);
      }

      // 6. Customers
      const allCustomers = seedData.customers ?? commonData.customers;
      const customerMap = await this.seedCustomers(client, allCustomers);
      this.logger.log(`Seeded ${allCustomers.length} customers (tenant: ${slug})`);

      // 7. Orders
      const allOrders = seedData.orders ?? commonData.orders;
      await this.seedOrders(client, allOrders, customerMap, productMap);
      this.logger.log(`Seeded ${allOrders.length} orders (tenant: ${slug})`);

      // 8. Media (from product/category images)
      await this.seedMedia(client, seedData.products, seedData.categories);
      this.logger.log(`Seeded media records (tenant: ${slug})`);
    });

    this.logger.log(`Tenant seed complete: ${slug} (sector: ${sector})`);
  }

  async reseedTenant(
    slug: string,
    sector: string,
    branding: BrandingConfig,
  ): Promise<void> {
    const prisma = getTenantClient(slug);

    await prisma.$transaction(async (tx) => {
      const client = tx as unknown as TenantPrismaClient;
      // Delete in dependency order
      await client.order.deleteMany();
      await client.customer.deleteMany();
      await client.product.deleteMany();
      await client.category.deleteMany();
      await client.media.deleteMany();
      await client.page.deleteMany();
      await client.setting.deleteMany();
      await client.menu.deleteMany();
      await client.blogPost.deleteMany();
      await client.globalSection.deleteMany();
    });

    this.logger.log(`Cleared existing data for reseed (tenant: ${slug})`);
    await this.seedTenant(slug, sector, branding);
  }

  private async seedCategories(
    tx: TenantPrismaClient,
    categories: SeedCategory[],
  ): Promise<Map<string, string>> {
    const map = new Map<string, string>();

    // First pass: create all categories without parents
    for (const cat of categories) {
      if (cat.parentSlug) continue;
      const created = await tx.category.upsert({
        where: { slug: cat.slug },
        create: {
          name: JSON.parse(JSON.stringify(cat.name)),
          slug: cat.slug,
          image: cat.image ?? null,
          sortOrder: cat.sortOrder,
          isFeatured: cat.isFeatured ?? false,
        },
        update: {},
      });
      map.set(cat.slug, created.id);
    }

    // Second pass: create child categories with parent reference
    for (const cat of categories) {
      if (!cat.parentSlug) continue;
      const parentId = map.get(cat.parentSlug);
      const created = await tx.category.upsert({
        where: { slug: cat.slug },
        create: {
          name: JSON.parse(JSON.stringify(cat.name)),
          slug: cat.slug,
          image: cat.image ?? null,
          sortOrder: cat.sortOrder,
          isFeatured: cat.isFeatured ?? false,
          parentId: parentId ?? null,
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
  ): Promise<Map<string, { id: string; price: number; name: Record<string, string>; sku: string; images: string[] }>> {
    const map = new Map<string, { id: string; price: number; name: Record<string, string>; sku: string; images: string[] }>();

    for (const prod of products) {
      const categoryId = categoryMap.get(prod.categorySlug) ?? null;

      const created = await tx.product.upsert({
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
          isFeatured: prod.isFeatured ?? false,
        },
        update: {},
      });
      map.set(prod.slug, {
        id: created.id,
        price: prod.price,
        name: prod.name,
        sku: prod.sku,
        images: prod.images,
      });
    }

    return map;
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

  private async seedMenus(
    tx: TenantPrismaClient,
    menus: SeedMenu[],
  ): Promise<void> {
    for (const menu of menus) {
      await tx.menu.upsert({
        where: { slug: menu.slug },
        create: {
          name: JSON.parse(JSON.stringify(menu.name)),
          slug: menu.slug,
          location: menu.location,
          items: JSON.parse(JSON.stringify(menu.items)),
          isActive: menu.isActive ?? true,
        },
        update: {},
      });
    }
  }

  private async seedBlogPosts(
    tx: TenantPrismaClient,
    blogPosts: SeedBlogPost[],
  ): Promise<void> {
    for (const post of blogPosts) {
      await tx.blogPost.upsert({
        where: { slug: post.slug },
        create: {
          title: JSON.parse(JSON.stringify(post.title)),
          slug: post.slug,
          excerpt: JSON.parse(JSON.stringify(post.excerpt)),
          content: JSON.parse(JSON.stringify(post.content)),
          featuredImage: post.featuredImage ?? null,
          author: post.author ?? null,
          category: post.category ?? null,
          tags: post.tags ? JSON.parse(JSON.stringify(post.tags)) : [],
          status: post.status,
          publishedAt: new Date(post.publishedAt),
        },
        update: {},
      });
    }
  }

  private async seedCustomers(
    tx: TenantPrismaClient,
    customers: SeedCustomer[],
  ): Promise<Map<number, string>> {
    const map = new Map<number, string>();

    for (let i = 0; i < customers.length; i++) {
      const c = customers[i];
      const created = await tx.customer.upsert({
        where: { email: c.email },
        create: {
          email: c.email,
          firstName: c.firstName,
          lastName: c.lastName,
          phone: c.phone ?? null,
          locale: c.locale,
          isGuest: false,
          addresses: JSON.parse(JSON.stringify(c.addresses)),
        },
        update: {},
      });
      map.set(i, created.id);
    }

    return map;
  }

  private async seedOrders(
    tx: TenantPrismaClient,
    orders: SeedOrder[],
    customerMap: Map<number, string>,
    productMap: Map<string, { id: string; price: number; name: Record<string, string>; sku: string; images: string[] }>,
  ): Promise<void> {
    const productEntries = Array.from(productMap.entries());
    if (productEntries.length === 0) return;

    const now = Date.now();

    for (let i = 0; i < orders.length; i++) {
      const o = orders[i];
      const customerId = customerMap.get(o.customerIndex);
      if (!customerId) continue;

      // Resolve products: use explicit slugs or auto-assign from available products
      const items: { productId: string; price: number; name: Record<string, string>; sku: string; quantity: number; images: string[] }[] = [];

      if (o.productSlugs.length > 0) {
        for (let j = 0; j < o.productSlugs.length; j++) {
          const prod = productMap.get(o.productSlugs[j]);
          if (prod) {
            items.push({
              productId: prod.id,
              price: prod.price,
              name: prod.name,
              sku: prod.sku,
              quantity: o.quantities[j] ?? 1,
              images: prod.images,
            });
          }
        }
      }

      // Auto-assign if no explicit slugs or none resolved
      if (items.length === 0) {
        const count = Math.min(1 + (i % 3), productEntries.length);
        for (let j = 0; j < count; j++) {
          const idx = (i + j) % productEntries.length;
          const [, prod] = productEntries[idx];
          items.push({
            productId: prod.id,
            price: prod.price,
            name: prod.name,
            sku: prod.sku,
            quantity: 1 + (j % 2),
            images: prod.images,
          });
        }
      }

      const subtotalAmount = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
      const shippingCost = 9.99;
      const totalAmount = subtotalAmount + shippingCost;
      const orderNumber = `ORD-${now}-${String(i + 1).padStart(3, '0')}`;

      // Build items as JSON array matching the schema
      const itemsJson = items.map((it) => ({
        productId: it.productId,
        name: it.name,
        sku: it.sku,
        price: it.price,
        quantity: it.quantity,
        total: it.price * it.quantity,
        image: it.images[0] ?? null,
      }));

      await tx.order.create({
        data: {
          orderNumber,
          customerId,
          status: o.status,
          paymentStatus: o.paymentStatus,
          paymentMethod: o.paymentMethod,
          locale: o.locale,
          currency: o.currency,
          subtotalAmount,
          shippingCost,
          totalAmount,
          items: itemsJson,
        },
      });
    }
  }

  private async seedMedia(
    tx: TenantPrismaClient,
    products: SeedProduct[],
    categories: SeedCategory[],
  ): Promise<void> {
    const seenUrls = new Set<string>();

    for (const prod of products) {
      for (const url of prod.images) {
        if (!url || seenUrls.has(url)) continue;
        seenUrls.add(url);

        const filename = url.split('/').pop() ?? 'image.jpg';
        await tx.media.create({
          data: {
            url,
            filename,
            mimeType: 'image/jpeg',
            size: 0,
            alt: JSON.parse(JSON.stringify(prod.name)),
          },
        });
      }
    }

    for (const cat of categories) {
      if (!cat.image || seenUrls.has(cat.image)) continue;
      seenUrls.add(cat.image);

      const filename = cat.image.split('/').pop() ?? 'image.jpg';
      await tx.media.create({
        data: {
          url: cat.image,
          filename,
          mimeType: 'image/jpeg',
          size: 0,
          alt: JSON.parse(JSON.stringify(cat.name)),
        },
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
