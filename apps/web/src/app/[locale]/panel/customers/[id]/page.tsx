'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { panelApi } from '@/lib/panel-api';
import { StatusBadge } from '../../orders/_components/status-badge';

interface CustomerDetail {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  isGuest: boolean;
  locale: string;
  addresses: unknown[];
  createdAt: string;
  totalSpent: number;
  orderCount: number;
  orders: Array<{
    id: string;
    orderNumber: string;
    status: string;
    totalAmount: string;
    currency: string;
    createdAt: string;
  }>;
}

export default function CustomerDetailPage() {
  const t = useTranslations('panel.customers');
  const params = useParams();
  const router = useRouter();
  const customerId = params.id as string;
  const locale = params.locale as string;
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomer = useCallback(async () => {
    setLoading(true);
    try {
      const data = await panelApi.get<CustomerDetail>(
        `/customers/${customerId}`,
      );
      setCustomer(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load customer',
      );
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => router.push(`/${locale}/panel/customers`)}
          className="text-sm text-primary hover:underline"
        >
          &larr; {t('backToCustomers')}
        </button>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error || 'Customer not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.push(`/${locale}/panel/customers`)}
        className="text-sm text-primary hover:underline"
      >
        &larr; {t('backToCustomers')}
      </button>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile */}
        <div className="rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold">
            {customer.firstName} {customer.lastName}
          </h2>
          <p className="text-sm text-gray-500">{customer.email}</p>
          {customer.phone && (
            <p className="text-sm text-gray-500">{customer.phone}</p>
          )}
          <div className="mt-4 flex gap-4">
            <div>
              <p className="text-2xl font-bold">{customer.orderCount}</p>
              <p className="text-xs text-gray-500">{t('totalOrders')}</p>
            </div>
            <div>
              <p className="text-2xl font-bold">
                {customer.totalSpent.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">{t('totalSpent')}</p>
            </div>
          </div>
          <div className="mt-3">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                customer.isGuest
                  ? 'bg-gray-100 text-gray-600'
                  : 'bg-green-100 text-green-700'
              }`}
            >
              {customer.isGuest ? t('guest') : t('registered')}
            </span>
          </div>
          <p className="mt-2 text-xs text-gray-400">
            {t('joined')}: {new Date(customer.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <h3 className="mb-3 text-lg font-medium">{t('recentOrders')}</h3>
          {customer.orders.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
              {t('noOrders')}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">
                      {t('orderNumber')}
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">
                      {t('status')}
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-gray-500">
                      {t('amount')}
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">
                      {t('date')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {customer.orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <Link
                          href={`/${locale}/panel/orders/${order.id}`}
                          className="font-medium text-primary hover:underline"
                        >
                          {order.orderNumber}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-4 py-3 text-right font-medium">
                        {order.currency}{' '}
                        {parseFloat(order.totalAmount).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
