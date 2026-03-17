'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

const MATERIALS = [
  { id: 'wood', color: '#8B5E3C', pattern: 'bg-amber-700' },
  { id: 'leather', color: '#4A3728', pattern: 'bg-amber-900' },
  { id: 'fabric', color: '#9CA3AF', pattern: 'bg-gray-400' },
  { id: 'metal', color: '#6B7280', pattern: 'bg-gray-500' },
  { id: 'marble', color: '#E5E7EB', pattern: 'bg-gray-200' },
  { id: 'glass', color: '#BFDBFE', pattern: 'bg-blue-200' },
];

interface MaterialFilterProps {
  locale: string;
}

export function MaterialFilter({ locale }: MaterialFilterProps) {
  const t = useTranslations('storefront.themes.mobilya');
  const router = useRouter();

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h2
        className="text-center text-xl font-bold text-[var(--color-foreground)] sm:text-2xl"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {t('filterByMaterial')}
      </h2>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        {MATERIALS.map((material) => (
          <button
            key={material.id}
            onClick={() => router.push(`/store/${locale}/products?search=${material.id}`)}
            className="group flex items-center gap-3 rounded-full border border-[var(--color-border)] bg-[var(--color-background)] px-5 py-2.5 transition-all hover:border-[var(--color-primary)] hover:shadow-md"
          >
            <span
              className="h-6 w-6 rounded-full border border-black/10"
              style={{ backgroundColor: material.color }}
            />
            <span className="text-sm font-medium text-[var(--color-foreground)] group-hover:text-[var(--color-primary)]">
              {t(`material.${material.id}`)}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
