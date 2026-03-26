import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { getTenantClient } from '@zunapro/db';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';

@Injectable()
export class BlogService {
  private readonly logger = new Logger(BlogService.name);

  private generateSlug(title: Record<string, string>): string {
    const source = title.en || title.tr || Object.values(title)[0] || 'post';
    return source
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  async findAll(
    tenantSlug: string,
    options: { page?: number; limit?: number; status?: string } = {},
  ) {
    const { page = 1, limit = 20, status } = options;
    const prisma = getTenantClient(tenantSlug);
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (status) {
      where.status = status;
    }

    const [data, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.blogPost.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findById(tenantSlug: string, id: string) {
    const prisma = getTenantClient(tenantSlug);
    const post = await prisma.blogPost.findUnique({ where: { id } });

    if (!post) {
      throw new NotFoundException(`Blog post with ID ${id} not found`);
    }

    return post;
  }

  async create(tenantSlug: string, dto: CreateBlogPostDto) {
    const prisma = getTenantClient(tenantSlug);
    const slug = dto.slug || this.generateSlug(dto.title);

    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (existing) {
      throw new ConflictException(`Blog post slug '${slug}' already exists`);
    }

    const post = await prisma.blogPost.create({
      data: {
        title: JSON.parse(JSON.stringify(dto.title)),
        slug,
        excerpt: dto.excerpt ? JSON.parse(JSON.stringify(dto.excerpt)) : undefined,
        content: dto.content ? JSON.parse(JSON.stringify(dto.content)) : undefined,
        featuredImage: dto.featuredImage ?? null,
        author: dto.author ?? null,
        category: dto.category ?? null,
        tags: dto.tags ? JSON.parse(JSON.stringify(dto.tags)) : [],
        status: dto.status ?? 'draft',
        publishedAt: dto.status === 'published' ? new Date() : null,
      },
    });

    this.logger.log(`Blog post created: ${slug} (tenant: ${tenantSlug})`);
    return post;
  }

  async update(tenantSlug: string, id: string, dto: UpdateBlogPostDto) {
    const prisma = getTenantClient(tenantSlug);

    const post = await prisma.blogPost.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException(`Blog post with ID ${id} not found`);
    }

    if (dto.slug && dto.slug !== post.slug) {
      const existing = await prisma.blogPost.findUnique({
        where: { slug: dto.slug },
      });
      if (existing) {
        throw new ConflictException(`Blog post slug '${dto.slug}' already exists`);
      }
    }

    const data: Record<string, unknown> = {};
    if (dto.title) data.title = JSON.parse(JSON.stringify(dto.title));
    if (dto.slug) data.slug = dto.slug;
    if (dto.excerpt !== undefined) data.excerpt = dto.excerpt ? JSON.parse(JSON.stringify(dto.excerpt)) : null;
    if (dto.content !== undefined) data.content = dto.content ? JSON.parse(JSON.stringify(dto.content)) : null;
    if (dto.featuredImage !== undefined) data.featuredImage = dto.featuredImage;
    if (dto.author !== undefined) data.author = dto.author;
    if (dto.category !== undefined) data.category = dto.category;
    if (dto.tags !== undefined) data.tags = JSON.parse(JSON.stringify(dto.tags));
    if (dto.status !== undefined) {
      data.status = dto.status;
      if (dto.status === 'published' && post.status !== 'published') {
        data.publishedAt = new Date();
      }
    }

    const updated = await prisma.blogPost.update({
      where: { id },
      data: data as Parameters<typeof prisma.blogPost.update>[0]['data'],
    });

    this.logger.log(`Blog post updated: ${updated.slug} (tenant: ${tenantSlug})`);
    return updated;
  }

  async remove(tenantSlug: string, id: string) {
    const prisma = getTenantClient(tenantSlug);

    const post = await prisma.blogPost.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException(`Blog post with ID ${id} not found`);
    }

    await prisma.blogPost.delete({ where: { id } });

    this.logger.log(`Blog post deleted: ${post.slug} (tenant: ${tenantSlug})`);
    return { deleted: true };
  }
}
