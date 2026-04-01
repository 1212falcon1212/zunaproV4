'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { storeApi } from '@/lib/store-api';
import { VariantSelector } from './variant-selector';
import type { ProductVariantDisplay } from './variant-selector';

interface AddToCartFormProps {
  productId: string;
  productVariants: ProductVariantDisplay[];
  baseStock: number;
  locale: string;
  onVariantChange?: (variant: ProductVariantDisplay | null) => void;
}

export function AddToCartForm({
  productId,
  productVariants,
  baseStock,
  locale,
  onVariantChange,
}: AddToCartFormProps) {
  const t = useTranslations('storefront');
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariantDisplay | null>(null);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const hasVariants = productVariants.length > 0;
  const currentStock = selectedVariant ? selectedVariant.stock : baseStock;
  const isOutOfStock = currentStock <= 0;
  const needsVariantSelection = hasVariants && !selectedVariant;

  const handleVariantSelect = useCallback(
    (variant: ProductVariantDisplay | null) => {
      setSelectedVariant(variant);
      setQuantity(1);
      onVariantChange?.(variant);
    },
    [onVariantChange],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isOutOfStock || needsVariantSelection) return;

    setLoading(true);
    try {
      await storeApi.post('/cart/items', {
        productId,
        variantId: selectedVariant?.id,
        quantity,
      });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch {
      // Error handling delegated to global interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
      {/* Variant selector */}
      {hasVariants && (
        <VariantSelector
          variants={productVariants}
          locale={locale}
          onVariantSelect={handleVariantSelect}
          selectedVariant={selectedVariant}
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
            onChange={(e) =>
              setQuantity(Math.max(1, Math.min(currentStock, parseInt(e.target.value) || 1)))
            }
            className="h-10 w-16 rounded-[var(--radius)] border border-[var(--color-border)] text-center text-sm"
          />
          <button
            type="button"
            onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
            className="flex h-10 w-10 items-center justify-center rounded-[var(--radius)] border border-[var(--color-border)] text-lg hover:bg-[var(--color-muted)]"
          >
            +
          </button>
          {currentStock > 0 && currentStock <= 5 && (
            <span className="text-xs text-amber-600">
              {t('product.onlyLeft', { count: currentStock })}
            </span>
          )}
        </div>
      </div>

      {/* Add to cart button */}
      <button
        type="submit"
        disabled={loading || isOutOfStock || needsVariantSelection}
        className="flex w-full items-center justify-center gap-2 rounded-[var(--radius)] bg-[var(--color-primary)] px-6 py-3 text-base font-semibold text-white transition-colors hover:opacity-90 disabled:opacity-50"
      >
        {loading ? (
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : isOutOfStock ? (
          t('product.outOfStock')
        ) : needsVariantSelection ? (
          t('product.selectVariant')
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
              />
            </svg>
            {t('addToCart')}
          </>
        )}
      </button>

      {/* Selected variant SKU */}
      {selectedVariant?.sku && (
        <p className="text-xs text-[var(--color-secondary)]">
          SKU: {selectedVariant.sku}
        </p>
      )}
    </form>
  );
}
