import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { getTenantClient } from '@zunapro/db';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ReorderCategoriesDto } from './dto/reorder-categories.dto';

const MAX_DEPTH = 3;

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  private generateSlug(name: Record<string, string>): string {
    const source = name.en || name.tr || Object.values(name)[0] || 'category';
    return source
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  private buildTree(
    categories: Array<{
      id: string;
      name: unknown;
      slug: string;
      image: string | null;
      parentId: string | null;
      sortOrder: number;
      seoMeta: unknown;
      _count: { products: number };
      children?: unknown[];
    }>,
    parentId: string | null = null,
    depth = 0,
  ): unknown[] {
    return categories
      .filter((c) => c.parentId === parentId)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((category) => {
        const children = depth < MAX_DEPTH
          ? this.buildTree(categories, category.id, depth + 1)
          : [];
        // Sum up child product counts for parent categories
        const childProductCount = (children as Array<{ productCount: number }>)
          .reduce((sum, child) => sum + (child.productCount || 0), 0);
        return {
          ...category,
          productCount: category._count.products + childProductCount,
          _count: undefined,
          children,
        };
      });
  }

  async findAll(tenantSlug: string) {
    const prisma = getTenantClient(tenantSlug);

    const categories = await prisma.category.findMany({
      include: {
        _count: { select: { products: true } },
      },
      orderBy: { sortOrder: 'asc' },
    });

    return this.buildTree(categories);
  }

  async findOne(tenantSlug: string, id: string) {
    const prisma = getTenantClient(tenantSlug);

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        children: {
          include: { _count: { select: { products: true } } },
          orderBy: { sortOrder: 'asc' },
        },
        _count: { select: { products: true } },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return {
      ...category,
      productCount: category._count.products,
    };
  }

  async create(tenantSlug: string, dto: CreateCategoryDto) {
    const prisma = getTenantClient(tenantSlug);

    const slug = dto.slug || this.generateSlug(dto.name);

    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      throw new ConflictException(`Category slug '${slug}' already exists`);
    }

    if (dto.parentId) {
      const depth = await this.getCategoryDepth(prisma, dto.parentId);
      if (depth >= MAX_DEPTH - 1) {
        throw new BadRequestException(
          `Maximum category depth of ${MAX_DEPTH} levels exceeded`,
        );
      }

      const parent = await prisma.category.findUnique({
        where: { id: dto.parentId },
      });
      if (!parent) {
        throw new NotFoundException(
          `Parent category with ID ${dto.parentId} not found`,
        );
      }
    }

    const category = await prisma.category.create({
      data: {
        name: dto.name,
        slug,
        image: dto.image,
        parentId: dto.parentId,
        sortOrder: dto.sortOrder ?? 0,
        isFeatured: dto.isFeatured ?? false,
        description: dto.description ? JSON.parse(JSON.stringify(dto.description)) : null,
        seoMeta: dto.seoMeta as object ?? undefined,
      },
    });

    this.logger.log(`Category created: ${slug} (tenant: ${tenantSlug})`);
    return category;
  }

  async update(tenantSlug: string, id: string, dto: UpdateCategoryDto) {
    const prisma = getTenantClient(tenantSlug);

    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    if (dto.slug && dto.slug !== category.slug) {
      const existing = await prisma.category.findUnique({
        where: { slug: dto.slug },
      });
      if (existing) {
        throw new ConflictException(`Category slug '${dto.slug}' already exists`);
      }
    }

    if (dto.parentId !== undefined && dto.parentId !== category.parentId) {
      if (dto.parentId === id) {
        throw new BadRequestException('A category cannot be its own parent');
      }

      if (dto.parentId) {
        const depth = await this.getCategoryDepth(prisma, dto.parentId);
        if (depth >= MAX_DEPTH - 1) {
          throw new BadRequestException(
            `Maximum category depth of ${MAX_DEPTH} levels exceeded`,
          );
        }
      }
    }

    const data: Record<string, unknown> = {};
    if (dto.name) data.name = dto.name;
    if (dto.slug) data.slug = dto.slug;
    if (dto.image !== undefined) data.image = dto.image;
    if (dto.parentId !== undefined) {
      data.parent = dto.parentId
        ? { connect: { id: dto.parentId } }
        : { disconnect: true };
    }
    if (dto.sortOrder !== undefined) data.sortOrder = dto.sortOrder;
    if (dto.isFeatured !== undefined) data.isFeatured = dto.isFeatured;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.seoMeta !== undefined) data.seoMeta = dto.seoMeta as object;

    const updated = await prisma.category.update({
      where: { id },
      data: data as Parameters<typeof prisma.category.update>[0]['data'],
    });

    this.logger.log(`Category updated: ${updated.slug} (tenant: ${tenantSlug})`);
    return updated;
  }

  async remove(tenantSlug: string, id: string) {
    const prisma = getTenantClient(tenantSlug);

    const category = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true, children: true } } },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    if (category._count.products > 0) {
      throw new ConflictException(
        `Cannot delete category with ${category._count.products} products. Move or delete products first.`,
      );
    }

    if (category._count.children > 0) {
      throw new ConflictException(
        `Cannot delete category with ${category._count.children} subcategories. Delete subcategories first.`,
      );
    }

    await prisma.category.delete({ where: { id } });

    this.logger.log(`Category deleted: ${category.slug} (tenant: ${tenantSlug})`);
    return { deleted: true };
  }

  async reorder(tenantSlug: string, dto: ReorderCategoriesDto) {
    const prisma = getTenantClient(tenantSlug);

    const updates = dto.items.map((item) =>
      prisma.category.update({
        where: { id: item.id },
        data: { sortOrder: item.sortOrder },
      }),
    );

    await prisma.$transaction(updates);

    this.logger.log(
      `Categories reordered: ${dto.items.length} items (tenant: ${tenantSlug})`,
    );
    return { reordered: dto.items.length };
  }

  private async getCategoryDepth(
    prisma: ReturnType<typeof getTenantClient>,
    categoryId: string,
  ): Promise<number> {
    let depth = 0;
    let currentId: string | null = categoryId;

    while (currentId) {
      const found: { parentId: string | null } | null =
        await prisma.category.findUnique({
          where: { id: currentId },
          select: { parentId: true },
        });
      if (!found || !found.parentId) break;
      currentId = found.parentId;
      depth++;
    }

    return depth;
  }
}
