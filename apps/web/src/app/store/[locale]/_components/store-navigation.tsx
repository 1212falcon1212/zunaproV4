'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { storeApi } from '@/lib/store-api';

interface Category {
  id: string;
  name: Record<string, string>;
  slug: string;
  children?: Category[];
  _count?: { products: number };
}

interface StoreNavigationProps {
  locale: string;
}

export function StoreNavigation({ locale }: StoreNavigationProps) {
  const t = useTranslations('storefront');
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    storeApi.get<Category[]>('/storefront/categories')
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  if (categories.length === 0) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-[var(--color-foreground)] hover:bg-[var(--color-muted)]"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        {t('header.allCategories')}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full z-40 mt-1 w-64 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-2 shadow-xl">
            {categories.map((cat) => (
              <div key={cat.id}>
                <Link
                  href={`/store/${locale}/categories/${cat.slug}`}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-[var(--color-foreground)] hover:bg-[var(--color-muted)]"
                >
                  {cat.name[locale] ?? cat.name.en ?? cat.slug}
                  {cat._count?.products != null && (
                    <span className="ml-2 text-xs text-[var(--color-secondary)]">({cat._count.products})</span>
                  )}
                </Link>
                {cat.children?.map((child) => (
                  <Link
                    key={child.id}
                    href={`/store/${locale}/categories/${child.slug}`}
                    onClick={() => setOpen(false)}
                    className="block rounded-md px-6 py-1.5 text-sm text-[var(--color-secondary)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]"
                  >
                    {child.name[locale] ?? child.name.en ?? child.slug}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
