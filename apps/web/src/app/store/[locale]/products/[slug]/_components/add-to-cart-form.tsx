'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { storeApi } from '@/lib/store-api';
import { VariantSelector } from './variant-selector';

interface Variant {
  name: string;
  sku?: string;
  price?: number;
  stock?: number;
}

interface AddToCartFormProps {
  productId: string;
  variants: Variant[];
  stock: number;
}

export function AddToCartForm({ productId, variants, stock }: AddToCartFormProps) {
  const t = useTranslations('storefront');
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const currentStock = variants.length > 0
    ? (variants[selectedVariant]?.stock ?? stock)
    : stock;

  const isOutOfStock = currentStock <= 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isOutOfStock) return;

    setLoading(true);
    try {
      await storeApi.post('/cart/items', {
        productId,
        variantId: variants.length > 0 ? String(selectedVariant) : undefined,
        quantity,
      });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch {
      // Silently handled
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      {variants.length > 0 && (
        <VariantSelector
          variants={variants}
          selectedIndex={selectedVariant}
          onSelect={setSelectedVariant}
        />
      )}

      {/* Quantity */}
      <div>
        <label className="text-sm font-medium text-[var(--color-foreground)]">
          {t('product.quantity')}
        </label>
        <div className="mt-1 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="flex h-10 w-10 items-center justify-center rounded-[var(--radius)] border border-[var(--color-border)] text-lg hover:bg-[var(--color-muted)]"
          >
            -
          </button>
          <input
            type="number"
            min={1}
            max={currentStock}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Math.min(currentStock, parseInt(e.target.value) || 1)))}
            className="h-10 w-16 rounded-[var(--radius)] border border-[var(--color-border)] text-center text-sm"
          />
          <button
            type="button"
            onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
            className="flex h-10 w-10 items-center justify-center rounded-[var(--radius)] border border-[var(--color-border)] text-lg hover:bg-[var(--color-muted)]"
          >
            +
          </button>
        </div>
      </div>

      {/* Add to cart button */}
      <button
        type="submit"
        disabled={loading || isOutOfStock}
        className="flex w-full items-center justify-center gap-2 rounded-[var(--radius)] bg-[var(--color-primary)] px-6 py-3 text-base font-semibold text-white transition-colors hover:opacity-90 disabled:opacity-50"
      >
        {loading ? (
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : isOutOfStock ? (
          t('product.outOfStock')
        ) : added ? (
          <>
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {t('product.added')}
          </>
        ) : (
          <>
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            {t('addToCart')}
          </>
        )}
      </button>
    </form>
  );
}
