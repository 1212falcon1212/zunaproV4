'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { storeApi } from '@/lib/store-api';

interface AddToCartButtonProps {
  productId: string;
  variantId?: string;
  quantity?: number;
  className?: string;
  compact?: boolean;
}

export function AddToCartButton({
  productId,
  variantId,
  quantity = 1,
  className = '',
  compact = false,
}: AddToCartButtonProps) {
  const t = useTranslations('storefront');
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await storeApi.post('/cart/items', { productId, variantId, quantity });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch {
      // Error handled silently — cart badge will not update
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`inline-flex items-center justify-center rounded-[var(--radius)] bg-[var(--color-primary)] font-medium text-white transition-colors hover:opacity-90 disabled:opacity-50 ${
        compact ? 'gap-1 px-3 py-1.5 text-xs' : 'gap-2 px-4 py-2 text-sm'
      } ${className}`}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
      ) : added ? (
        <>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {!compact && t('product.added')}
        </>
      ) : (
        <>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
          {!compact && t('addToCart')}
        </>
      )}
    </button>
  );
}
