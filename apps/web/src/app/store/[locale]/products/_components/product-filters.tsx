'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { storeApi } from '@/lib/store-api';

interface Category {
  id: string;
  name: Record<string, string>;
  slug: string;
}

interface ProductFiltersProps {
  locale: string;
}

export function ProductFilters({ locale }: ProductFiltersProps) {
  const t = useTranslations('storefront');
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);

  const currentCategory = searchParams.get('category') ?? '';
  const currentSort = searchParams.get('sort') ?? 'newest';
  const currentMinPrice = searchParams.get('minPrice') ?? '';
  const currentMaxPrice = searchParams.get('maxPrice') ?? '';

  useEffect(() => {
    storeApi.get<Category[]>('/storefront/categories').then(setCategories).catch(() => setCategories([]));
  }, []);

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete('page');
      router.push(`/store/${locale}/products?${params.toString()}`);
    },
    [searchParams, locale, router],
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Sort */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-[var(--color-foreground)]">
          {t('products.sortBy')}
        </label>
        <select
          value={currentSort}
          onChange={(e) => updateParams('sort', e.target.value)}
          className="w-full rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm"
        >
          <option value="newest">{t('products.sortNewest')}</option>
          <option value="price_asc">{t('products.sortPriceAsc')}</option>
          <option value="price_desc">{t('products.sortPriceDesc')}</option>
          <option value="name_asc">{t('products.sortNameAsc')}</option>
        </select>
      </div>

      {/* Category */}
      {categories.length > 0 && (
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--color-foreground)]">
            {t('categories')}
          </label>
          <select
            value={currentCategory}
            onChange={(e) => updateParams('category', e.target.value)}
            className="w-full rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm"
          >
            <option value="">{t('products.allCategories')}</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name[locale] ?? cat.name.en ?? cat.slug}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Price range */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-[var(--color-foreground)]">
          {t('products.priceRange')}
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            placeholder="Min"
            value={currentMinPrice}
            onChange={(e) => updateParams('minPrice', e.target.value)}
            className="w-full rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm"
          />
          <span className="text-[var(--color-secondary)]">-</span>
          <input
            type="number"
            min={0}
            placeholder="Max"
            value={currentMaxPrice}
            onChange={(e) => updateParams('maxPrice', e.target.value)}
            className="w-full rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm"
          />
        </div>
      </div>
    </div>
  );
}
