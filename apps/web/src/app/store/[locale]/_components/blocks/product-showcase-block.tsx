'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Block } from '@zunapro/types';
import { ProductCard } from '../product-card';
import { useTenantSlug } from '../tenant-context';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const VIEW_ALL_TEXT: Record<string, string> = {
  en: 'View All',
  tr: 'Tümünü Gör',
  de: 'Alle anzeigen',
  fr: 'Voir tout',
  es: 'Ver todo',
};

interface ProductShowcaseProps {
  block: Block;
  locale: string;
}

type Product = {
  id: string;
  name: Record<string, string>;
  slug: string;
  price: string | number;
  compareAtPrice?: string | number | null;
  sku?: string | null;
  stock?: number;
  images: string[];
  status: string;
  isFeatured?: boolean;
  category?: { name: Record<string, string>; slug: string } | null;
};

export function ProductShowcaseBlock({ block, locale }: ProductShowcaseProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const tenantSlug = useTenantSlug();

  const props = block.props as {
    title?: Record<string, string>;
    limit?: number;
    categoryId?: string;
    columns?: number;
    featuredOnly?: boolean;
    showViewAll?: boolean;
    viewAllLink?: string;
  };

  const title = props.title?.[locale] ?? props.title?.en ?? '';
  const limit = props.limit || 10;
  const columns = props.columns || 5;
  const featuredOnly = props.featuredOnly ?? false;
  const showViewAll = props.showViewAll ?? true;
  const viewAllLink = props.viewAllLink ?? '/products';

  useEffect(() => {
    const endpoint = featuredOnly
      ? `${API_URL}/storefront/products/featured?limit=${limit}`
      : `${API_URL}/storefront/products?limit=${limit}&status=active${props.categoryId ? `&categoryId=${props.categoryId}` : ''}`;

    fetch(endpoint, {
      headers: { 'x-tenant-slug': tenantSlug },
    })
      .then((r) => (r.ok ? r.json() : featuredOnly ? [] : { data: [] }))
      .then((res) => {
        const data = Array.isArray(res) ? res : (res.data || []);
        setProducts(data);
      })
      .catch(() => setProducts([]));
  }, [tenantSlug, limit, featuredOnly, props.categoryId]);

  if (products.length === 0) return null;

  const gridCols =
    columns === 3
      ? 'grid-cols-2 sm:grid-cols-3'
      : columns === 4
        ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
        : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5';

  return (
    <section className="mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        {title && (
          <h2
            className="text-2xl font-bold text-[var(--color-foreground)]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {title}
          </h2>
        )}
        {showViewAll && (
          <Link
            href={`/store/${locale}${viewAllLink}`}
            className="text-sm font-medium text-[var(--color-primary)] hover:underline"
          >
            {VIEW_ALL_TEXT[locale] ?? VIEW_ALL_TEXT.en} →
          </Link>
        )}
      </div>

      {/* Product Grid */}
      <div className={`grid ${gridCols} gap-4`}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} locale={locale} />
        ))}
      </div>
    </section>
  );
}
