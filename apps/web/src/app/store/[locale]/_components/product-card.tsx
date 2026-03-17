import Link from 'next/link';
import { AddToCartButton } from './add-to-cart-button';

interface ProductCardProps {
  product: {
    id: string;
    name: Record<string, string>;
    slug: string;
    price: string | number;
    compareAtPrice?: string | number | null;
    images: string[];
    status: string;
  };
  locale: string;
}

export function ProductCard({ product, locale }: ProductCardProps) {
  const name = product.name[locale] ?? product.name.en ?? product.slug;
  const price = Number(product.price);
  const compareAt = product.compareAtPrice ? Number(product.compareAtPrice) : null;
  const image = product.images?.[0];
  const hasDiscount = compareAt && compareAt > price;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-background)] transition-shadow hover:shadow-lg">
      {/* Image */}
      <Link href={`/store/${locale}/products/${product.slug}`} className="relative aspect-square overflow-hidden bg-[var(--color-muted)]">
        {image ? (
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[var(--color-secondary)]">
            <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {hasDiscount && (
          <span className="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
            -{Math.round(((compareAt - price) / compareAt) * 100)}%
          </span>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">
        <Link href={`/store/${locale}/products/${product.slug}`}>
          <h3 className="text-sm font-medium text-[var(--color-foreground)] line-clamp-2 hover:text-[var(--color-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
            {name}
          </h3>
        </Link>

        <div className="mt-2 flex items-center gap-2">
          <span className="text-lg font-bold text-[var(--color-foreground)]">
            ${price.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-[var(--color-secondary)] line-through">
              ${compareAt.toFixed(2)}
            </span>
          )}
        </div>

        <div className="mt-auto pt-3">
          <AddToCartButton productId={product.id} compact />
        </div>
      </div>
    </div>
  );
}
