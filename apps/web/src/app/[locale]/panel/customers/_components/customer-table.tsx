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
  onDelete: (id: string) => void;
}

export function CustomerTable({
  customers,
  meta,
  onPageChange,
  onDelete,
}: CustomerTableProps) {
  const t = useTranslations('panel.customers');
  const params = useParams();
  const locale = params.locale as string;

  if (customers.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 p-12 text-center">
        <p className="text-slate-500">{t('empty')}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-500">
                {t('table.name')}
              </th>
              <th className="px-4 py-3 text-left font-medium text-slate-500">
                {t('table.email')}
              </th>
              <th className="px-4 py-3 text-center font-medium text-slate-500">
                {t('table.type')}
              </th>
              <th className="px-4 py-3 text-center font-medium text-slate-500">
                {t('table.orders')}
              </th>
              <th className="px-4 py-3 text-left font-medium text-slate-500">
                {t('table.joined')}
              </th>
              <th className="px-4 py-3 text-right font-medium text-slate-500">
                {t('table.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <Link
                    href={`/${locale}/panel/customers/${customer.id}`}
                    className="font-medium text-violet-600 hover:underline"
                  >
                    {customer.firstName} {customer.lastName}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-600">{customer.email}</td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      customer.isGuest
                        ? 'bg-slate-100 text-slate-600'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {customer.isGuest ? t('guest') : t('registered')}
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-slate-600">
                  {customer._count.orders}
                </td>
                <td className="px-4 py-3 text-slate-500">
                  {new Date(customer.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => onDelete(customer.id)}
                    className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {meta.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-slate-500">
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
