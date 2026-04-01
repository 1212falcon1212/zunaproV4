'use client';

import { useTranslations } from 'next-intl';
import { Input } from '@zunapro/ui';

interface ProductFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
}

const STATUS_TABS = ['all', 'active', 'draft', 'archived'] as const;

export function ProductFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
}: ProductFiltersProps) {
  const t = useTranslations('panel.products');

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => onStatusChange(tab)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              status === tab
                ? 'bg-white text-violet-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t(`status.${tab}`)}
          </button>
        ))}
      </div>

      <Input
        type="search"
        placeholder={t('searchPlaceholder')}
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-xs"
      />
    </div>
  );
}
