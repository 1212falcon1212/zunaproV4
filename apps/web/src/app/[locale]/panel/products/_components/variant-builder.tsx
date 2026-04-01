'use client';

import { useTranslations } from 'next-intl';
import { Button, Input, Badge } from '@zunapro/ui';

interface Variant {
  name: string;
  sku: string;
  barcode?: string;
  price: number;
  listPrice?: number;
  stock: number;
  trendyolId?: number;
  attributes?: Record<string, string>;
}

interface VariantBuilderProps {
  variants: Variant[];
  onChange: (variants: Variant[]) => void;
}

const formatTRY = (n: number) =>
  new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(n);

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

  // Check if variants have rich data (from marketplace import)
  const hasAttributes = variants.some((v) => v.attributes && Object.keys(v.attributes).length > 0);
  const hasBarcodes = variants.some((v) => v.barcode);

  if (variants.length === 0) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">Henuz varyasyon eklenmemis.</p>
          <Button type="button" variant="outline" size="sm" onClick={addVariant}>
            {t('add')}
          </Button>
        </div>
      </div>
    );
  }

  // Rich variant display (marketplace imported)
  if (hasAttributes) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-800">{variants.length} Varyasyon</h3>
            <Badge className="bg-violet-50 text-violet-700 text-[10px]">Marketplace</Badge>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addVariant}>
            {t('add')}
          </Button>
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600">Ozellikler</th>
                {hasBarcodes && <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600">Barkod</th>}
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600">SKU</th>
                <th className="px-3 py-2.5 text-right text-xs font-semibold text-slate-600">Fiyat</th>
                <th className="px-3 py-2.5 text-right text-xs font-semibold text-slate-600">Stok</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {variants.map((variant, index) => (
                <tr key={index} className="hover:bg-slate-50/50">
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-1">
                      {variant.attributes && Object.entries(variant.attributes).map(([key, val]) => (
                        <span key={key} className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px]">
                          <span className="text-slate-400">{key}: </span>
                          <span className="font-medium text-slate-700">{val}</span>
                        </span>
                      ))}
                      {(!variant.attributes || Object.keys(variant.attributes).length === 0) && (
                        <Input
                          value={variant.name}
                          onChange={(e) => updateVariant(index, 'name', e.target.value)}
                          placeholder="Varyant adi"
                          className="h-7 text-xs"
                        />
                      )}
                    </div>
                  </td>
                  {hasBarcodes && (
                    <td className="px-3 py-2 font-mono text-xs text-slate-600">{variant.barcode || '-'}</td>
                  )}
                  <td className="px-3 py-2">
                    <Input
                      value={variant.sku}
                      onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                      className="h-7 w-32 text-xs font-mono"
                    />
                  </td>
                  <td className="px-3 py-2 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-xs text-slate-400">₺</span>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={variant.price || ''}
                        onChange={(e) => updateVariant(index, 'price', parseFloat(e.target.value) || 0)}
                        className="h-7 w-24 text-right text-xs"
                      />
                    </div>
                    {variant.listPrice && variant.listPrice > variant.price && (
                      <p className="mt-0.5 text-[10px] text-slate-400 line-through">{formatTRY(variant.listPrice)}</p>
                    )}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <Input
                      type="number"
                      min="0"
                      value={variant.stock || ''}
                      onChange={(e) => updateVariant(index, 'stock', parseInt(e.target.value) || 0)}
                      className={`h-7 w-20 text-right text-xs ${variant.stock > 0 ? '' : 'text-rose-500'}`}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-500"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span>Toplam stok: <strong className="text-slate-700">{variants.reduce((s, v) => s + v.stock, 0)}</strong></span>
          <span>Fiyat araligi: <strong className="text-slate-700">{formatTRY(Math.min(...variants.map((v) => v.price)))} — {formatTRY(Math.max(...variants.map((v) => v.price)))}</strong></span>
        </div>
      </div>
    );
  }

  // Simple variant display (manual)
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-700">{t('title')} ({variants.length})</h3>
        <Button type="button" variant="outline" size="sm" onClick={addVariant}>
          {t('add')}
        </Button>
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-[1fr_1fr_80px_80px_40px] gap-2 text-xs font-medium text-slate-500">
          <span>{t('name')}</span>
          <span>{t('sku')}</span>
          <span>{t('price')}</span>
          <span>{t('stock')}</span>
          <span />
        </div>

        {variants.map((variant, index) => (
          <div key={index} className="grid grid-cols-[1fr_1fr_80px_80px_40px] gap-2">
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
              onChange={(e) => updateVariant(index, 'price', parseFloat(e.target.value) || 0)}
            />
            <Input
              type="number"
              min="0"
              value={variant.stock || ''}
              onChange={(e) => updateVariant(index, 'stock', parseInt(e.target.value) || 0)}
            />
            <button
              type="button"
              onClick={() => removeVariant(index)}
              className="flex items-center justify-center rounded-md text-slate-400 hover:text-rose-500"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
