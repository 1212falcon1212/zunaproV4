'use client';

import { useState, useMemo, useCallback, memo } from 'react';
import { Badge } from '@zunapro/ui';
import { CheckCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { AttributeField } from './attribute-field';

/* ─── Types ─── */

interface AttributeValue {
  id: number;
  name: string;
}

interface CategoryAttribute {
  allowCustom: boolean;
  required: boolean;
  varianter: boolean;
  slicer: boolean;
  attribute: { id: number; name: string };
  attributeValues: AttributeValue[];
}

interface VariantData {
  name: string;
  sku: string;
  barcode?: string;
  price: number;
  stock: number;
  attributes?: Record<string, string>;
}

interface ProductData {
  id: string;
  name: unknown;
  sku?: string;
  variants: VariantData[];
  images?: string[];
}

interface CategoryAttributeFormProps {
  categoryName: string;
  marketplaceCategoryId: string;
  categoryAttributes: CategoryAttribute[];
  products: ProductData[];
  variantAttributeNames: string[];
  categoryValues: Record<string, { value: string; valueId?: string }>;
  perProductValues: Record<string, Record<string, { value: string; valueId?: string }>>;
  onCategoryValueChange: (attrKey: string, value: string, valueId?: string) => void;
  onProductValueChange: (productId: string, attrKey: string, value: string, valueId?: string) => void;
  locale: string;
}

/* ─── Helpers ─── */

function locName(name: unknown, locale = 'tr'): string {
  if (typeof name === 'string') return name;
  if (name && typeof name === 'object') {
    const o = name as Record<string, string>;
    return o[locale] || o.en || o.tr || Object.values(o)[0] || '';
  }
  return '';
}

type FilterMode = 'all' | 'missing' | 'ready';

/* ─── Main Component ─── */

export const CategoryAttributeForm = memo(function CategoryAttributeForm({
  categoryName,
  marketplaceCategoryId,
  categoryAttributes,
  products,
  variantAttributeNames,
  categoryValues,
  perProductValues,
  onCategoryValueChange,
  onProductValueChange,
  locale,
}: CategoryAttributeFormProps) {
  const [expanded, setExpanded] = useState(true);
  const [mode, setMode] = useState<'category' | 'product'>('category');
  const [showOptional, setShowOptional] = useState(false);
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [activeProductId, setActiveProductId] = useState<string>(products[0]?.id ?? '');

  // Classify attributes
  const slicerVarianter = useMemo(
    () => categoryAttributes.filter((a) => a.varianter || a.slicer),
    [categoryAttributes],
  );
  const required = useMemo(
    () => categoryAttributes.filter((a) => a.required && !a.varianter && !a.slicer),
    [categoryAttributes],
  );
  const optional = useMemo(
    () => categoryAttributes.filter((a) => !a.required && !a.varianter && !a.slicer),
    [categoryAttributes],
  );

  // Auto-matched: slicer/varianter attrs whose name matches a variantAttributeName
  const autoMatched = useMemo(
    () =>
      slicerVarianter.filter((a) =>
        variantAttributeNames.some(
          (v) => v.toLowerCase() === a.attribute.name.toLowerCase(),
        ),
      ),
    [slicerVarianter, variantAttributeNames],
  );

  // Required slicer/varianter attrs (Beden, Renk) — always per-product
  const requiredSlicerVarianter = useMemo(
    () => slicerVarianter.filter((a) => a.required),
    [slicerVarianter],
  );

  // Fillable required: only non-slicer/non-varianter (category-level shared values)
  const fillableRequired = required;
  const fillableOptional = optional;
  const totalFillable = fillableRequired.length + fillableOptional.length;

  // Resolve value for a product+attr
  function resolveValue(
    productId: string,
    attrKey: string,
  ): { value: string; valueId?: string; fromCategory: boolean } {
    const perProduct = perProductValues[productId]?.[attrKey];
    if (perProduct && perProduct.value !== '') {
      return { ...perProduct, fromCategory: false };
    }
    const cat = categoryValues[attrKey];
    if (cat && cat.value !== '') {
      return { ...cat, fromCategory: true };
    }
    return { value: '', fromCategory: false };
  }

  // Count filled attrs for a product
  function countFilled(productId: string): number {
    let count = 0;
    for (const attr of [...fillableRequired, ...fillableOptional]) {
      const resolved = resolveValue(productId, attr.attribute.name);
      if (resolved.value !== '') count++;
    }
    return count;
  }

  // Product filter counts — computed directly (no useMemo to avoid JSON.stringify overhead)
  let missingCount = 0;
  let readyCount = 0;
  if (mode === 'product') {
    for (const p of products) {
      const allFilled = fillableRequired.every(
        (attr) => resolveValue(p.id, attr.attribute.name).value !== '',
      );
      if (allFilled) readyCount++;
      else missingCount++;
    }
  }
  const productCounts = { all: products.length, missing: missingCount, ready: readyCount };

  const filteredProducts = mode === 'product'
    ? (filterMode === 'all' ? products : products.filter((p) => {
        const allFilled = fillableRequired.every(
          (attr) => resolveValue(p.id, attr.attribute.name).value !== '',
        );
        return filterMode === 'ready' ? allFilled : !allFilled;
      }))
    : products;

  // Unique values for auto-matched attrs — prefer wizard values over raw variant values
  function getVariantValueCounts(attrName: string): Array<{ name: string; count: number; fromWizard: boolean }> {
    const counts: Record<string, { count: number; fromWizard: boolean }> = {};
    for (const p of products) {
      // Check wizard value first (per-product)
      const wizardVal = resolveValue(p.id, attrName).value;
      if (wizardVal) {
        if (!counts[wizardVal]) counts[wizardVal] = { count: 0, fromWizard: true };
        counts[wizardVal].count++;
        continue;
      }
      // Fallback: count raw variant values
      for (const v of p.variants) {
        const val = v.attributes?.[attrName];
        if (val) {
          if (!counts[val]) counts[val] = { count: 0, fromWizard: false };
          counts[val].count++;
        }
      }
    }
    return Object.entries(counts)
      .map(([name, { count, fromWizard }]) => ({ name, count, fromWizard }))
      .sort((a, b) => b.count - a.count);
  }

  // Active product for product-based mode
  const activeProduct = products.find((p) => p.id === activeProductId) ?? products[0];

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      {/* ── Header ── */}
      <div className="flex items-center justify-between bg-slate-50 px-4 py-3">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-left hover:opacity-80"
        >
          {expanded ? (
            <ChevronDown className="h-4 w-4 text-slate-400" />
          ) : (
            <ChevronRight className="h-4 w-4 text-slate-400" />
          )}
          <span className="text-sm font-semibold text-slate-800">{categoryName}</span>
          <Badge className="bg-slate-200 text-[10px] text-slate-600">
            {products.length} urun
          </Badge>
          <span className="text-[10px] text-slate-400">ID: {marketplaceCategoryId}</span>
        </button>

        {/* Mode toggle */}
        <div className="flex overflow-hidden rounded-md border border-slate-200 text-[10px] font-medium">
          <button
            type="button"
            onClick={() => setMode('category')}
            className={`px-3 py-1.5 transition-colors ${
              mode === 'category'
                ? 'bg-violet-600 text-white'
                : 'bg-white text-slate-500 hover:bg-slate-50'
            }`}
          >
            Kategori Bazli
          </button>
          <button
            type="button"
            onClick={() => setMode('product')}
            className={`px-3 py-1.5 transition-colors ${
              mode === 'product'
                ? 'bg-violet-600 text-white'
                : 'bg-white text-slate-500 hover:bg-slate-50'
            }`}
          >
            Urun Bazli
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-slate-200 p-4 space-y-5">
          {/* ── Auto-matched section (green box) ── */}
          {autoMatched.length > 0 && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-3 space-y-2">
              <p className="text-[10px] font-semibold uppercase text-emerald-700">
                Otomatik Eslenen Varyasyon Ozellikleri
              </p>
              {autoMatched.map((attr) => {
                const valueCounts = getVariantValueCounts(attr.attribute.name);
                return (
                  <div key={attr.attribute.id} className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1 text-xs font-medium text-emerald-800">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                      {attr.attribute.name}
                      <span className="text-[9px] text-emerald-500">(Varyant)</span>
                    </div>
                    {valueCounts.map((vc) => (
                      <Badge
                        key={vc.name}
                        className={`text-[9px] ${vc.fromWizard ? 'bg-violet-100 text-violet-700' : 'bg-emerald-100 text-emerald-700'}`}
                      >
                        {vc.name} ({vc.count})
                      </Badge>
                    ))}
                  </div>
                );
              })}
            </div>
          )}

          {/* ── CATEGORY-BASED MODE ── */}
          {mode === 'category' && (
            <>
              {/* Per-product slicer/varianter attributes (Renk, Beden) */}
              {requiredSlicerVarianter.length > 0 && (
                <div>
                  <p className="mb-2 text-[10px] font-semibold uppercase text-amber-600">
                    Urun Bazli Ozellikler (her urun icin ayri deger secin)
                  </p>
                  <div className="space-y-3">
                    {products.map((p) => (
                      <div key={p.id} className="rounded-md border border-slate-100 bg-slate-50/50 p-3">
                        <div className="mb-2 flex items-center gap-2">
                          {(p.images as string[] | undefined)?.[0] && (
                            <img src={(p.images as string[])[0]} alt="" className="h-8 w-8 rounded object-cover" />
                          )}
                          <span className="text-xs font-medium text-slate-700 truncate max-w-[300px]">
                            {locName(p.name, locale)}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {requiredSlicerVarianter.map((attr) => {
                            const val = resolveValue(p.id, attr.attribute.name);
                            return (
                              <AttributeField
                                key={attr.attribute.id}
                                name={attr.attribute.name}
                                required={attr.required}
                                allowCustom={attr.allowCustom}
                                values={attr.attributeValues}
                                value={val.value}
                                valueId={val.valueId}
                                onChange={(v, vid) =>
                                  onProductValueChange(p.id, attr.attribute.name, v, vid)
                                }
                              />
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Required attributes grid (category-level shared) */}
              {fillableRequired.length > 0 && (
                <div>
                  <p className="mb-2 text-[10px] font-semibold uppercase text-slate-400">
                    Zorunlu Ozellikler <span className="text-rose-500">*</span>
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {fillableRequired.map((attr) => {
                      const catVal = categoryValues[attr.attribute.name];
                      return (
                        <AttributeField
                          key={attr.attribute.id}
                          name={attr.attribute.name}
                          required={attr.required}
                          allowCustom={attr.allowCustom}
                          values={attr.attributeValues}
                          value={catVal?.value ?? ''}
                          valueId={catVal?.valueId}
                          onChange={(val, vid) =>
                            onCategoryValueChange(attr.attribute.name, val, vid)
                          }
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Optional attributes (collapsible) */}
              {fillableOptional.length > 0 && (
                <div>
                  <button
                    type="button"
                    onClick={() => setShowOptional(!showOptional)}
                    className="flex items-center gap-1.5 text-[10px] font-semibold uppercase text-slate-400 hover:text-slate-600"
                  >
                    {showOptional ? (
                      <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronRight className="h-3 w-3" />
                    )}
                    Opsiyonel Ozellikler ({fillableOptional.length})
                  </button>
                  {showOptional && (
                    <div className="mt-2 grid grid-cols-3 gap-3">
                      {fillableOptional.map((attr) => {
                        const catVal = categoryValues[attr.attribute.name];
                        return (
                          <AttributeField
                            key={attr.attribute.id}
                            name={attr.attribute.name}
                            required={false}
                            allowCustom={attr.allowCustom}
                            values={attr.attributeValues}
                            value={catVal?.value ?? ''}
                            valueId={catVal?.valueId}
                            onChange={(val, vid) =>
                              onCategoryValueChange(attr.attribute.name, val, vid)
                            }
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* ── PRODUCT-BASED MODE ── */}
          {mode === 'product' && (
            <>
              {/* Filter bar */}
              <div className="flex items-center gap-2 text-[10px] font-medium">
                {(
                  [
                    ['all', `Tumu (${productCounts.all})`],
                    ['missing', `Eksik (${productCounts.missing})`],
                    ['ready', `Hazir (${productCounts.ready})`],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFilterMode(key)}
                    className={`rounded-full px-3 py-1 transition-colors ${
                      filterMode === key
                        ? 'bg-violet-100 text-violet-700'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Product tabs */}
              <div className="flex gap-1 overflow-x-auto pb-1">
                {filteredProducts.map((p) => {
                  const filled = countFilled(p.id);
                  const isActive = p.id === activeProductId;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setActiveProductId(p.id)}
                      className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs transition-colors ${
                        isActive
                          ? 'bg-violet-50 text-violet-700 ring-1 ring-violet-300'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {(p.images as string[] | undefined)?.[0] && (
                        <img src={(p.images as string[])[0]} alt="" className="h-7 w-7 rounded object-cover" />
                      )}
                      <span className="max-w-[120px] truncate">
                        {locName(p.name, locale)}
                      </span>
                      <Badge
                        className={`text-[9px] ${
                          filled === totalFillable
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {filled}/{totalFillable}
                      </Badge>
                    </button>
                  );
                })}
              </div>

              {/* Active product detail */}
              {activeProduct && (
                <div className="rounded-lg border border-slate-100 p-4 space-y-4">
                  {/* Product header */}
                  <div className="flex items-center gap-3">
                    {(activeProduct.images as string[] | undefined)?.[0] && (
                      <img src={(activeProduct.images as string[])[0]} alt="" className="h-14 w-14 rounded-lg border border-slate-200 object-cover" />
                    )}
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {locName(activeProduct.name, locale)}
                      </p>
                      {activeProduct.sku && (
                        <p className="text-[10px] font-mono text-slate-400">
                          SKU: {activeProduct.sku}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Auto-matched chips — show wizard value if set, otherwise variant value */}
                  {autoMatched.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {autoMatched.map((attr) => {
                        // Check wizard value first
                        const wizardVal = resolveValue(activeProduct.id, attr.attribute.name).value;
                        if (wizardVal) {
                          return (
                            <Badge key={attr.attribute.id} className="bg-violet-50 text-[9px] text-violet-600">
                              {attr.attribute.name}: {wizardVal}
                            </Badge>
                          );
                        }
                        // Fallback to variant values
                        const uniqueVals = new Set<string>();
                        for (const v of activeProduct.variants) {
                          const val = v.attributes?.[attr.attribute.name];
                          if (val) uniqueVals.add(val);
                        }
                        return Array.from(uniqueVals).map((val) => (
                          <Badge
                            key={`${attr.attribute.id}-${val}`}
                            className="bg-emerald-50 text-[9px] text-emerald-600"
                          >
                            {attr.attribute.name}: {val}
                          </Badge>
                        ));
                      })}
                    </div>
                  )}

                  {/* Required attributes for this product */}
                  {fillableRequired.length > 0 && (
                    <div>
                      <p className="mb-2 text-[10px] font-semibold uppercase text-slate-400">
                        Zorunlu <span className="text-rose-500">*</span>
                      </p>
                      <div className="grid grid-cols-3 gap-3">
                        {fillableRequired.map((attr) => {
                          const resolved = resolveValue(
                            activeProduct.id,
                            attr.attribute.name,
                          );
                          return (
                            <div key={attr.attribute.id} className="relative">
                              <AttributeField
                                name={attr.attribute.name}
                                required={attr.required}
                                allowCustom={attr.allowCustom}
                                values={attr.attributeValues}
                                value={resolved.value}
                                valueId={resolved.valueId}
                                onChange={(val, vid) =>
                                  onProductValueChange(
                                    activeProduct.id,
                                    attr.attribute.name,
                                    val,
                                    vid,
                                  )
                                }
                              />
                              {resolved.fromCategory && resolved.value !== '' && (
                                <span className="absolute right-1 top-0 text-[8px] text-violet-400">
                                  kategoriden
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Optional attributes for this product */}
                  {fillableOptional.length > 0 && (
                    <div>
                      <button
                        type="button"
                        onClick={() => setShowOptional(!showOptional)}
                        className="flex items-center gap-1.5 text-[10px] font-semibold uppercase text-slate-400 hover:text-slate-600"
                      >
                        {showOptional ? (
                          <ChevronDown className="h-3 w-3" />
                        ) : (
                          <ChevronRight className="h-3 w-3" />
                        )}
                        Opsiyonel ({fillableOptional.length})
                      </button>
                      {showOptional && (
                        <div className="mt-2 grid grid-cols-3 gap-3">
                          {fillableOptional.map((attr) => {
                            const resolved = resolveValue(
                              activeProduct.id,
                              attr.attribute.name,
                            );
                            return (
                              <div key={attr.attribute.id} className="relative">
                                <AttributeField
                                  name={attr.attribute.name}
                                  required={false}
                                  allowCustom={attr.allowCustom}
                                  values={attr.attributeValues}
                                  value={resolved.value}
                                  valueId={resolved.valueId}
                                  onChange={(val, vid) =>
                                    onProductValueChange(
                                      activeProduct.id,
                                      attr.attribute.name,
                                      val,
                                      vid,
                                    )
                                  }
                                />
                                {resolved.fromCategory && resolved.value !== '' && (
                                  <span className="absolute right-1 top-0 text-[8px] text-violet-400">
                                    kategoriden
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
});
