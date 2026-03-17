'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

const BRANDS = [
  { id: 'apple', name: 'Apple' },
  { id: 'samsung', name: 'Samsung' },
  { id: 'sony', name: 'Sony' },
  { id: 'lg', name: 'LG' },
  { id: 'microsoft', name: 'Microsoft' },
  { id: 'google', name: 'Google' },
  { id: 'asus', name: 'ASUS' },
  { id: 'lenovo', name: 'Lenovo' },
];

interface BrandFilterProps {
  locale: string;
}

export function BrandFilter({ locale }: BrandFilterProps) {
  const t = useTranslations('storefront.themes.teknoloji');
  const router = useRouter();

  return (
    <section className="border-y border-[var(--color-border)] bg-[var(--color-muted)]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h3
          className="text-center text-lg font-semibold text-[var(--color-foreground)]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {t('brands')}
        </h3>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          {BRANDS.map((brand) => (
            <button
              key={brand.id}
              onClick={() => router.push(`/store/${locale}/products?search=${brand.id}`)}
              className="rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-background)] px-6 py-3 text-sm font-bold tracking-wide text-[var(--color-foreground)] transition-all hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
            >
              {brand.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
