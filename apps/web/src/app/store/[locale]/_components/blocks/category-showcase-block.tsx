'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Block } from '@zunapro/types';

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
}

export function CategoryShowcaseBlock({
  block,
  locale,
}: CategoryShowcaseProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  const props = block.props as {
    title?: Record<string, string>;
    limit?: number;
    columns?: number;
    categoryIds?: string[];
  };

  const title = props.title?.[locale] ?? props.title?.en ?? '';
  const columns = props.columns || 4;

  useEffect(() => {
    fetch(`${API_URL}/storefront/categories`)
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
  }, []);

  if (categories.length === 0) return null;

  const gridCols =
    columns === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : columns === 3
        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4';

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
      <div className={`grid ${gridCols} gap-4`}>
        {categories.map((category) => {
          const name =
            category.name[locale] ?? category.name.en ?? category.slug;
          return (
            <Link
              key={category.id}
              href={`/store/${locale}/categories/${category.slug}`}
              className="group relative aspect-square overflow-hidden rounded-[var(--radius)] bg-[var(--color-muted)]"
            >
              {category.image && (
                <img
                  src={category.image}
                  alt={name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3
                  className="text-lg font-semibold text-white"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {name}
                </h3>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
