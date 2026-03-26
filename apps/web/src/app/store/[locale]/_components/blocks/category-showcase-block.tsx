'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import type { Block } from '@zunapro/types';
import { useTenantSlug } from '../tenant-context';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface CategoryShowcaseProps {
  block: Block;
  locale: string;
}

interface Category {
  id: string;
  name: Record<string, string>;
  slug: string;
  image?: string | null;
  isFeatured?: boolean;
  _count?: { products: number };
}

export function CategoryShowcaseBlock({ block, locale }: CategoryShowcaseProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const tenantSlug = useTenantSlug();
  const scrollRef = useRef<HTMLDivElement>(null);

  const props = block.props as {
    title?: Record<string, string>;
    limit?: number;
    columns?: number;
    categoryIds?: string[];
    layout?: 'grid' | 'carousel';
    featuredOnly?: boolean;
  };

  const title = props.title?.[locale] ?? props.title?.en ?? '';
  const layout = props.layout ?? 'carousel';
  const featuredOnly = props.featuredOnly ?? true;
  const columns = props.columns || 4;

  useEffect(() => {
    const endpoint = featuredOnly ? '/storefront/categories/featured' : '/storefront/categories';
    fetch(`${API_URL}${endpoint}`, {
      headers: { 'x-tenant-slug': tenantSlug },
    })
      .then((r) => (r.ok ? r.json() : []))
      .then((data: Category[]) => {
        let filtered = data;
        if (props.categoryIds && props.categoryIds.length > 0) {
          filtered = filtered.filter((c) => props.categoryIds!.includes(c.id));
        }
        if (props.limit) {
          filtered = filtered.slice(0, props.limit);
        }
        setCategories(filtered);
      })
      .catch(() => setCategories([]));
  }, [tenantSlug, featuredOnly, props.categoryIds, props.limit]);

  if (categories.length === 0) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 300;
    scrollRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  // Carousel layout (WoodMart style) — circular images
  if (layout === 'carousel') {
    return (
      <section className="mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-8">
        {title && (
          <h2 className="mb-6 text-center text-2xl font-bold text-[var(--color-foreground)]" style={{ fontFamily: 'var(--font-heading)' }}>
            {title}
          </h2>
        )}
        <div className="relative">
          {/* Scroll buttons */}
          <button
            onClick={() => scroll('left')}
            className="absolute -left-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white p-2 shadow-md transition-colors hover:bg-gray-50 lg:flex"
          >
            <svg className="h-4 w-4 text-[var(--color-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scroll('right')}
            className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white p-2 shadow-md transition-colors hover:bg-gray-50 lg:flex"
          >
            <svg className="h-4 w-4 text-[var(--color-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div
            ref={scrollRef}
            className="flex justify-center gap-6 overflow-x-auto pb-2 scrollbar-none lg:gap-8"
            style={{ scrollbarWidth: 'none' }}
          >
            {categories.map((category) => {
              const name = category.name[locale] ?? category.name.en ?? category.slug;
              return (
                <Link
                  key={category.id}
                  href={`/store/${locale}/categories/${category.slug}`}
                  className="group flex shrink-0 flex-col items-center gap-3"
                >
                  <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-transparent bg-[var(--color-muted)] transition-all group-hover:border-[var(--color-primary)] group-hover:shadow-lg lg:h-28 lg:w-28">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-[var(--color-secondary)]">
                        {name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <span className="max-w-[100px] text-center text-xs font-medium text-[var(--color-foreground)] lg:max-w-[120px] lg:text-sm">
                    {name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // Grid layout (original)
  const gridCols =
    columns === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : columns === 3
        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4';

  return (
    <section className="mx-auto max-w-[1300px] px-4 py-8 sm:px-6 lg:px-8">
      {title && (
        <h2 className="mb-6 text-2xl font-bold text-[var(--color-foreground)]" style={{ fontFamily: 'var(--font-heading)' }}>
          {title}
        </h2>
      )}
      <div className={`grid ${gridCols} gap-4`}>
        {categories.map((category) => {
          const name = category.name[locale] ?? category.name.en ?? category.slug;
          return (
            <Link
              key={category.id}
              href={`/store/${locale}/categories/${category.slug}`}
              className="group relative aspect-square overflow-hidden rounded-[var(--radius)] bg-[var(--color-muted)]"
            >
              {category.image && (
                <img src={category.image} alt={name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-heading)' }}>{name}</h3>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
