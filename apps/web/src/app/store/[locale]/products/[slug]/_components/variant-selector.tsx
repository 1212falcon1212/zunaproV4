'use client';

import { useTranslations } from 'next-intl';

interface Variant {
  name: string;
  sku?: string;
  price?: number;
  stock?: number;
}

interface VariantSelectorProps {
  variants: Variant[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export function VariantSelector({ variants, selectedIndex, onSelect }: VariantSelectorProps) {
  const t = useTranslations('storefront');

  if (variants.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="text-sm font-medium text-[var(--color-foreground)]">
        {t('product.variants')}
      </h3>
      <div className="mt-2 flex flex-wrap gap-2">
        {variants.map((variant, i) => (
          <button
            key={i}
            onClick={() => onSelect(i)}
            className={`rounded-[var(--radius)] border px-4 py-2 text-sm font-medium transition-colors ${
              i === selectedIndex
                ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                : 'border-[var(--color-border)] text-[var(--color-foreground)] hover:border-[var(--color-primary)]'
            } ${variant.stock === 0 ? 'opacity-50' : ''}`}
            disabled={variant.stock === 0}
          >
            {variant.name}
          </button>
        ))}
      </div>
    </div>
  );
}
