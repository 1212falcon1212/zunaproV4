'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ProductCard } from '../../_components/product-card';
import { useTenantSlug } from '../../_components/tenant-context';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface SubCategory {
  id: string;
  name: Record<string, string>;
  slug: string;
  _count: { products: number };
}

interface Category {
  id: string;
  name: Record<string, string>;
  slug: string;
  image?: string | null;
  description?: Record<string, string> | null;
  seoMeta?: Record<string, { title?: string; description?: string }> | null;
  children?: SubCategory[];
}

interface Product {
  id: string;
  name: Record<string, string>;
  slug: string;
  price: string | number;
  compareAtPrice?: string | number | null;
  sku?: string | null;
  stock?: number;
  images: string[];
  status: string;
}

interface CategoryResponse {
  category: Category;
  priceRange: { min: number; max: number };
  products: {
    data: Product[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  };
}

type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'name_asc';

const LIMIT_OPTIONS = [9, 12, 18, 24] as const;

export default function CategoryDetailPage() {
  const { locale, slug } = useParams<{ locale: string; slug: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations('storefront');
  const tenantSlug = useTenantSlug();

  const [data, setData] = useState<CategoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Filter state
  const [page, setPage] = useState(() => {
    const p = searchParams.get('page');
    return p ? parseInt(p, 10) : 1;
  });
  const [limit, setLimit] = useState(() => {
    const l = searchParams.get('limit');
    return l ? parseInt(l, 10) : 12;
  });
  const [sort, setSort] = useState<SortOption>(() => {
    return (searchParams.get('sort') as SortOption) || 'newest';
  });
  const [minPriceInput, setMinPriceInput] = useState(searchParams.get('minPrice') ?? '');
  const [maxPriceInput, setMaxPriceInput] = useState(searchParams.get('maxPrice') ?? '');
  const [appliedMinPrice, setAppliedMinPrice] = useState(searchParams.get('minPrice') ?? '');
  const [appliedMaxPrice, setAppliedMaxPrice] = useState(searchParams.get('maxPrice') ?? '');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const params: Record<string, string | number | undefined> = {
        page,
        limit,
        sort,
      };
      if (appliedMinPrice) params.minPrice = appliedMinPrice;
      if (appliedMaxPrice) params.maxPrice = appliedMaxPrice;

      const qs = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => { if (v !== undefined) qs.set(k, String(v)); });
      const res = await fetch(`${API_URL}/storefront/categories/${slug}?${qs}`, {
        headers: { 'x-tenant-slug': tenantSlug },
      });
      if (!res.ok) throw new Error('Failed');
      const result = await res.json() as CategoryResponse;
      setData(result);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [slug, page, limit, sort, appliedMinPrice, appliedMaxPrice, tenantSlug]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Sync URL with state
  useEffect(() => {
    const params = new URLSearchParams();
    if (page > 1) params.set('page', String(page));
    if (limit !== 12) params.set('limit', String(limit));
    if (sort !== 'newest') params.set('sort', sort);
    if (appliedMinPrice) params.set('minPrice', appliedMinPrice);
    if (appliedMaxPrice) params.set('maxPrice', appliedMaxPrice);
    const qs = params.toString();
    const newUrl = `/store/${locale}/categories/${slug}${qs ? `?${qs}` : ''}`;
    router.replace(newUrl, { scroll: false });
  }, [page, limit, sort, appliedMinPrice, appliedMaxPrice, locale, slug, router]);

  const handleApplyPriceFilter = () => {
    setAppliedMinPrice(minPriceInput);
    setAppliedMaxPrice(maxPriceInput);
    setPage(1);
  };

  const handleClearPriceFilter = () => {
    setMinPriceInput('');
    setMaxPriceInput('');
    setAppliedMinPrice('');
    setAppliedMaxPrice('');
    setPage(1);
  };

  const handleSortChange = (newSort: SortOption) => {
    setSort(newSort);
    setPage(1);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const categoryName = data?.category
    ? data.category.name[locale] ?? data.category.name.en ?? slug
    : slug;

  const hasPriceFilter = appliedMinPrice || appliedMaxPrice;

  // Grid columns based on limit
  const gridCols =
    limit === 9 || limit === 12
      ? 'grid-cols-2 sm:grid-cols-3'
      : limit === 18
        ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-3'
        : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4';

  // Loading skeleton
  if (loading && !data) {
    return (
      <div className="mx-auto max-w-[1300px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 h-4 w-48 animate-pulse rounded bg-[var(--color-muted)]" />
        <div className="mb-8 h-8 w-64 animate-pulse rounded bg-[var(--color-muted)]" />
        <div className="flex gap-8">
          <div className="hidden w-[280px] shrink-0 lg:block">
            <div className="h-64 animate-pulse rounded-lg bg-[var(--color-muted)]" />
          </div>
          <div className="flex-1">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="h-72 animate-pulse rounded-lg bg-[var(--color-muted)]" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <div className="mx-auto max-w-[1300px] px-4 py-20 text-center sm:px-6 lg:px-8">
        <p className="text-lg text-[var(--color-secondary)]">Category not found.</p>
        <Link
          href={`/store/${locale}`}
          className="mt-4 inline-block text-sm text-[var(--color-primary)] hover:underline"
        >
          {t('header.home')}
        </Link>
      </div>
    );
  }

  const { category, products, priceRange } = data;
  const description = category.description?.[locale] ?? category.description?.en ?? null;

  return (
    <div className="mx-auto max-w-[1300px] px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-[var(--color-secondary)]">
        <Link href={`/store/${locale}`} className="hover:text-[var(--color-primary)]">
          {t('header.home')}
        </Link>
        <span>/</span>
        <Link href={`/store/${locale}/categories`} className="hover:text-[var(--color-primary)]">
          {t('categories')}
        </Link>
        <span>/</span>
        <span className="text-[var(--color-foreground)]">{categoryName}</span>
      </nav>

      {/* Category heading */}
      <h1
        className="mb-8 text-3xl font-bold text-[var(--color-foreground)]"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {categoryName}
      </h1>

      {/* 2-column layout */}
      <div className="flex gap-8">
        {/* Left Sidebar */}
        <aside className="hidden w-[280px] shrink-0 lg:block">
          {/* Subcategories */}
          {category.children && category.children.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--color-foreground)]">
                {t('categories')}
              </h3>
              <ul className="space-y-1">
                {category.children.map((child) => (
                  <li key={child.id}>
                    <Link
                      href={`/store/${locale}/categories/${child.slug}`}
                      className="flex items-center justify-between rounded-[var(--radius)] px-3 py-2 text-sm text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-muted)]"
                    >
                      <span>{child.name[locale] ?? child.name.en ?? child.slug}</span>
                      <span className="text-xs text-[var(--color-secondary)]">
                        ({child._count.products})
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Price range filter */}
          <div className="rounded-lg border border-[var(--color-border)] p-4">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--color-foreground)]">
              {t('products.price') ?? 'Price'}
            </h3>
            {priceRange.max > 0 && (
              <p className="mb-3 text-xs text-[var(--color-secondary)]">
                {priceRange.min.toFixed(2)} - {priceRange.max.toFixed(2)}
              </p>
            )}
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Min"
                value={minPriceInput}
                onChange={(e) => setMinPriceInput(e.target.value)}
                className="w-full rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-foreground)] outline-none focus:border-[var(--color-primary)]"
              />
              <span className="text-[var(--color-secondary)]">-</span>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Max"
                value={maxPriceInput}
                onChange={(e) => setMaxPriceInput(e.target.value)}
                className="w-full rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-foreground)] outline-none focus:border-[var(--color-primary)]"
              />
            </div>
            <button
              type="button"
              onClick={handleApplyPriceFilter}
              className="mt-3 w-full rounded-[var(--radius)] bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              {t('products.filter') ?? 'Filter'}
            </button>
          </div>

          {/* Active filters */}
          {hasPriceFilter && (
            <div className="mt-4">
              <h3 className="mb-2 text-sm font-semibold text-[var(--color-foreground)]">
                {t('products.activeFilters') ?? 'Active Filters'}
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleClearPriceFilter}
                  className="inline-flex items-center gap-1 rounded-full bg-[var(--color-muted)] px-3 py-1 text-xs font-medium text-[var(--color-foreground)]"
                >
                  {appliedMinPrice || '0'} - {appliedMaxPrice || '...'}
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </aside>

        {/* Right Content */}
        <div className="min-w-0 flex-1">
          {/* Toolbar */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3">
            <p className="text-sm text-[var(--color-secondary)]">
              {t('products.showing') ?? 'Showing'}{' '}
              <span className="font-medium text-[var(--color-foreground)]">
                {Math.min((page - 1) * limit + 1, products.meta.total)}-
                {Math.min(page * limit, products.meta.total)}
              </span>{' '}
              {t('products.of') ?? 'of'}{' '}
              <span className="font-medium text-[var(--color-foreground)]">{products.meta.total}</span>{' '}
              {t('products.items')}
            </p>

            <div className="flex items-center gap-4">
              {/* Items per page */}
              <div className="hidden items-center gap-1 sm:flex">
                <span className="mr-1 text-xs text-[var(--color-secondary)]">
                  {t('products.show') ?? 'Show'}:
                </span>
                {LIMIT_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleLimitChange(opt)}
                    className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
                      limit === opt
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'text-[var(--color-secondary)] hover:bg-[var(--color-muted)]'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {/* Sort dropdown */}
              <select
                value={sort}
                onChange={(e) => handleSortChange(e.target.value as SortOption)}
                className="rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-1.5 text-sm text-[var(--color-foreground)] outline-none focus:border-[var(--color-primary)]"
              >
                <option value="newest">{t('products.sortNewest') ?? 'Newest'}</option>
                <option value="price_asc">{t('products.sortPriceLow') ?? 'Price: Low to High'}</option>
                <option value="price_desc">{t('products.sortPriceHigh') ?? 'Price: High to Low'}</option>
                <option value="name_asc">{t('products.sortNameAZ') ?? 'Name: A-Z'}</option>
              </select>
            </div>
          </div>

          {/* Mobile filters (shown below toolbar on small screens) */}
          <div className="mb-6 lg:hidden">
            <details className="rounded-lg border border-[var(--color-border)]">
              <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-[var(--color-foreground)]">
                {t('products.filters') ?? 'Filters'}
                {hasPriceFilter && (
                  <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-primary)] text-[10px] text-white">
                    1
                  </span>
                )}
              </summary>
              <div className="border-t border-[var(--color-border)] p-4">
                {/* Subcategories mobile */}
                {category.children && category.children.length > 0 && (
                  <div className="mb-4">
                    <h3 className="mb-2 text-sm font-semibold text-[var(--color-foreground)]">
                      {t('categories')}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {category.children.map((child) => (
                        <Link
                          key={child.id}
                          href={`/store/${locale}/categories/${child.slug}`}
                          className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-foreground)] hover:bg-[var(--color-muted)]"
                        >
                          {child.name[locale] ?? child.name.en ?? child.slug} ({child._count.products})
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                {/* Price filter mobile */}
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-[var(--color-foreground)]">
                    {t('products.price') ?? 'Price'}
                  </h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Min"
                      value={minPriceInput}
                      onChange={(e) => setMinPriceInput(e.target.value)}
                      className="w-full rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm outline-none"
                    />
                    <span>-</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Max"
                      value={maxPriceInput}
                      onChange={(e) => setMaxPriceInput(e.target.value)}
                      className="w-full rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyPriceFilter}
                    className="mt-2 w-full rounded-[var(--radius)] bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white"
                  >
                    {t('products.filter') ?? 'Filter'}
                  </button>
                  {hasPriceFilter && (
                    <button
                      type="button"
                      onClick={handleClearPriceFilter}
                      className="mt-2 w-full text-center text-xs text-[var(--color-primary)] hover:underline"
                    >
                      {t('products.clearFilters') ?? 'Clear Filters'}
                    </button>
                  )}
                </div>
              </div>
            </details>
          </div>

          {/* Product grid */}
          {loading && data ? (
            <div className={`grid ${gridCols} gap-4 sm:gap-6`}>
              {Array.from({ length: limit }).map((_, i) => (
                <div key={i} className="h-72 animate-pulse rounded-lg bg-[var(--color-muted)]" />
              ))}
            </div>
          ) : products.data.length > 0 ? (
            <div className={`grid ${gridCols} gap-4 sm:gap-6`}>
              {products.data.map((product) => (
                <ProductCard key={product.id} product={product} locale={locale} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <svg className="mx-auto mb-4 h-16 w-16 text-[var(--color-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <p className="text-lg text-[var(--color-secondary)]">{t('noProducts')}</p>
              {hasPriceFilter && (
                <button
                  type="button"
                  onClick={handleClearPriceFilter}
                  className="mt-4 text-sm text-[var(--color-primary)] hover:underline"
                >
                  {t('products.clearFilters') ?? 'Clear Filters'}
                </button>
              )}
            </div>
          )}

          {/* Pagination */}
          {products.meta.totalPages > 1 && (
            <nav className="mt-8 flex items-center justify-center gap-1">
              {page > 1 && (
                <button
                  type="button"
                  onClick={() => setPage(page - 1)}
                  className="rounded-[var(--radius)] px-3 py-2 text-sm text-[var(--color-foreground)] hover:bg-[var(--color-muted)]"
                >
                  {t('products.prev')}
                </button>
              )}
              {Array.from({ length: products.meta.totalPages }, (_, i) => i + 1)
                .filter((p) => {
                  if (products.meta.totalPages <= 7) return true;
                  if (p === 1 || p === products.meta.totalPages) return true;
                  if (Math.abs(p - page) <= 2) return true;
                  return false;
                })
                .reduce<number[]>((acc, p) => {
                  if (acc.length > 0 && p - acc[acc.length - 1] > 1) {
                    acc.push(-acc.length); // sentinel for ellipsis
                  }
                  acc.push(p);
                  return acc;
                }, [])
                .map((p) =>
                  p < 0 ? (
                    <span key={`ellipsis-${p}`} className="px-2 text-sm text-[var(--color-secondary)]">
                      ...
                    </span>
                  ) : (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPage(p)}
                      className={`rounded-[var(--radius)] px-3 py-2 text-sm font-medium ${
                        p === page
                          ? 'bg-[var(--color-primary)] text-white'
                          : 'text-[var(--color-foreground)] hover:bg-[var(--color-muted)]'
                      }`}
                    >
                      {p}
                    </button>
                  ),
                )}
              {page < products.meta.totalPages && (
                <button
                  type="button"
                  onClick={() => setPage(page + 1)}
                  className="rounded-[var(--radius)] px-3 py-2 text-sm text-[var(--color-foreground)] hover:bg-[var(--color-muted)]"
                >
                  {t('products.next')}
                </button>
              )}
            </nav>
          )}
        </div>
      </div>

      {/* Category description for SEO */}
      {description && (
        <section className="mt-12 rounded-lg bg-[var(--color-muted)] p-6">
          <div
            className="prose prose-sm max-w-none text-[var(--color-foreground)]"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </section>
      )}
    </div>
  );
}
