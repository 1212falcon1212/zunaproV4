'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  isGuest: boolean;
  locale: string;
  createdAt: string;
  _count: { orders: number };
}

interface CustomerTableProps {
  customers: Customer[];
  meta: { total: number; page: number; limit: number; totalPages: number };
  onPageChange: (page: number) => void;
}

export function CustomerTable({
  customers,
  meta,
  onPageChange,
}: CustomerTableProps) {
  const t = useTranslations('panel.customers');
  const params = useParams();
  const locale = params.locale as string;

  if (customers.length === 0) {
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
                {t('table.name')}
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">
                {t('table.email')}
              </th>
              <th className="px-4 py-3 text-center font-medium text-gray-500">
                {t('table.type')}
              </th>
              <th className="px-4 py-3 text-center font-medium text-gray-500">
                {t('table.orders')}
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">
                {t('table.joined')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <Link
                    href={`/${locale}/panel/customers/${customer.id}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {customer.firstName} {customer.lastName}
                  </Link>
                </td>
                <td className="px-4 py-3 text-gray-600">{customer.email}</td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      customer.isGuest
                        ? 'bg-gray-100 text-gray-600'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {customer.isGuest ? t('guest') : t('registered')}
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-gray-600">
                  {customer._count.orders}
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {new Date(customer.createdAt).toLocaleDateString()}
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
