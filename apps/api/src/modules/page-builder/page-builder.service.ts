import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { getTenantClient } from '@zunapro/db';
import type { PageContent } from '@zunapro/types';
import { RedisService } from '../../common/redis';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function jsonInput(value: unknown): any {
  return JSON.parse(JSON.stringify(value));
}

@Injectable()
export class PageBuilderService {
  private readonly logger = new Logger(PageBuilderService.name);

  constructor(private readonly redis: RedisService) {}

  // ─── Pages CRUD ──────────────────────────────────────────

  async findAllPages(tenantSlug: string) {
    const prisma = getTenantClient(tenantSlug);
    const pages = await prisma.page.findMany({
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        title: true,
        slug: true,
        template: true,
        isPublished: true,
        sortOrder: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return { data: pages };
  }

  async findPageById(tenantSlug: string, id: string) {
    const prisma = getTenantClient(tenantSlug);
    const page = await prisma.page.findUnique({ where: { id } });
    if (!page) {
      throw new NotFoundException(`Page with id "${id}" not found`);
    }
    return page;
  }

  async createPage(
    tenantSlug: string,
    data: {
      title: Record<string, string>;
      slug?: string;
      template?: string;
      isPublished?: boolean;
      seoMeta?: Record<string, unknown>;
    },
  ) {
    const prisma = getTenantClient(tenantSlug);
    const slug =
      data.slug || this.generateSlug(data.title.en || data.title.tr || 'page');

    const existing = await prisma.page.findUnique({ where: { slug } });
    if (existing) {
      throw new ConflictException(`Page with slug "${slug}" already exists`);
    }

    const page = await prisma.page.create({
      data: {
        title: jsonInput(data.title),
        slug,
        content: jsonInput({ version: 1, blocks: [] }),
        template: data.template || 'default',
        isPublished: data.isPublished ?? false,
        seoMeta: data.seoMeta ? jsonInput(data.seoMeta) : undefined,
      },
    });

    this.logger.log(`Page created: ${slug} (tenant: ${tenantSlug})`);
    return page;
  }

  async updatePageMeta(
    tenantSlug: string,
    id: string,
    data: {
      title?: Record<string, string>;
      slug?: string;
      template?: string;
      isPublished?: boolean;
      seoMeta?: Record<string, unknown>;
      sortOrder?: number;
    },
  ) {
    const prisma = getTenantClient(tenantSlug);
    const page = await prisma.page.findUnique({ where: { id } });
    if (!page) {
      throw new NotFoundException(`Page with id "${id}" not found`);
    }

    if (data.slug && data.slug !== page.slug) {
      const existing = await prisma.page.findUnique({
        where: { slug: data.slug },
      });
      if (existing) {
        throw new ConflictException(
          `Page with slug "${data.slug}" already exists`,
        );
      }
    }

    const updateData: Record<string, unknown> = {};
    if (data.title) updateData.title = jsonInput(data.title);
    if (data.slug) updateData.slug = data.slug;
    if (data.template) updateData.template = data.template;
    if (data.isPublished !== undefined) updateData.isPublished = data.isPublished;
    if (data.seoMeta !== undefined) updateData.seoMeta = jsonInput(data.seoMeta);
    if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;

    const updated = await prisma.page.update({
      where: { id },
      data: updateData,
    });

    await this.invalidatePageCache(tenantSlug, page.slug);
    if (data.slug && data.slug !== page.slug) {
      await this.invalidatePageCache(tenantSlug, data.slug);
    }

    return updated;
  }

  async savePageContent(tenantSlug: string, id: string, blocks: unknown[]) {
    const prisma = getTenantClient(tenantSlug);
    const page = await prisma.page.findUnique({ where: { id } });
    if (!page) {
      throw new NotFoundException(`Page with id "${id}" not found`);
    }

    const content: PageContent = { version: 1, blocks: blocks as PageContent['blocks'] };
    const updated = await prisma.page.update({
      where: { id },
      data: { content: jsonInput(content) },
    });

    await this.invalidatePageCache(tenantSlug, page.slug);
    this.logger.log(
      `Page content saved: ${page.slug} (${blocks.length} blocks, tenant: ${tenantSlug})`,
    );
    return updated;
  }

  async deletePage(tenantSlug: string, id: string) {
    const prisma = getTenantClient(tenantSlug);
    const page = await prisma.page.findUnique({ where: { id } });
    if (!page) {
      throw new NotFoundException(`Page with id "${id}" not found`);
    }

    await prisma.page.delete({ where: { id } });
    await this.invalidatePageCache(tenantSlug, page.slug);
    this.logger.log(`Page deleted: ${page.slug} (tenant: ${tenantSlug})`);
    return { message: 'Page deleted successfully' };
  }

  async duplicatePage(tenantSlug: string, id: string) {
    const prisma = getTenantClient(tenantSlug);
    const source = await prisma.page.findUnique({ where: { id } });
    if (!source) {
      throw new NotFoundException(`Page with id "${id}" not found`);
    }

    const title = source.title as Record<string, string>;
    const newTitle: Record<string, string> = {};
    for (const [lang, text] of Object.entries(title)) {
      newTitle[lang] = `${text} (Copy)`;
    }

    let newSlug = `${source.slug}-copy`;
    let counter = 1;
    while (await prisma.page.findUnique({ where: { slug: newSlug } })) {
      counter++;
      newSlug = `${source.slug}-copy-${counter}`;
    }

    const page = await prisma.page.create({
      data: {
        title: jsonInput(newTitle),
        slug: newSlug,
        content: jsonInput(source.content ?? { version: 1, blocks: [] }),
        template: source.template,
        isPublished: false,
        seoMeta: source.seoMeta ? jsonInput(source.seoMeta) : undefined,
        sortOrder: source.sortOrder + 1,
      },
    });

    this.logger.log(
      `Page duplicated: ${source.slug} → ${newSlug} (tenant: ${tenantSlug})`,
    );
    return page;
  }

  // ─── Global Sections (Header/Footer) ──────────────────

  async getGlobalSection(tenantSlug: string, type: string) {
    const cacheKey = `global-section:${tenantSlug}:${type}`;
    const cached = await this.redis.getJson<{ version: 1; blocks: unknown[] }>(
      cacheKey,
    );
    if (cached) return cached;

    const prisma = getTenantClient(tenantSlug);
    const section = await prisma.globalSection.findUnique({ where: { type } });

    if (!section) {
      const empty: PageContent = { version: 1, blocks: [] };
      return empty;
    }

    const content = section.content as unknown as PageContent;
    await this.redis.setJson(cacheKey, content, 300);
    return content;
  }

  async saveGlobalSection(
    tenantSlug: string,
    type: string,
    blocks: unknown[],
  ) {
    const prisma = getTenantClient(tenantSlug);
    const content: PageContent = { version: 1, blocks: blocks as PageContent['blocks'] };

    await prisma.globalSection.upsert({
      where: { type },
      create: { type, content: jsonInput(content) },
      update: { content: jsonInput(content) },
    });

    const cacheKey = `global-section:${tenantSlug}:${type}`;
    await this.redis.del(cacheKey);
    this.logger.log(
      `Global section saved: ${type} (${blocks.length} blocks, tenant: ${tenantSlug})`,
    );
    return content;
  }

  // ─── Storefront (Public) ──────────────────────────────

  async getPublishedPage(tenantSlug: string, slug: string) {
    const cacheKey = `page:${tenantSlug}:${slug}`;
    const cached = await this.redis.getJson<Record<string, unknown>>(cacheKey);
    if (cached) return cached;

    const prisma = getTenantClient(tenantSlug);
    const page = await prisma.page.findUnique({ where: { slug } });

    if (!page || !page.isPublished) {
      throw new NotFoundException(`Page "${slug}" not found`);
    }

    const result = {
      id: page.id,
      title: page.title,
      slug: page.slug,
      content: page.content,
      seoMeta: page.seoMeta,
      template: page.template,
    };

    await this.redis.setJson(cacheKey, result, 300);
    return result;
  }

  // ─── Helpers ──────────────────────────────────────────

  private generateSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 80);
  }

  private async invalidatePageCache(
    tenantSlug: string,
    slug: string,
  ): Promise<void> {
    await this.redis.del(`page:${tenantSlug}:${slug}`);
  }
}
