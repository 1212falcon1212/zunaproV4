'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  const t = useTranslations('storefront');
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const buildHref = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    return `${basePath}?${params.toString()}`;
  };

  const pages: number[] = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <nav className="mt-8 flex items-center justify-center gap-1">
      {currentPage > 1 && (
        <Link
          href={buildHref(currentPage - 1)}
          className="rounded-[var(--radius)] px-3 py-2 text-sm text-[var(--color-foreground)] hover:bg-[var(--color-muted)]"
        >
          {t('products.prev')}
        </Link>
      )}

      {pages.map((page) => (
        <Link
          key={page}
          href={buildHref(page)}
          className={`rounded-[var(--radius)] px-3 py-2 text-sm font-medium ${
            page === currentPage
              ? 'bg-[var(--color-primary)] text-white'
              : 'text-[var(--color-foreground)] hover:bg-[var(--color-muted)]'
          }`}
        >
          {page}
        </Link>
      ))}

      {currentPage < totalPages && (
        <Link
          href={buildHref(currentPage + 1)}
          className="rounded-[var(--radius)] px-3 py-2 text-sm text-[var(--color-foreground)] hover:bg-[var(--color-muted)]"
        >
          {t('products.next')}
        </Link>
      )}
    </nav>
  );
}
