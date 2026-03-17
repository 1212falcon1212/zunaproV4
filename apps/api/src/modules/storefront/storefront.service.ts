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
      });
      if (category) {
        where.categoryId = category.id;
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
      },
    });

    if (!product || product.status !== 'active') {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async getThemeConfig(tenantSlug: string): Promise<ThemeConfig> {
    const prisma = getTenantClient(tenantSlug);
    const setting = await prisma.setting.findUnique({ where: { key: 'theme' } });
    if (!setting) return BASE_THEME;
    return { ...BASE_THEME, ...(setting.value as unknown as Partial<ThemeConfig>) };
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

  async findCategoryBySlug(tenantSlug: string, slug: string, page = 1, limit = 20) {
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

    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: { categoryId: category.id, status: 'active' },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({
        where: { categoryId: category.id, status: 'active' },
      }),
    ]);

    return {
      category,
      products: {
        data: products,
        meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      },
    };
  }
}
