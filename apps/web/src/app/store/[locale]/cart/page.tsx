'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { storeApi } from '@/lib/store-api';
import { isCustomerAuthenticated } from '@/lib/store-api';
import { CartItems } from './_components/cart-items';

interface Cart {
  items: Array<{
    productId: string;
    name: Record<string, string>;
    slug: string;
    price: number;
    quantity: number;
    image?: string;
    variantName?: string;
  }>;
  updatedAt: string;
}

export default function CartPage() {
  const t = useTranslations('storefront');
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = useCallback(async () => {
    try {
      const data = await storeApi.get<Cart>('/storefront/cart');
      setCart(data);
    } catch {
      setCart({ items: [], updatedAt: new Date().toISOString() });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) return;
    try {
      const data = await storeApi.patch<Cart>(
        `/storefront/cart/items/${productId}`,
        { quantity },
        false,
      );
      setCart(data);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update quantity');
    }
  };

  const handleRemove = async (productId: string) => {
    try {
      const data = await storeApi.delete<Cart>(
        `/storefront/cart/items/${productId}`,
      );
      setCart(data);
    } catch {
      fetchCart();
    }
  };

  const handleCheckout = () => {
    if (!isCustomerAuthenticated()) {
      router.push(`/store/${locale}/auth/login?redirect=/store/${locale}/checkout`);
      return;
    }
    router.push(`/store/${locale}/checkout`);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">{t('cart')}</h1>

      <CartItems
        items={cart?.items ?? []}
        locale={locale}
        onUpdateQuantity={handleUpdateQuantity}
        onRemove={handleRemove}
      />

      {cart && cart.items.length > 0 && (
        <div className="mt-6 flex justify-end gap-4">
          <Link
            href={`/store/${locale}`}
            className="rounded-lg border border-gray-200 px-6 py-3 text-sm font-medium hover:bg-gray-50"
          >
            {t('continueShopping')}
          </Link>
          <button
            onClick={handleCheckout}
            className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
          >
            {t('proceedToCheckout')}
          </button>
        </div>
      )}
    </div>
  );
}
