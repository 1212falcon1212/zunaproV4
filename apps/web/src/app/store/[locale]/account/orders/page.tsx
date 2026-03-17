'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { storeApi, isCustomerAuthenticated } from '@/lib/store-api';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  totalAmount: string;
  currency: string;
  createdAt: string;
  items: Array<{ name: Record<string, string>; quantity: number }>;
}

interface OrdersResponse {
  data: Order[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-indigo-100 text-indigo-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
};

export default function CustomerOrdersPage() {
  const t = useTranslations('storefront.account');
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const [orders, setOrders] = useState<OrdersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchOrders = useCallback(async () => {
    try {
      const data = await storeApi.authGet<OrdersResponse>(
        '/storefront/orders',
        { page, limit: 10 },
      );
      setOrders(data);
    } catch {
      router.push(`/store/${locale}/auth/login`);
    } finally {
      setLoading(false);
    }
  }, [page, locale, router]);

  useEffect(() => {
    if (!isCustomerAuthenticated()) {
      router.push(`/store/${locale}/auth/login`);
      return;
    }
    fetchOrders();
  }, [fetchOrders, locale, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">{t('orderHistory')}</h1>

      {!orders || orders.data.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center">
          <p className="text-gray-500">{t('noOrders')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.data.map((order) => (
            <div
              key={order.id}
              className="rounded-lg border border-gray-200 p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                      statusColors[order.status] ?? 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {order.status}
                  </span>
                  <p className="mt-1 font-medium">
                    {order.currency} {parseFloat(order.totalAmount).toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                {order.items.length}{' '}
                {order.items.length === 1 ? t('item') : t('items')}
              </div>
            </div>
          ))}

          {orders.meta.totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-4">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={page <= 1}
                className="rounded-md border px-4 py-2 text-sm disabled:opacity-50"
              >
                {t('prev')}
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= orders.meta.totalPages}
                className="rounded-md border px-4 py-2 text-sm disabled:opacity-50"
              >
                {t('next')}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
