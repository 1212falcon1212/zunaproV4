import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { getTenantClient, masterPrisma } from '@zunapro/db';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { SearchService } from '../search/search.service';

interface FindAllOptions {
  page?: number;
  limit?: number;
  status?: string;
  categoryId?: string;
  search?: string;
}

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(private readonly searchService: SearchService) {}

  private generateSlug(name: Record<string, string>): string {
    const source = name.en || name.tr || Object.values(name)[0] || 'product';
    return source
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  async findAll(tenantSlug: string, options: FindAllOptions = {}) {
    const { page = 1, limit = 20, status, categoryId, search } = options;
    const prisma = getTenantClient(tenantSlug);
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (categoryId) where.categoryId = categoryId;
    if (search) {
      where.OR = [
        { slug: { contains: search.toLowerCase() } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { category: { select: { id: true, name: true, slug: true } } },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(tenantSlug: string, id: string) {
    const prisma = getTenantClient(tenantSlug);

    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: { select: { id: true, name: true, slug: true } } },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async create(tenantSlug: string, tenantPlanId: string, dto: CreateProductDto) {
    const prisma = getTenantClient(tenantSlug);

    await this.checkProductLimit(prisma, tenantPlanId);

    let slug = dto.slug || this.generateSlug(dto.name);
    slug = await this.ensureUniqueSlug(prisma, slug);

    if (dto.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: dto.categoryId },
      });
      if (!category) {
        throw new NotFoundException(
          `Category with ID ${dto.categoryId} not found`,
        );
      }
    }

    const product = await prisma.product.create({
      data: {
        name: dto.name,
        slug,
        description: dto.description,
        price: dto.price,
        compareAtPrice: dto.compareAtPrice,
        sku: dto.sku,
        stock: dto.stock ?? 0,
        images: (dto.images ?? []) as string[],
        variants: (dto.variants ?? []) as object[],
        categoryId: dto.categoryId,
        seoMeta: (dto.seoMeta as object) ?? undefined,
        status: dto.status ?? 'draft',
      },
      include: { category: { select: { id: true, name: true, slug: true } } },
    });

    this.logger.log(`Product created: ${slug} (tenant: ${tenantSlug})`);
    this.searchService.syncProduct(tenantSlug, product);
    return product;
  }

  async update(tenantSlug: string, id: string, dto: UpdateProductDto) {
    const prisma = getTenantClient(tenantSlug);

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    if (dto.slug && dto.slug !== product.slug) {
      const existing = await prisma.product.findUnique({
        where: { slug: dto.slug },
      });
      if (existing) {
        throw new ConflictException(`Product slug '${dto.slug}' already exists`);
      }
    }

    if (dto.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: dto.categoryId },
      });
      if (!category) {
        throw new NotFoundException(
          `Category with ID ${dto.categoryId} not found`,
        );
      }
    }

    const data: Record<string, unknown> = {};
    if (dto.name) data.name = dto.name;
    if (dto.slug) data.slug = dto.slug;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.price !== undefined) data.price = dto.price;
    if (dto.compareAtPrice !== undefined) data.compareAtPrice = dto.compareAtPrice;
    if (dto.sku !== undefined) data.sku = dto.sku;
    if (dto.stock !== undefined) data.stock = dto.stock;
    if (dto.images !== undefined) data.images = dto.images as string[];
    if (dto.variants !== undefined) data.variants = dto.variants as object[];
    if (dto.categoryId !== undefined) {
      data.category = dto.categoryId
        ? { connect: { id: dto.categoryId } }
        : { disconnect: true };
    }
    if (dto.seoMeta !== undefined) data.seoMeta = dto.seoMeta as object;
    if (dto.status) data.status = dto.status;

    const updated = await prisma.product.update({
      where: { id },
      data: data as Parameters<typeof prisma.product.update>[0]['data'],
      include: { category: { select: { id: true, name: true, slug: true } } },
    });

    this.logger.log(`Product updated: ${updated.slug} (tenant: ${tenantSlug})`);
    this.searchService.syncProduct(tenantSlug, updated);
    return updated;
  }

  async remove(tenantSlug: string, id: string) {
    const prisma = getTenantClient(tenantSlug);

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Delete related marketplace listings first
    await prisma.marketplaceListing.deleteMany({ where: { productId: id } });

    await prisma.product.delete({ where: { id } });

    this.logger.log(`Product deleted: ${product.slug} (tenant: ${tenantSlug})`);
    this.searchService.removeProduct(tenantSlug, id);
    return { deleted: true, id };
  }

  async bulkImport(
    tenantSlug: string,
    tenantPlanId: string,
    products: CreateProductDto[],
  ) {
    const prisma = getTenantClient(tenantSlug);

    const currentCount = await prisma.product.count();
    const plan = await masterPrisma.plan.findUnique({
      where: { id: tenantPlanId },
    });
    const maxProducts =
      (plan?.features as Record<string, unknown>)?.maxProducts ?? Infinity;

    if (currentCount + products.length > (maxProducts as number)) {
      throw new BadRequestException(
        `Import would exceed product limit. Current: ${currentCount}, Importing: ${products.length}, Limit: ${maxProducts}`,
      );
    }

    const results = [];
    for (const dto of products) {
      let slug = dto.slug || this.generateSlug(dto.name);
      slug = await this.ensureUniqueSlug(prisma, slug);

      const product = await prisma.product.create({
        data: {
          name: dto.name,
          slug,
          description: dto.description,
          price: dto.price,
          compareAtPrice: dto.compareAtPrice,
          sku: dto.sku,
          stock: dto.stock ?? 0,
          images: (dto.images ?? []) as string[],
          variants: (dto.variants ?? []) as object[],
          categoryId: dto.categoryId,
          seoMeta: (dto.seoMeta as object) ?? undefined,
          status: dto.status ?? 'draft',
        },
      });
      results.push(product);
    }

    this.logger.log(
      `Bulk import: ${results.length} products (tenant: ${tenantSlug})`,
    );
    return { imported: results.length, products: results };
  }

  async exportAll(tenantSlug: string) {
    const prisma = getTenantClient(tenantSlug);

    const products = await prisma.product.findMany({
      include: { category: { select: { name: true, slug: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return products.map((p) => ({
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: Number(p.price),
      compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
      sku: p.sku,
      stock: p.stock,
      images: p.images,
      variants: p.variants,
      categorySlug: p.category?.slug ?? null,
      status: p.status,
      createdAt: p.createdAt,
    }));
  }

  private async checkProductLimit(
    prisma: ReturnType<typeof getTenantClient>,
    planId: string,
  ) {
    const plan = await masterPrisma.plan.findUnique({ where: { id: planId } });
    if (!plan) return;

    const features = plan.features as Record<string, unknown>;
    const maxProducts = features?.maxProducts as number | undefined;
    if (!maxProducts) return;

    const currentCount = await prisma.product.count();
    if (currentCount >= maxProducts) {
      throw new BadRequestException(
        `Product limit reached (${maxProducts}). Upgrade your plan to add more products.`,
      );
    }
  }

  private async ensureUniqueSlug(
    prisma: ReturnType<typeof getTenantClient>,
    slug: string,
  ): Promise<string> {
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (!existing) return slug;

    let counter = 1;
    let newSlug = `${slug}-${counter}`;
    while (await prisma.product.findUnique({ where: { slug: newSlug } })) {
      counter++;
      newSlug = `${slug}-${counter}`;
    }
    return newSlug;
  }
}
