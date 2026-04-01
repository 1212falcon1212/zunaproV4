'use client';

import Link from 'next/link';
import { AddToCartButton } from '../../_components/add-to-cart-button';
import { useCurrency } from '../../_components/hooks/use-currency';

interface FurnitureProductCardProps {
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

export function FurnitureProductCard({ product, locale }: FurnitureProductCardProps) {
  const { formatPrice } = useCurrency();
  const name = product.name[locale] ?? product.name.en ?? product.slug;
  const price = Number(product.price);
  const image = product.images?.[0];

  // Extract dimensions/materials from variant names
  const materials = product.variants
    ?.map((v) => v.name)
    .filter(Boolean)
    .slice(0, 3);

  return (
    <div className="group overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] transition-shadow hover:shadow-xl">
      <Link href={`/store/${locale}/products/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-[var(--color-muted)]">
        {image ? (
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[var(--color-secondary)]">
            <svg className="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </Link>

      <div className="p-5">
        <Link href={`/store/${locale}/products/${product.slug}`}>
          <h3
            className="text-base font-semibold text-[var(--color-foreground)] line-clamp-1"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {name}
          </h3>
        </Link>

        {/* Material tags */}
        {materials && materials.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {materials.map((mat, i) => (
              <span key={i} className="rounded-full bg-[var(--color-muted)] px-2 py-0.5 text-xs text-[var(--color-secondary)]">
                {mat}
              </span>
            ))}
          </div>
        )}

        <div className="mt-3 flex items-center justify-between">
          <span className="text-xl font-bold text-[var(--color-foreground)]">
            {formatPrice(price)}
          </span>
          <AddToCartButton productId={product.id} compact />
        </div>
      </div>
    </div>
  );
}
