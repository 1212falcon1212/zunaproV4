'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Block } from '@zunapro/types';
import { useTenantSlug } from '../tenant-context';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface Category {
  id: string;
  name: Record<string, string>;
  slug: string;
  image?: string | null;
  productCount?: number;
}

interface CategoryListingBlockProps {
  block: Block;
  locale: string;
}

export function CategoryListingBlock({ block, locale }: CategoryListingBlockProps) {
  const props = block.props as {
    title?: Record<string, string>;
    columns?: 3 | 4;
    showProductCount?: boolean;
    layout?: 'grid' | 'list';
  };

  const title = props.title?.[locale] ?? props.title?.en ?? '';
  const columns = props.columns || 4;
  const showProductCount = props.showProductCount ?? true;
  const layout = props.layout || 'grid';

  const tenantSlug = useTenantSlug();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/storefront/categories`, {
          headers: { 'x-tenant-slug': tenantSlug },
        });
        if (!res.ok) throw new Error('Failed to fetch categories');
        const data: Category[] = await res.json();
        setCategories(data);
      } catch {
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

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

      {/* Loading skeleton */}
      {loading && (
        <div className={layout === 'grid' ? `grid ${gridCols} gap-4` : 'space-y-3'}>
          {Array.from({ length: 8 }).map((_, i) =>
            layout === 'grid' ? (
              <div
                key={i}
                className="animate-pulse overflow-hidden rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-card)]"
              >
                <div className="aspect-square bg-[var(--color-muted)]" />
                <div className="p-4">
                  <div className="mb-2 h-4 w-3/4 rounded bg-[var(--color-muted)]" />
                  {showProductCount && (
                    <div className="h-3 w-1/3 rounded bg-[var(--color-muted)]" />
                  )}
                </div>
              </div>
            ) : (
              <div
                key={i}
                className="flex animate-pulse items-center gap-4 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-card)] p-4"
              >
                <div className="h-16 w-16 shrink-0 rounded-[var(--radius)] bg-[var(--color-muted)]" />
                <div className="flex-1">
                  <div className="mb-2 h-4 w-1/3 rounded bg-[var(--color-muted)]" />
                  {showProductCount && (
                    <div className="h-3 w-1/4 rounded bg-[var(--color-muted)]" />
                  )}
                </div>
              </div>
            ),
          )}
        </div>
      )}

      {/* Empty state */}
      {!loading && categories.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-[var(--radius)] border border-dashed border-[var(--color-border)] bg-[var(--color-card)] py-16 text-center">
          <p className="text-lg font-medium text-[var(--color-foreground)]">No categories found</p>
          <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
            Categories will appear here once they are created.
          </p>
        </div>
      )}

      {/* Grid layout */}
      {!loading && categories.length > 0 && layout === 'grid' && (
        <div className={`grid ${gridCols} gap-4`}>
          {categories.map((category) => {
            const name = category.name[locale] ?? category.name.en ?? category.slug;
            return (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group overflow-hidden rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-card)] transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-square overflow-hidden bg-[var(--color-muted)]">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)]">
                      <span className="text-3xl font-bold text-white opacity-40">
                        {name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3
                      className="text-lg font-semibold text-white"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {name}
                    </h3>
                    {showProductCount && category.productCount !== undefined && (
                      <p className="mt-0.5 text-sm text-white/80">
                        {category.productCount} product{category.productCount !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* List layout */}
      {!loading && categories.length > 0 && layout === 'list' && (
        <div className="space-y-3">
          {categories.map((category) => {
            const name = category.name[locale] ?? category.name.en ?? category.slug;
            return (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group flex items-center gap-4 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-card)] p-4 transition-shadow hover:shadow-md"
              >
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-[var(--radius)] bg-[var(--color-muted)]">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)]">
                      <span className="text-xl font-bold text-white opacity-40">
                        {name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3
                    className="text-base font-semibold text-[var(--color-foreground)] group-hover:text-[var(--color-primary)]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {name}
                  </h3>
                  {showProductCount && category.productCount !== undefined && (
                    <p className="mt-0.5 text-sm text-[var(--color-muted-foreground)]">
                      {category.productCount} product{category.productCount !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
