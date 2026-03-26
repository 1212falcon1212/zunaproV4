'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import type { Block } from '@zunapro/types';
import { useTenantSlug } from '../tenant-context';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface Product {
  id: string;
  name: Record<string, string>;
  slug: string;
  price: string | number;
  compareAtPrice?: string | number | null;
  images: string[];
  status: string;
}

interface ProductsResponse {
  data: Product[];
  total: number;
}

interface Category {
  id: string;
  name: Record<string, string>;
  slug: string;
}

interface ProductListingBlockProps {
  block: Block;
  locale: string;
}

export function ProductListingBlock({ block, locale }: ProductListingBlockProps) {
  const props = block.props as {
    title?: Record<string, string>;
    columns?: 3 | 4;
    productsPerPage?: 12 | 24 | 48;
    showFilters?: boolean;
    showSearch?: boolean;
  };

  const title = props.title?.[locale] ?? props.title?.en ?? '';
  const columns = props.columns || 4;
  const productsPerPage = props.productsPerPage || 12;
  const showFilters = props.showFilters ?? true;
  const showSearch = props.showSearch ?? true;

  const tenantSlug = useTenantSlug();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sort, setSort] = useState('newest');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: String(productsPerPage),
        offset: String(page * productsPerPage),
        status: 'active',
      });
      if (search) params.set('search', search);
      if (categoryFilter) params.set('categoryId', categoryFilter);
      if (sort) params.set('sort', sort);
      if (priceMin) params.set('priceMin', priceMin);
      if (priceMax) params.set('priceMax', priceMax);

      const res = await fetch(`${API_URL}/storefront/products?${params.toString()}`, {
        headers: { 'x-tenant-slug': tenantSlug },
      });
      if (!res.ok) throw new Error('Failed to fetch products');
      const data: ProductsResponse = await res.json();
      setProducts(data.data ?? []);
      setTotal(data.total ?? 0);
    } catch {
      setProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, productsPerPage, search, categoryFilter, sort, priceMin, priceMax]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/storefront/categories`, {
          headers: { 'x-tenant-slug': tenantSlug },
        });
        if (!res.ok) return;
        const data: Category[] = await res.json();
        setCategories(data);
      } catch {
        /* ignore */
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const totalPages = Math.ceil(total / productsPerPage);

  const gridCols =
    columns === 3
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {title && (
        <h2
          className="mb-6 text-2xl font-bold text-[var(--color-foreground)]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {title}
        </h2>
      )}

      {/* Filter bar and search */}
      {(showFilters || showSearch) && (
        <div className="mb-6 flex flex-wrap items-end gap-4">
          {showSearch && (
            <div className="w-full sm:w-64">
              <label className="mb-1 block text-sm font-medium text-[var(--color-foreground)]">
                Search
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(0);
                }}
                placeholder="Search products..."
                className="w-full rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
              />
            </div>
          )}

          {showFilters && (
            <>
              <div className="w-full sm:w-48">
                <label className="mb-1 block text-sm font-medium text-[var(--color-foreground)]">
                  Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    setPage(0);
                  }}
                  className="w-full rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-foreground)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name[locale] ?? cat.name.en ?? cat.slug}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full sm:w-48">
                <label className="mb-1 block text-sm font-medium text-[var(--color-foreground)]">
                  Sort
                </label>
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value);
                    setPage(0);
                  }}
                  className="w-full rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-foreground)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                >
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name">Name</option>
                </select>
              </div>

              <div className="flex items-end gap-2">
                <div className="w-24">
                  <label className="mb-1 block text-sm font-medium text-[var(--color-foreground)]">
                    Min Price
                  </label>
                  <input
                    type="number"
                    value={priceMin}
                    onChange={(e) => {
                      setPriceMin(e.target.value);
                      setPage(0);
                    }}
                    placeholder="0"
                    min="0"
                    className="w-full rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                  />
                </div>
                <div className="w-24">
                  <label className="mb-1 block text-sm font-medium text-[var(--color-foreground)]">
                    Max Price
                  </label>
                  <input
                    type="number"
                    value={priceMax}
                    onChange={(e) => {
                      setPriceMax(e.target.value);
                      setPage(0);
                    }}
                    placeholder="999"
                    min="0"
                    className="w-full rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className={`grid ${gridCols} gap-6`}>
          {Array.from({ length: productsPerPage > 8 ? 8 : productsPerPage }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-card)] p-4"
            >
              <div className="mb-3 aspect-square rounded-[var(--radius)] bg-[var(--color-muted)]" />
              <div className="mb-2 h-4 w-3/4 rounded bg-[var(--color-muted)]" />
              <div className="h-4 w-1/2 rounded bg-[var(--color-muted)]" />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && products.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-[var(--radius)] border border-dashed border-[var(--color-border)] bg-[var(--color-card)] py-16 text-center">
          <p className="text-lg font-medium text-[var(--color-foreground)]">No products found</p>
          <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
            Try adjusting your filters or search terms.
          </p>
        </div>
      )}

      {/* Product grid */}
      {!loading && products.length > 0 && (
        <div className={`grid ${gridCols} gap-6`}>
          {products.map((product) => {
            const name = product.name[locale] ?? product.name.en ?? product.slug;
            const price =
              typeof product.price === 'number'
                ? product.price.toFixed(2)
                : product.price;

            return (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group overflow-hidden rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-card)] transition-shadow hover:shadow-md"
              >
                <div className="aspect-square overflow-hidden bg-[var(--color-muted)]">
                  {product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-[var(--color-muted-foreground)]">
                      No image
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3
                    className="mb-1 text-sm font-medium text-[var(--color-foreground)] line-clamp-2"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-[var(--color-primary)]">
                      ${price}
                    </span>
                    {product.compareAtPrice && (
                      <span className="text-sm text-[var(--color-muted-foreground)] line-through">
                        $
                        {typeof product.compareAtPrice === 'number'
                          ? product.compareAtPrice.toFixed(2)
                          : product.compareAtPrice}
                      </span>
                    )}
                  </div>
                  <span className="mt-2 inline-block text-sm font-medium text-[var(--color-primary)] group-hover:underline">
                    View
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-2 text-sm font-medium text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-muted)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-[var(--color-muted-foreground)]">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-2 text-sm font-medium text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-muted)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}
