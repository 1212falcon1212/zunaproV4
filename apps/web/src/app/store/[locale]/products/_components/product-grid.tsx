'use client';

import { ProductCard } from '../../_components/product-card';
import { useCurrency } from '../../_components/hooks/use-currency';

interface Product {
  id: string;
  name: Record<string, string>;
  slug: string;
  price: string;
  compareAtPrice?: string | null;
  images: string[];
  status: string;
}

interface ProductGridProps {
  products: Product[];
  locale: string;
  viewMode?: 'grid' | 'list';
}

export function ProductGrid({ products, locale, viewMode = 'grid' }: ProductGridProps) {
  const { formatPrice } = useCurrency();

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <svg className="h-16 w-16 text-[var(--color-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <p className="mt-4 text-lg font-medium text-[var(--color-foreground)]">No products found</p>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="flex flex-col gap-4">
        {products.map((product) => (
          <div key={product.id} className="flex gap-4 rounded-[var(--radius)] border border-[var(--color-border)] p-4">
            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-[var(--radius)] bg-[var(--color-muted)]">
              {product.images?.[0] && (
                <img src={product.images[0]} alt="" className="h-full w-full object-cover" loading="lazy" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-[var(--color-foreground)]">
                {product.name[locale] ?? product.name.en ?? product.slug}
              </h3>
              <p className="mt-1 text-lg font-bold">{formatPrice(product.price)}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} locale={locale} />
      ))}
    </div>
  );
}
