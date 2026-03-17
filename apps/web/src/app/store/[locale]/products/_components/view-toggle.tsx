'use client';

import { useTranslations } from 'next-intl';

interface ViewToggleProps {
  viewMode: 'grid' | 'list';
  onToggle: (mode: 'grid' | 'list') => void;
}

export function ViewToggle({ viewMode, onToggle }: ViewToggleProps) {
  const t = useTranslations('storefront');

  return (
    <div className="flex items-center gap-1 rounded-[var(--radius)] border border-[var(--color-border)] p-0.5">
      <button
        onClick={() => onToggle('grid')}
        className={`rounded-sm p-1.5 ${viewMode === 'grid' ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-secondary)] hover:text-[var(--color-foreground)]'}`}
        aria-label={t('products.gridView')}
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 16 16">
          <rect x="1" y="1" width="6" height="6" rx="1" />
          <rect x="9" y="1" width="6" height="6" rx="1" />
          <rect x="1" y="9" width="6" height="6" rx="1" />
          <rect x="9" y="9" width="6" height="6" rx="1" />
        </svg>
      </button>
      <button
        onClick={() => onToggle('list')}
        className={`rounded-sm p-1.5 ${viewMode === 'list' ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-secondary)] hover:text-[var(--color-foreground)]'}`}
        aria-label={t('products.listView')}
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 16 16">
          <rect x="1" y="1" width="14" height="3" rx="1" />
          <rect x="1" y="6" width="14" height="3" rx="1" />
          <rect x="1" y="11" width="14" height="3" rx="1" />
        </svg>
      </button>
    </div>
  );
}
