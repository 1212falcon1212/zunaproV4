'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { StatusBadge } from './status-badge';

interface Order {
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
}

interface OrderTableProps {
  orders: Order[];
  meta: { total: number; page: number; limit: number; totalPages: number };
  onPageChange: (page: number) => void;
}

export function OrderTable({ orders, meta, onPageChange }: OrderTableProps) {
  const t = useTranslations('panel.orders');
  const params = useParams();
  const locale = params.locale as string;

  if (orders.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center">
        <p className="text-gray-500">{t('empty')}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-500">
                {t('table.orderNumber')}
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">
                {t('table.customer')}
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">
                {t('table.status')}
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">
                {t('table.payment')}
              </th>
              <th className="px-4 py-3 text-right font-medium text-gray-500">
                {t('table.total')}
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">
                {t('table.date')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <Link
                    href={`/${locale}/panel/orders/${order.id}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {order.customer
                    ? `${order.customer.firstName} ${order.customer.lastName}`
                    : 'Guest'}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={order.paymentStatus} type="payment" />
                </td>
                <td className="px-4 py-3 text-right font-medium">
                  {order.currency} {parseFloat(order.totalAmount).toFixed(2)}
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {meta.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {t('showing', {
              from: (meta.page - 1) * meta.limit + 1,
              to: Math.min(meta.page * meta.limit, meta.total),
              total: meta.total,
            })}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(meta.page - 1)}
              disabled={meta.page <= 1}
              className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-50"
            >
              {t('prev')}
            </button>
            <button
              onClick={() => onPageChange(meta.page + 1)}
              disabled={meta.page >= meta.totalPages}
              className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-50"
            >
              {t('next')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
