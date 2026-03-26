'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Block } from '@zunapro/types';
import { ProductCard } from '../product-card';
import { useTenantSlug } from '../tenant-context';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

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

interface CategoryProductsBlockProps {
  block: Block;
  locale: string;
}

export function CategoryProductsBlock({ block, locale }: CategoryProductsBlockProps) {
  const props = block.props as {
    title?: Record<string, string>;
    categorySlug?: string;
    limit?: number;
    showSideBanner?: boolean;
    sideBanner?: {
      image?: string;
      title?: Record<string, string>;
      subtitle?: Record<string, string>;
      buttonText?: Record<string, string>;
      buttonLink?: string;
      backgroundColor?: string;
    };
  };

  const title = props.title?.[locale] ?? props.title?.en ?? '';
  const categorySlug = props.categorySlug ?? '';
  const limit = props.limit ?? 4;
  const showSideBanner = props.showSideBanner ?? true;
  const sideBanner = props.sideBanner;

  const tenantSlug = useTenantSlug();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categorySlug) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(
      `${API_URL}/storefront/products?category=${encodeURIComponent(categorySlug)}&limit=${limit}`,
      { headers: { 'x-tenant-slug': tenantSlug } },
    )
      .then((r) => (r.ok ? r.json() : { data: [] }))
      .then((res) => {
        const data = Array.isArray(res) ? res : (res.data ?? []);
        setProducts(data);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [tenantSlug, categorySlug, limit]);

  const bannerTitle = sideBanner?.title?.[locale] ?? sideBanner?.title?.en ?? '';
  const bannerSubtitle = sideBanner?.subtitle?.[locale] ?? sideBanner?.subtitle?.en ?? '';
  const bannerButtonText = sideBanner?.buttonText?.[locale] ?? sideBanner?.buttonText?.en ?? '';
  const bannerLink = resolveStoreLink(sideBanner?.buttonLink ?? '#', locale);
  const bannerBg = sideBanner?.backgroundColor ?? '#1a1a2e';

  if (loading) {
    return (
      <section className="mx-auto max-w-[1300px] px-4 py-8 sm:px-6 lg:px-8">
        {title && (
          <div className="mb-6 flex items-center justify-between">
            <h2
              className="text-2xl font-bold text-[var(--color-foreground)]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {title}
            </h2>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: limit > 8 ? 8 : limit }).map((_, i) => (
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
      </section>
    );
  }

  if (!categorySlug) {
    return (
      <section className="mx-auto max-w-[1300px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center rounded-[var(--radius)] border border-dashed border-[var(--color-border)] bg-[var(--color-card)] py-12 text-center">
          <p className="text-sm text-[var(--color-muted-foreground)]">
            No category selected. Configure a category slug in block settings.
          </p>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-[1300px] px-4 py-8 sm:px-6 lg:px-8">
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
        <Link
          href={`/store/${locale}/categories/${encodeURIComponent(categorySlug)}`}
          className="text-sm font-medium text-[var(--color-primary)] hover:underline"
        >
          More Products &gt;
        </Link>
      </div>

      {/* Content */}
      {showSideBanner && sideBanner ? (
        <div className="flex gap-4">
          {/* Side banner — fixed width */}
          <div
            className="hidden shrink-0 flex-col items-start justify-end overflow-hidden rounded-lg p-6 lg:flex"
            style={{
              backgroundColor: bannerBg,
              backgroundImage: sideBanner.image ? `url(${sideBanner.image})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              width: '260px',
              minHeight: '400px',
            }}
          >
            {bannerTitle && (
              <h3 className="mb-1 text-lg font-bold text-white drop-shadow-md" style={{ fontFamily: 'var(--font-heading)' }}>
                {bannerTitle}
              </h3>
            )}
            {bannerSubtitle && (
              <p className="mb-3 text-xs text-white/80 drop-shadow-sm">{bannerSubtitle}</p>
            )}
            {bannerButtonText && (
              <Link
                href={bannerLink}
                className="inline-flex items-center rounded-md bg-white px-4 py-2 text-xs font-semibold text-[var(--color-foreground)] shadow-sm hover:bg-gray-100"
              >
                {bannerButtonText}
              </Link>
            )}
          </div>

          {/* 4 products in one row */}
          <div className="grid flex-1 grid-cols-2 gap-4 md:grid-cols-4">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} locale={locale} />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} />
          ))}
        </div>
      )}
    </section>
  );
}

function resolveStoreLink(link: string, locale: string): string {
  if (!link || link.startsWith('http') || link.startsWith('#')) return link || '#';
  const normalized = link.startsWith('/') ? link : `/${link}`;
  return `/store/${locale}${normalized === '/' ? '' : normalized}`;
}
