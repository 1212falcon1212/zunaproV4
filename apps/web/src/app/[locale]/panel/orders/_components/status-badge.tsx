'use client';

import { useTranslations } from 'next-intl';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  preparing: 'bg-violet-100 text-violet-800',
  shipped: 'bg-blue-100 text-blue-800',
  delivered: 'bg-emerald-100 text-emerald-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-rose-100 text-rose-800',
  refunded: 'bg-slate-100 text-slate-800',
  paid: 'bg-green-100 text-green-800',
  failed: 'bg-rose-100 text-rose-800',
};

export function StatusBadge({
  status,
  type = 'order',
}: {
  status: string;
  type?: 'order' | 'payment';
}) {
  const t = useTranslations('panel.orders.status');
  const colorClass = statusColors[status] ?? 'bg-slate-100 text-slate-800';
  const label = t.has(status) ? t(status) : status;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}
    >
      {label}
    </span>
  );
}
