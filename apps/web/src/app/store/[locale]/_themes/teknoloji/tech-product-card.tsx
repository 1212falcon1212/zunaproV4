'use client';

import Link from 'next/link';
import { AddToCartButton } from '../../_components/add-to-cart-button';
import { useCurrency } from '../../_components/hooks/use-currency';

interface TechProductCardProps {
  product: {
    id: string;
    name: Record<string, string>;
    slug: string;
    price: string | number;
    compareAtPrice?: string | number | null;
    images: string[];
    variants: { name: string }[];
  };
  locale: string;
}

export function TechProductCard({ product, locale }: TechProductCardProps) {
  const { formatPrice } = useCurrency();
  const name = product.name[locale] ?? product.name.en ?? product.slug;
  const price = Number(product.price);
  const image = product.images?.[0];

  // Extract spec badges from variants
  const badges = product.variants?.map((v) => v.name).filter(Boolean).slice(0, 3) ?? [];

  return (
    <div className="group overflow-hidden rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-background)] transition-all hover:border-[var(--color-primary)] hover:shadow-lg hover:shadow-[var(--color-primary)]/10">
      <Link href={`/store/${locale}/products/${product.slug}`} className="relative block aspect-square overflow-hidden bg-[var(--color-muted)]">
        {image ? (
          <img
            src={image}
            alt={name}
            className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[var(--color-secondary)]">
            <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </Link>

      <div className="p-4">
        <Link href={`/store/${locale}/products/${product.slug}`}>
          <h3 className="text-sm font-semibold text-[var(--color-foreground)] line-clamp-2" style={{ fontFamily: 'var(--font-heading)' }}>
            {name}
          </h3>
        </Link>

        {/* Spec badges */}
        {badges.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {badges.map((badge, i) => (
              <span
                key={i}
                className="rounded-sm border border-[var(--color-border)] bg-[var(--color-muted)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--color-accent)]"
              >
                {badge}
              </span>
            ))}
          </div>
        )}

        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-[var(--color-primary)]">
            {formatPrice(price)}
          </span>
          <AddToCartButton productId={product.id} compact />
        </div>
      </div>
    </div>
  );
}
