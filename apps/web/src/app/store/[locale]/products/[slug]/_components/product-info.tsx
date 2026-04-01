'use client';

import { useTranslations } from 'next-intl';
import { useCurrency } from '../../../_components/hooks/use-currency';
import type { ProductVariantDisplay } from './variant-selector';

interface ProductInfoProps {
  product: {
    name: Record<string, string>;
    price: string | number;
    compareAtPrice?: string | number | null;
    description?: Record<string, string> | null;
    sku?: string | null;
    stock: number;
  };
  locale: string;
  selectedVariant?: ProductVariantDisplay | null;
}

export function ProductInfo({ product, locale, selectedVariant }: ProductInfoProps) {
  const t = useTranslations('storefront');
  const { formatPrice } = useCurrency();

  const name = product.name[locale] ?? product.name.en ?? '';
  const description = product.description?.[locale] ?? product.description?.en ?? '';

  // Use variant price/stock when a variant is selected
  const price = selectedVariant ? selectedVariant.price : Number(product.price);
  const compareAt = selectedVariant?.listPrice
    ? selectedVariant.listPrice
    : product.compareAtPrice
      ? Number(product.compareAtPrice)
      : null;
  const hasDiscount = compareAt !== null && compareAt > price;
  const stock = selectedVariant ? selectedVariant.stock : product.stock;
  const inStock = stock > 0;
  const displaySku = selectedVariant?.sku ?? product.sku;

  return (
    <div>
      <h1
        className="text-2xl font-bold text-[var(--color-foreground)] sm:text-3xl"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {name}
      </h1>

      {/* Price */}
      <div className="mt-4 flex items-baseline gap-3">
        <span className="text-3xl font-bold text-[var(--color-foreground)]">{formatPrice(price)}</span>
        {hasDiscount && compareAt !== null && (
          <>
            <span className="text-lg text-[var(--color-secondary)] line-through">{formatPrice(compareAt)}</span>
            <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
              -{Math.round(((compareAt - price) / compareAt) * 100)}%
            </span>
          </>
        )}
      </div>

      {/* Stock status */}
      <div className="mt-3">
        {inStock ? (
          <span className="inline-flex items-center gap-1 text-sm font-medium text-green-600">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            {t('product.inStock')}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-sm font-medium text-red-600">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            {t('product.outOfStock')}
          </span>
        )}
      </div>

      {/* SKU */}
      {displaySku && (
        <p className="mt-2 text-sm text-[var(--color-secondary)]">
          SKU: {displaySku}
        </p>
      )}

      {/* Description */}
      {description && (
        <div className="mt-6 border-t border-[var(--color-border)] pt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-secondary)]">
            {t('product.description')}
          </h2>
          <div
            className="prose prose-sm mt-3 max-w-none text-[var(--color-foreground)]"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
      )}
    </div>
  );
}
