'use client';

import { useTranslations } from 'next-intl';
import { Button, Input } from '@zunapro/ui';

interface Variant {
  name: string;
  sku: string;
  price: number;
  stock: number;
}

interface VariantBuilderProps {
  variants: Variant[];
  onChange: (variants: Variant[]) => void;
}

export function VariantBuilder({ variants, onChange }: VariantBuilderProps) {
  const t = useTranslations('panel.products.variants');

  const addVariant = () => {
    onChange([...variants, { name: '', sku: '', price: 0, stock: 0 }]);
  };

  const updateVariant = (index: number, field: keyof Variant, value: string | number) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeVariant = (index: number) => {
    onChange(variants.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">{t('title')}</h3>
        <Button type="button" variant="outline" size="sm" onClick={addVariant}>
          {t('add')}
        </Button>
      </div>

      {variants.length > 0 && (
        <div className="space-y-2">
          <div className="grid grid-cols-[1fr_1fr_80px_80px_40px] gap-2 text-xs font-medium text-gray-500">
            <span>{t('name')}</span>
            <span>{t('sku')}</span>
            <span>{t('price')}</span>
            <span>{t('stock')}</span>
            <span />
          </div>

          {variants.map((variant, index) => (
            <div
              key={index}
              className="grid grid-cols-[1fr_1fr_80px_80px_40px] gap-2"
            >
              <Input
                value={variant.name}
                onChange={(e) => updateVariant(index, 'name', e.target.value)}
                placeholder={t('namePlaceholder')}
              />
              <Input
                value={variant.sku}
                onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                placeholder="SKU"
              />
              <Input
                type="number"
                min="0"
                step="0.01"
                value={variant.price || ''}
                onChange={(e) =>
                  updateVariant(index, 'price', parseFloat(e.target.value) || 0)
                }
              />
              <Input
                type="number"
                min="0"
                value={variant.stock || ''}
                onChange={(e) =>
                  updateVariant(index, 'stock', parseInt(e.target.value) || 0)
                }
              />
              <button
                type="button"
                onClick={() => removeVariant(index)}
                className="flex items-center justify-center rounded-md text-gray-400 hover:text-red-500"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
