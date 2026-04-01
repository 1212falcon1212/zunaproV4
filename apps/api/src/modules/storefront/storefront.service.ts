import { Injectable, NotFoundException } from '@nestjs/common';
import { getTenantClient } from '@zunapro/db';
import type { ThemeConfig } from '@zunapro/types';

const BASE_THEME: ThemeConfig = {
  primary: '#2563eb',
  secondary: '#64748b',
  accent: '#f59e0b',
  background: '#ffffff',
  foreground: '#0f172a',
  muted: '#f1f5f9',
  border: '#e2e8f0',
  fonts: { heading: 'Inter', body: 'Inter' },
  borderRadius: 'md',
  layout: { headerStyle: 'standard', productGridColumns: 4, footerColumns: 4 },
};

interface FindProductsOptions {
  page?: number;
  limit?: number;
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: string;
}

@Injectable()
export class StorefrontService {
  async findProducts(tenantSlug: string, options: FindProductsOptions = {}) {
    const {
      page = 1,
      limit = 20,
      categorySlug,
      minPrice,
      maxPrice,
      search,
      sort = 'newest',
    } = options;
    const prisma = getTenantClient(tenantSlug);
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { status: 'active' };

    if (categorySlug) {
      const category = await prisma.category.findUnique({
        where: { slug: categorySlug },
        include: { children: { select: { id: true } } },
      });
      if (category) {
        // Include products from this category AND all child categories
        const childIds = (category.children ?? []).map((c: { id: string }) => c.id);
        if (childIds.length > 0) {
          where.categoryId = { in: [category.id, ...childIds] };
        } else {
          where.categoryId = category.id;
        }
      }
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      const priceFilter: Record<string, number> = {};
      if (minPrice !== undefined) priceFilter.gte = minPrice;
      if (maxPrice !== undefined) priceFilter.lte = maxPrice;
      where.price = priceFilter;
    }

    if (search) {
      where.OR = [
        { slug: { contains: search.toLowerCase() } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }

    let orderBy: Record<string, string>;
    switch (sort) {
      case 'price_asc':
        orderBy = { price: 'asc' };
        break;
      case 'price_desc':
        orderBy = { price: 'desc' };
        break;
      case 'name_asc':
        orderBy = { slug: 'asc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          category: { select: { id: true, name: true, slug: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      data: products,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findProductBySlug(tenantSlug: string, slug: string) {
    const prisma = getTenantClient(tenantSlug);

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        productVariants: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
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
      },
    });

    if (!product || product.status !== 'active') {
      throw new NotFoundException('Product not found');
    }

    return {
      ...product,
      productVariants: product.productVariants.map((v) => ({
        id: v.id,
        sku: v.sku,
        barcode: v.barcode,
        price: Number(v.price),
        listPrice: v.listPrice ? Number(v.listPrice) : null,
        stock: v.stock,
        images: v.images as string[],
        isActive: v.isActive,
        optionValues: v.optionValues.map((ov) => ({
          variantOption: {
            slug: ov.variantOption.slug,
            name: ov.variantOption.name as Record<string, string>,
            colorCode: (ov.variantOption as Record<string, unknown>).colorCode as string | undefined,
            variantType: {
              slug: ov.variantOption.variantType.slug,
              name: ov.variantOption.variantType.name as Record<string, string>,
            },
          },
        })),
      })),
    };
  }

  async getThemeConfig(tenantSlug: string): Promise<ThemeConfig> {
    const prisma = getTenantClient(tenantSlug);
    const setting = await prisma.setting.findUnique({ where: { key: 'theme' } });
    if (!setting) return BASE_THEME;
    return { ...BASE_THEME, ...(setting.value as unknown as Partial<ThemeConfig>) };
  }

  async getStoreInfo(tenantSlug: string): Promise<Record<string, unknown>> {
    const prisma = getTenantClient(tenantSlug);
    const setting = await prisma.setting.findUnique({ where: { key: 'store_info' } });
    if (!setting) {
      return {
        store_name: {},
        store_phone: '',
        store_email: '',
        header_messages: [],
      };
    }
    return setting.value as unknown as Record<string, unknown>;
  }

  async getActiveThemeId(tenantSlug: string): Promise<{ themeId: string | null }> {
    const prisma = getTenantClient(tenantSlug);
    const setting = await prisma.setting.findUnique({ where: { key: 'active_theme_id' } });
    if (!setting) return { themeId: null };
    const val = setting.value as unknown;
    // Handle both { value: "themeId" } and raw string formats
    if (typeof val === 'object' && val !== null && 'value' in val) {
      return { themeId: (val as { value: string }).value };
    }
    return { themeId: typeof val === 'string' ? val : null };
  }

  async findFeaturedProducts(tenantSlug: string, limit = 10) {
    const prisma = getTenantClient(tenantSlug);
    return prisma.product.findMany({
      where: { status: 'active', isFeatured: true },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        category: { select: { id: true, name: true, slug: true } },
      },
    });
  }

  async findFeaturedCategories(tenantSlug: string) {
    const prisma = getTenantClient(tenantSlug);
    return prisma.category.findMany({
      where: { isFeatured: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: { select: { products: { where: { status: 'active' } } } },
      },
    });
  }

  async findCategories(tenantSlug: string) {
    const prisma = getTenantClient(tenantSlug);

    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: { select: { products: { where: { status: 'active' } } } },
        children: {
          orderBy: { sortOrder: 'asc' },
          include: {
            _count: { select: { products: { where: { status: 'active' } } } },
          },
        },
      },
      where: { parentId: null },
    });

    return categories;
  }

  async findMenuByLocation(tenantSlug: string, location: string) {
    const prisma = getTenantClient(tenantSlug);
    const menu = await prisma.menu.findFirst({
      where: { location, isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
    if (!menu) {
      throw new NotFoundException(`No active menu found for location "${location}"`);
    }
    return { items: menu.items, name: menu.name, slug: menu.slug };
  }

  async findRecentBlogPosts(tenantSlug: string, limit = 4) {
    const prisma = getTenantClient(tenantSlug);
    return prisma.blogPost.findMany({
      where: { status: 'published' },
      take: limit,
      orderBy: { publishedAt: 'desc' },
    });
  }

  async findBlogPosts(
    tenantSlug: string,
    options: { page?: number; limit?: number } = {},
  ) {
    const { page = 1, limit = 12 } = options;
    const prisma = getTenantClient(tenantSlug);
    const skip = (page - 1) * limit;

    const where = { status: 'published' };

    const [data, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        skip,
        take: limit,
        orderBy: { publishedAt: 'desc' },
      }),
      prisma.blogPost.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findBlogPostBySlug(tenantSlug: string, slug: string) {
    const prisma = getTenantClient(tenantSlug);
    const post = await prisma.blogPost.findUnique({ where: { slug } });

    if (!post || post.status !== 'published') {
      throw new NotFoundException('Blog post not found');
    }

    return post;
  }

  async findCategoryBySlug(
    tenantSlug: string,
    slug: string,
    page = 1,
    limit = 20,
    sort?: string,
    minPrice?: number,
    maxPrice?: number,
  ) {
    const prisma = getTenantClient(tenantSlug);

    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        children: {
          orderBy: { sortOrder: 'asc' },
          include: {
            _count: { select: { products: { where: { status: 'active' } } } },
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Include products from this category AND all child categories
    const childIds = (category.children ?? []).map((c: { id: string }) => c.id);
    const categoryIds = childIds.length > 0 ? [category.id, ...childIds] : [category.id];

    const where: Record<string, unknown> = {
      categoryId: { in: categoryIds },
      status: 'active',
    };

    if (minPrice !== undefined || maxPrice !== undefined) {
      const priceFilter: Record<string, number> = {};
      if (minPrice !== undefined) priceFilter.gte = minPrice;
      if (maxPrice !== undefined) priceFilter.lte = maxPrice;
      where.price = priceFilter;
    }

    let orderBy: Record<string, string>;
    switch (sort) {
      case 'price_asc':
        orderBy = { price: 'asc' };
        break;
      case 'price_desc':
        orderBy = { price: 'desc' };
        break;
      case 'name_asc':
        orderBy = { slug: 'asc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }

    const skip = (page - 1) * limit;
    const [products, total, priceAgg] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
      }),
      prisma.product.count({ where }),
      prisma.product.aggregate({
        where: { categoryId: category.id, status: 'active' },
        _min: { price: true },
        _max: { price: true },
      }),
    ]);

    return {
      category,
      priceRange: {
        min: priceAgg._min.price ? Number(priceAgg._min.price) : 0,
        max: priceAgg._max.price ? Number(priceAgg._max.price) : 0,
      },
      products: {
        data: products,
        meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      },
    };
  }
}
