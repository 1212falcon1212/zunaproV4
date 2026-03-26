'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { panelApi } from '@/lib/panel-api';
import { OrderTable } from './_components/order-table';
import { OrderFilters } from './_components/order-filters';

interface OrdersResponse {
  data: Array<{
    id: string;
    orderNumber: string;
    status: string;
    paymentStatus: string;
    totalAmount: string;
    currency: string;
    createdAt: string;
    customer?: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
    };
  }>;
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export default function OrdersPage() {
  const t = useTranslations('panel.orders');
  const [orders, setOrders] = useState<OrdersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string | number> = { page, limit: 20 };
      if (status !== 'all') params.status = status;
      if (search) params.search = search;
      const data = await panelApi.get<OrdersResponse>('/orders', params);
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [page, status, search]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    setPage(1);
  };

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
    setPage(1);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu siparişi silmek istediğinize emin misiniz?')) return;
    try {
      await panelApi.delete(`/orders/${id}`);
      fetchOrders();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sipariş silinemedi');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        {orders && (
          <p className="text-sm text-gray-500">
            {t('subtitle', { count: orders.meta.total })}
          </p>
        )}
      </div>

      <OrderFilters
        currentStatus={status}
        search={search}
        onStatusChange={handleStatusChange}
        onSearchChange={handleSearchChange}
      />

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      ) : orders ? (
        <OrderTable
          orders={orders.data}
          meta={orders.meta}
          onPageChange={setPage}
          onDelete={handleDelete}
        />
      ) : null}
    </div>
  );
}
