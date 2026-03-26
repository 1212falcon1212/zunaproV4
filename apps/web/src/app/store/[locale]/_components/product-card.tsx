'use client';

import Link from 'next/link';
import { AddToCartButton } from './add-to-cart-button';

interface ProductCardProps {
  product: {
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
  locale: string;
}

function StarRating({ rating = 4.5 }: { rating?: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`h-3.5 w-3.5 ${i < fullStars ? 'text-amber-400' : i === fullStars && hasHalf ? 'text-amber-400' : 'text-gray-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function ProductCard({ product, locale }: ProductCardProps) {
  const name = product.name[locale] ?? product.name.en ?? product.slug;
  const price = Number(product.price);
  const compareAt = product.compareAtPrice ? Number(product.compareAtPrice) : null;
  const image = product.images?.[0];
  const hasDiscount = compareAt && compareAt > price;
  const discountPercent = hasDiscount ? Math.round(((compareAt - price) / compareAt) * 100) : 0;
  const categoryName = product.category?.name?.[locale] ?? product.category?.name?.['en'] ?? null;
  const inStock = (product.stock ?? 0) > 0;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-[var(--color-border)] bg-white transition-shadow hover:shadow-lg">
      {/* Badges */}
      <div className="absolute left-2.5 top-2.5 z-10 flex flex-col gap-1.5">
        {hasDiscount && (
          <span className="rounded bg-[var(--color-primary)] px-2 py-0.5 text-[11px] font-bold text-white">
            -{discountPercent}%
          </span>
        )}
        {product.isFeatured && (
          <span className="rounded bg-red-500 px-2 py-0.5 text-[11px] font-bold text-white">
            HOT
          </span>
        )}
      </div>

      {/* Image */}
      <Link href={`/store/${locale}/products/${product.slug}`} className="relative aspect-square overflow-hidden bg-[var(--color-muted)]">
        {image ? (
          <img
            src={image}
            alt={name}
            className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[var(--color-secondary)]">
            <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
        <Link href={`/store/${locale}/products/${product.slug}`}>
          <h3 className="text-sm font-medium leading-snug text-[var(--color-foreground)] line-clamp-2 hover:text-[var(--color-primary)]">
            {name}
          </h3>
        </Link>

        {categoryName && (
          <p className="mt-0.5 text-xs text-[var(--color-secondary)]">{categoryName}</p>
        )}

        <div className="mt-1.5">
          <StarRating />
        </div>

        <div className="mt-1.5 flex items-center gap-1">
          {inStock ? (
            <>
              <svg className="h-3.5 w-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-xs font-medium text-green-600">In stock</span>
            </>
          ) : (
            <span className="text-xs font-medium text-red-500">Out of stock</span>
          )}
        </div>

        {/* Price */}
        <div className="mt-2 flex items-baseline gap-2">
          {hasDiscount && (
            <span className="text-sm text-[var(--color-secondary)] line-through">
              ${compareAt.toFixed(2)}
            </span>
          )}
          <span className={`text-base font-bold ${hasDiscount ? 'text-[var(--color-primary)]' : 'text-[var(--color-foreground)]'}`}>
            ${price.toFixed(2)}
          </span>
        </div>

        {/* Add to Cart */}
        <div className="mt-3">
          <AddToCartButton productId={product.id} compact />
        </div>

        {/* SKU */}
        {product.sku && (
          <p className="mt-2 text-[10px] text-[var(--color-secondary)]">SKU: {product.sku}</p>
        )}
      </div>
    </div>
  );
}
