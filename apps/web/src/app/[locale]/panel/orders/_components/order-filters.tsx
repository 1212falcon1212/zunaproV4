'use client';

import { useTranslations } from 'next-intl';

const statuses = [
  'all',
  'pending',
  'preparing',
  'shipped',
  'delivered',
  'completed',
  'cancelled',
  'refunded',
];

interface OrderFiltersProps {
  currentStatus: string;
  search: string;
  onStatusChange: (status: string) => void;
  onSearchChange: (search: string) => void;
}

export function OrderFilters({
  currentStatus,
  search,
  onStatusChange,
  onSearchChange,
}: OrderFiltersProps) {
  const t = useTranslations('panel.orders');

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => onStatusChange(status)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              currentStatus === status
                ? 'bg-violet-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t(`status.${status}`)}
          </button>
        ))}
      </div>
      <input
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={t('searchPlaceholder')}
        className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-400"
      />
    </div>
  );
}
