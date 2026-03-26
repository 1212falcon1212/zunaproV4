'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { storeApi } from '@/lib/store-api';
import { useCompare } from '../_components/hooks/use-compare';

interface Product {
  id: string;
  name: Record<string, string>;
  slug: string;
  price: number;
  compareAtPrice?: number | null;
  images: string[];
  description: Record<string, string>;
  sku: string;
  stock: number;
  category?: { name: Record<string, string>; slug: string } | null;
}

export default function ComparePage() {
  const { locale } = useParams<{ locale: string }>();
  const t = useTranslations('storefront');
  const { items: compareIds, remove, clear } = useCompare();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (compareIds.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    storeApi.get<{ data: Product[] }>('/storefront/products', { limit: 100 })
      .then((res) => {
        const filtered = res.data.filter((p) => compareIds.includes(p.id));
        setProducts(filtered);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [compareIds]);

  if (loading) {
    return (
      <div className="mx-auto max-w-[1300px] px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('header.compare')}
        </h1>
        <div className="h-96 animate-pulse rounded-lg bg-[var(--color-muted)]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1300px] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[var(--color-foreground)]" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('header.compare')}
        </h1>
        {products.length > 0 && (
          <button
            onClick={clear}
            className="text-sm text-[var(--color-secondary)] hover:text-[var(--color-foreground)]"
          >
            {t('clearAll')}
          </button>
        )}
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center py-16">
          <svg className="mb-4 h-16 w-16 text-[var(--color-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
          </svg>
          <p className="mb-4 text-lg text-[var(--color-secondary)]">{t('emptyCompare')}</p>
          <Link
            href={`/store/${locale}/products`}
            className="rounded-md bg-[var(--color-primary)] px-6 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            {t('header.allProducts')}
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse">
            {/* Product images */}
            <thead>
              <tr>
                <th className="w-40 border-b border-[var(--color-border)] p-4 text-left text-sm font-medium text-[var(--color-secondary)]" />
                {products.map((p) => (
                  <th key={p.id} className="relative border-b border-[var(--color-border)] p-4 text-center">
                    <button
                      onClick={() => remove(p.id)}
                      className="absolute right-2 top-2 rounded-full p-1 text-[var(--color-secondary)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <Link href={`/store/${locale}/products/${p.slug}`}>
                      <div className="mx-auto mb-3 h-32 w-32 overflow-hidden rounded-lg bg-[var(--color-muted)]">
                        {p.images[0] ? (
                          <img src={p.images[0]} alt={p.name[locale] ?? p.name['en'] ?? ''} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <svg className="h-8 w-8 text-[var(--color-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M18 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-medium text-[var(--color-foreground)] hover:text-[var(--color-primary)]">
                        {p.name[locale] ?? p.name['en'] ?? p.slug}
                      </span>
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Price */}
              <tr>
                <td className="border-b border-[var(--color-border)] p-4 text-sm font-medium text-[var(--color-secondary)]">{t('price')}</td>
                {products.map((p) => (
                  <td key={p.id} className="border-b border-[var(--color-border)] p-4 text-center">
                    <span className="text-sm font-semibold text-[var(--color-primary)]">${p.price.toFixed(2)}</span>
                    {p.compareAtPrice && (
                      <span className="ml-2 text-xs text-[var(--color-secondary)] line-through">${p.compareAtPrice.toFixed(2)}</span>
                    )}
                  </td>
                ))}
              </tr>
              {/* SKU */}
              <tr>
                <td className="border-b border-[var(--color-border)] p-4 text-sm font-medium text-[var(--color-secondary)]">SKU</td>
                {products.map((p) => (
                  <td key={p.id} className="border-b border-[var(--color-border)] p-4 text-center text-sm text-[var(--color-foreground)]">{p.sku}</td>
                ))}
              </tr>
              {/* Stock */}
              <tr>
                <td className="border-b border-[var(--color-border)] p-4 text-sm font-medium text-[var(--color-secondary)]">{t('stock')}</td>
                {products.map((p) => (
                  <td key={p.id} className="border-b border-[var(--color-border)] p-4 text-center text-sm">
                    <span className={p.stock > 0 ? 'text-green-600' : 'text-red-500'}>
                      {p.stock > 0 ? `${p.stock} ${t('inStock')}` : t('outOfStock')}
                    </span>
                  </td>
                ))}
              </tr>
              {/* Category */}
              <tr>
                <td className="border-b border-[var(--color-border)] p-4 text-sm font-medium text-[var(--color-secondary)]">{t('categories')}</td>
                {products.map((p) => (
                  <td key={p.id} className="border-b border-[var(--color-border)] p-4 text-center text-sm text-[var(--color-foreground)]">
                    {p.category ? (p.category.name[locale] ?? p.category.name['en'] ?? '-') : '-'}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
