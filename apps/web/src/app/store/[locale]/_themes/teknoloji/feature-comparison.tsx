'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { storeApi } from '@/lib/store-api';
import { useCurrency } from '../../_components/hooks/use-currency';

interface Product {
  id: string;
  name: Record<string, string>;
  slug: string;
  price: string | number;
  images: string[];
  variants: { name: string; sku?: string; price?: number }[];
}

interface ProductsResponse {
  data: Product[];
}

interface FeatureComparisonProps {
  locale: string;
}

export function FeatureComparison({ locale }: FeatureComparisonProps) {
  const t = useTranslations('storefront.themes.teknoloji');
  const { formatPrice } = useCurrency();
  const [products, setProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    storeApi.get<ProductsResponse>('/storefront/products?limit=8&sort=newest')
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]));
  }, []);

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : prev.length < 4 ? [...prev, id] : prev,
    );
  };

  const selectedProducts = products.filter((p) => selected.includes(p.id));

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h2
        className="text-2xl font-bold text-[var(--color-foreground)] sm:text-3xl"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {t('compare')}
      </h2>
      <p className="mt-2 text-sm text-[var(--color-secondary)]">
        {t('compareDescription')}
      </p>

      {/* Product selection chips */}
      <div className="mt-6 flex flex-wrap gap-2">
        {products.map((p) => {
          const isSelected = selected.includes(p.id);
          const name = p.name[locale] ?? p.name.en ?? p.slug;
          return (
            <button
              key={p.id}
              onClick={() => toggleSelect(p.id)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
                isSelected
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                  : 'border-[var(--color-border)] text-[var(--color-foreground)] hover:border-[var(--color-primary)]'
              }`}
            >
              {name}
            </button>
          );
        })}
      </div>

      {/* Comparison table */}
      {selectedProducts.length >= 2 && (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border-b border-[var(--color-border)] p-3 text-left text-sm font-medium text-[var(--color-secondary)]">
                  {t('specifications')}
                </th>
                {selectedProducts.map((p) => (
                  <th key={p.id} className="border-b border-[var(--color-border)] p-3 text-center">
                    <div className="flex flex-col items-center gap-2">
                      {p.images?.[0] && (
                        <img src={p.images[0]} alt="" className="h-16 w-16 rounded-[var(--radius)] object-cover" />
                      )}
                      <span className="text-sm font-medium text-[var(--color-foreground)]">
                        {p.name[locale] ?? p.name.en ?? p.slug}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-b border-[var(--color-border)] p-3 text-sm text-[var(--color-secondary)]">
                  {t('price')}
                </td>
                {selectedProducts.map((p) => (
                  <td key={p.id} className="border-b border-[var(--color-border)] p-3 text-center text-sm font-bold text-[var(--color-foreground)]">
                    {formatPrice(p.price)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border-b border-[var(--color-border)] p-3 text-sm text-[var(--color-secondary)]">
                  {t('variants')}
                </td>
                {selectedProducts.map((p) => (
                  <td key={p.id} className="border-b border-[var(--color-border)] p-3 text-center text-sm text-[var(--color-foreground)]">
                    {p.variants?.length ?? 0}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
