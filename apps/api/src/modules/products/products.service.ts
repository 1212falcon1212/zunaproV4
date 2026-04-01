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
import type { ProductVariantDto, ProductAttributeDto } from './dto/create-product.dto';

interface FindAllOptions {
  page?: number;
  limit?: number;
  status?: string;
  categoryId?: string;
  search?: string;
}

const PRODUCT_INCLUDE = {
  category: { select: { id: true, name: true, slug: true } },
  productVariants: {
    orderBy: { sortOrder: 'asc' as const },
    include: {
      optionValues: {
        include: {
          variantOption: {
            include: {
              variantType: true,
            },
          },
        },
      },
    },
  },
  productAttributes: {
    orderBy: { name: 'asc' as const },
  },
};

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
        include: PRODUCT_INCLUDE,
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
      include: PRODUCT_INCLUDE,
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
        brand: dto.brand ?? null,
        vatRate: dto.vatRate ?? 20,
        productMainId: dto.productMainId ?? null,
        seoMeta: (dto.seoMeta as object) ?? undefined,
        status: dto.status ?? 'draft',
      },
      include: PRODUCT_INCLUDE,
    });

    if (dto.productVariants?.length) {
      await this.createVariants(prisma, product.id, dto.productVariants);
    }

    if (dto.attributes?.length) {
      await this.createAttributes(prisma, product.id, dto.attributes);
    }

    const result =
      dto.productVariants?.length || dto.attributes?.length
        ? await prisma.product.findUnique({
            where: { id: product.id },
            include: PRODUCT_INCLUDE,
          })
        : product;

    this.logger.log(`Product created: ${slug} (tenant: ${tenantSlug})`);
    if (result) this.searchService.syncProduct(tenantSlug, result);
    return result;
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
    if (dto.brand !== undefined) data.brand = dto.brand;
    if (dto.vatRate !== undefined) data.vatRate = dto.vatRate;
    if (dto.productMainId !== undefined) data.productMainId = dto.productMainId;
    if (dto.seoMeta !== undefined) data.seoMeta = dto.seoMeta as object;
    if (dto.status) data.status = dto.status;
    if (dto.isFeatured !== undefined) data.isFeatured = dto.isFeatured;

    await prisma.product.update({
      where: { id },
      data: data as Parameters<typeof prisma.product.update>[0]['data'],
    });

    if (dto.productVariants !== undefined) {
      await prisma.productVariantOptionValue.deleteMany({
        where: { productVariant: { productId: id } },
      });
      await prisma.productVariant.deleteMany({ where: { productId: id } });

      if (dto.productVariants.length) {
        await this.createVariants(prisma, id, dto.productVariants);
      }
    }

    if (dto.attributes !== undefined) {
      await prisma.productAttribute.deleteMany({ where: { productId: id } });

      if (dto.attributes.length) {
        await this.createAttributes(prisma, id, dto.attributes);
      }
    }

    const updated = await prisma.product.findUnique({
      where: { id },
      include: PRODUCT_INCLUDE,
    });

    this.logger.log(`Product updated: ${updated!.slug} (tenant: ${tenantSlug})`);
    if (updated) this.searchService.syncProduct(tenantSlug, updated);
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

  async addAttribute(
    tenantSlug: string,
    productId: string,
    data: { name: string; value: string },
  ) {
    const prisma = getTenantClient(tenantSlug);

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const attribute = await prisma.productAttribute.upsert({
      where: { productId_name: { productId, name: data.name } },
      update: { value: data.value },
      create: { productId, name: data.name, value: data.value },
    });

    this.logger.log(
      `Attribute '${data.name}' added to product ${productId} (tenant: ${tenantSlug})`,
    );
    return attribute;
  }

  async removeAttribute(tenantSlug: string, productId: string, name: string) {
    const prisma = getTenantClient(tenantSlug);

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const attribute = await prisma.productAttribute.findUnique({
      where: { productId_name: { productId, name } },
    });
    if (!attribute) {
      throw new NotFoundException(
        `Attribute '${name}' not found on product ${productId}`,
      );
    }

    await prisma.productAttribute.delete({
      where: { productId_name: { productId, name } },
    });

    this.logger.log(
      `Attribute '${name}' removed from product ${productId} (tenant: ${tenantSlug})`,
    );
    return { deleted: true, productId, name };
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
          brand: dto.brand ?? null,
          vatRate: dto.vatRate ?? 20,
          productMainId: dto.productMainId ?? null,
          seoMeta: (dto.seoMeta as object) ?? undefined,
          status: dto.status ?? 'draft',
        },
      });

      if (dto.productVariants?.length) {
        await this.createVariants(prisma, product.id, dto.productVariants);
      }

      if (dto.attributes?.length) {
        await this.createAttributes(prisma, product.id, dto.attributes);
      }

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
      include: {
        ...PRODUCT_INCLUDE,
      },
      orderBy: { createdAt: 'desc' },
    });

    return products.map((p) => ({
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: Number(p.price),
      compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
      sku: p.sku,
      brand: p.brand,
      vatRate: p.vatRate,
      productMainId: p.productMainId,
      stock: p.stock,
      images: p.images,
      variants: p.variants,
      categorySlug: p.category?.slug ?? null,
      status: p.status,
      productVariants: p.productVariants.map((v) => ({
        sku: v.sku,
        barcode: v.barcode,
        price: Number(v.price),
        listPrice: v.listPrice ? Number(v.listPrice) : null,
        stock: v.stock,
        weight: v.weight ? Number(v.weight) : null,
        images: v.images,
        isActive: v.isActive,
        options: v.optionValues.map((ov) => ({
          variantTypeSlug: ov.variantOption.variantType.slug,
          variantOptionSlug: ov.variantOption.slug,
        })),
      })),
      productAttributes: p.productAttributes.map((a) => ({
        name: a.name,
        value: a.value,
      })),
      createdAt: p.createdAt,
    }));
  }

  private async createVariants(
    prisma: ReturnType<typeof getTenantClient>,
    productId: string,
    variants: ProductVariantDto[],
  ) {
    for (let i = 0; i < variants.length; i++) {
      const v = variants[i];

      const productVariant = await prisma.productVariant.create({
        data: {
          productId,
          sku: v.sku ?? null,
          barcode: v.barcode ?? null,
          price: v.price,
          listPrice: v.listPrice ?? null,
          stock: v.stock ?? 0,
          weight: v.weight ?? null,
          images: (v.images ?? []) as string[],
          isActive: v.isActive ?? true,
          sortOrder: i,
        },
      });

      for (const optRef of v.options) {
        const variantType = await prisma.variantType.findUnique({
          where: { slug: optRef.variantTypeSlug },
        });
        if (!variantType) {
          throw new BadRequestException(
            `VariantType with slug '${optRef.variantTypeSlug}' not found`,
          );
        }

        const variantOption = await prisma.variantOption.findUnique({
          where: {
            variantTypeId_slug: {
              variantTypeId: variantType.id,
              slug: optRef.variantOptionSlug,
            },
          },
        });
        if (!variantOption) {
          throw new BadRequestException(
            `VariantOption with slug '${optRef.variantOptionSlug}' not found for type '${optRef.variantTypeSlug}'`,
          );
        }

        await prisma.productVariantOptionValue.create({
          data: {
            productVariantId: productVariant.id,
            variantOptionId: variantOption.id,
          },
        });
      }
    }
  }

  private async createAttributes(
    prisma: ReturnType<typeof getTenantClient>,
    productId: string,
    attributes: ProductAttributeDto[],
  ) {
    for (const attr of attributes) {
      await prisma.productAttribute.upsert({
        where: { productId_name: { productId, name: attr.name } },
        update: { value: attr.value },
        create: { productId, name: attr.name, value: attr.value },
      });
    }
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
