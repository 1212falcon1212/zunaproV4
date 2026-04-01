'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { panelApi } from '@/lib/panel-api';
import { OrderDetail } from '../_components/order-detail';

export default function OrderDetailPage() {
  const t = useTranslations('panel.orders');
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const locale = params.locale as string;
  const [order, setOrder] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = useCallback(async () => {
    setLoading(true);
    try {
      const data = await panelApi.get<Record<string, unknown>>(
        `/orders/${orderId}`,
      );
      setOrder(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load order');
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => router.push(`/${locale}/panel/orders`)}
          className="text-sm text-violet-600 hover:underline"
        >
          &larr; {t('backToOrders')}
        </button>
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error || 'Order not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <button
        onClick={() => router.push(`/${locale}/panel/orders`)}
        className="text-sm text-violet-600 hover:underline"
      >
        &larr; {t('backToOrders')}
      </button>
      <OrderDetail order={order as never} onStatusUpdate={fetchOrder} />
    </div>
  );
}
