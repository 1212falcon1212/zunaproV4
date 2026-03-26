'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { storeApi } from '@/lib/store-api';

interface Category {
  id: string;
  name: Record<string, string>;
  slug: string;
  image?: string | null;
  children?: Category[];
  _count?: { products: number };
}

export default function CategoriesPage() {
  const { locale } = useParams<{ locale: string }>();
  const t = useTranslations('storefront');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    storeApi.get<Category[]>('/storefront/categories')
      .then(setCategories)
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-[1300px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-lg bg-[var(--color-muted)]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1300px] px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-[var(--color-foreground)]" style={{ fontFamily: 'var(--font-heading)' }}>
        {t('categories')}
      </h1>

      {categories.length === 0 ? (
        <p className="text-[var(--color-secondary)]">{t('empty')}</p>
      ) : (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/store/${locale}/categories/${cat.slug}`}
              className="group overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] transition-shadow hover:shadow-md"
            >
              {cat.image ? (
                <div className="aspect-[4/3] overflow-hidden bg-[var(--color-muted)]">
                  <img
                    src={cat.image}
                    alt={cat.name[locale] ?? cat.name['en'] ?? cat.slug}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center bg-[var(--color-muted)]">
                  <svg className="h-12 w-12 text-[var(--color-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                  </svg>
                </div>
              )}
              <div className="p-4">
                <h3 className="text-sm font-semibold text-[var(--color-foreground)]">
                  {cat.name[locale] ?? cat.name['en'] ?? cat.slug}
                </h3>
                {cat._count && (
                  <p className="mt-1 text-xs text-[var(--color-secondary)]">
                    {cat._count.products} {t('header.allProducts').toLowerCase()}
                  </p>
                )}
                {cat.children && cat.children.length > 0 && (
                  <p className="mt-1 text-xs text-[var(--color-secondary)]">
                    {cat.children.map((c) => c.name[locale] ?? c.name['en'] ?? c.slug).join(', ')}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
