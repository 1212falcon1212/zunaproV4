'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface SearchBarProps {
  locale: string;
  variant?: 'default' | 'header';
}

export function SearchBar({ locale, variant = 'default' }: SearchBarProps) {
  const t = useTranslations('storefront');
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = query.trim();
      if (trimmed) {
        router.push(`/store/${locale}/products?search=${encodeURIComponent(trimmed)}`);
      }
    },
    [query, locale, router],
  );

  if (variant === 'header') {
    return (
      <form onSubmit={handleSubmit} className="flex-1">
        <div className="relative flex items-center">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('search')}
            className="w-full rounded-l-md border border-r-0 border-[var(--color-border)] bg-[var(--color-background)] py-2.5 pl-4 pr-4 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-secondary)] focus:border-[var(--color-primary)] focus:outline-none"
          />
          <button
            type="submit"
            className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-r-md bg-[var(--color-primary)] text-white transition-colors hover:opacity-90"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex-1">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-secondary)]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('search')}
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)] py-2 pl-10 pr-4 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-secondary)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
        />
      </div>
    </form>
  );
}
