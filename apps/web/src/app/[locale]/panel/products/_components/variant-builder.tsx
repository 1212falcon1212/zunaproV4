'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button, Input, Badge } from '@zunapro/ui';
import { panelApi } from '@/lib/panel-api';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

interface VariantTypeOption {
  id: string;
  name: Record<string, string>;
  slug: string;
  colorCode?: string;
  sortOrder: number;
}

interface VariantType {
  id: string;
  name: Record<string, string>;
  slug: string;
  sortOrder: number;
  options: VariantTypeOption[];
}

interface VariantOptionSelection {
  variantTypeSlug: string;
  variantOptionSlug: string;
  variantTypeName?: string;
  variantOptionName?: string;
}

export interface ProductVariantData {
  sku: string;
  barcode: string;
  price: number;
  listPrice?: number;
  stock: number;
  weight?: number;
  images: string[];
  isActive: boolean;
  options: VariantOptionSelection[];
}

interface VariantBuilderProps {
  variants: ProductVariantData[];
  onChange: (variants: ProductVariantData[]) => void;
  locale: string;
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function locName(name: unknown, locale = 'en'): string {
  if (!name || typeof name !== 'object') return String(name ?? '');
  const rec = name as Record<string, string>;
  return rec[locale] || rec.en || rec.tr || Object.values(rec)[0] || '';
}

const formatTRY = (n: number) =>
  new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(n);

/** Build a unique key from a variant's option combination for matching */
function variantKey(options: VariantOptionSelection[] | undefined | null): string {
  if (!options || !Array.isArray(options)) return '';
  return [...options]
    .sort((a, b) => (a.variantTypeSlug ?? '').localeCompare(b.variantTypeSlug ?? ''))
    .map((o) => `${o.variantTypeSlug}:${o.variantOptionSlug}`)
    .join('|');
}

/** Cartesian product of arrays */
function cartesian<T>(arrays: T[][]): T[][] {
  if (arrays.length === 0) return [];
  return arrays.reduce<T[][]>(
    (acc, curr) => acc.flatMap((combo) => curr.map((item) => [...combo, item])),
    [[]],
  );
}

function makeDefaultVariant(options: VariantOptionSelection[]): ProductVariantData {
  return {
    sku: '',
    barcode: '',
    price: 0,
    stock: 0,
    weight: undefined,
    images: [],
    isActive: true,
    options,
  };
}

/* -------------------------------------------------------------------------- */
/*  Icons (inline SVG)                                                        */
/* -------------------------------------------------------------------------- */

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function VariantBuilder({ variants, onChange, locale }: VariantBuilderProps) {
  const t = useTranslations('panel.products.variants');

  /* ---- API data ---- */
  const [variantTypes, setVariantTypes] = useState<VariantType[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  /* ---- Local selection state ---- */
  const [selectedTypeSlugs, setSelectedTypeSlugs] = useState<string[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<Map<string, Set<string>>>(new Map());
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const [customOptionInputs, setCustomOptionInputs] = useState<Map<string, string>>(new Map());

  /* ---- Bulk action state ---- */
  const [bulkPrice, setBulkPrice] = useState('');
  const [bulkStock, setBulkStock] = useState('');
  const [showBulkActions, setShowBulkActions] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const initializedFromVariants = useRef(false);

  /* ---- Fetch variant types from API ---- */
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    panelApi
      .get<VariantType[]>('/variant-types')
      .then((data) => {
        if (!cancelled) {
          setVariantTypes(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setFetchError(err instanceof Error ? err.message : 'Failed to load variant types');
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  /* ---- Initialize selections from existing variants ---- */
  useEffect(() => {
    if (initializedFromVariants.current || variantTypes.length === 0 || variants.length === 0) return;
    initializedFromVariants.current = true;

    const typeSlugs = new Set<string>();
    const optMap = new Map<string, Set<string>>();

    for (const v of variants) {
      if (!v.options || !Array.isArray(v.options)) continue;
      for (const opt of v.options) {
        if (!opt.variantTypeSlug || !opt.variantOptionSlug) continue;
        typeSlugs.add(opt.variantTypeSlug);
        if (!optMap.has(opt.variantTypeSlug)) {
          optMap.set(opt.variantTypeSlug, new Set());
        }
        optMap.get(opt.variantTypeSlug)!.add(opt.variantOptionSlug);
      }
    }

    setSelectedTypeSlugs(Array.from(typeSlugs));
    setSelectedOptions(optMap);
  }, [variantTypes, variants]);

  /* ---- Close dropdown on outside click ---- */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setTypeDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* ---- Derived: resolved type objects for selected slugs ---- */
  const selectedTypeObjects = useMemo(
    () => selectedTypeSlugs.map((slug) => variantTypes.find((vt) => vt.slug === slug)).filter(Boolean) as VariantType[],
    [selectedTypeSlugs, variantTypes],
  );

  /* ---- Combination count ---- */
  const combinationCount = useMemo(() => {
    const counts = selectedTypeSlugs.map((slug) => selectedOptions.get(slug)?.size ?? 0);
    if (counts.length === 0 || counts.some((c) => c === 0)) return 0;
    return counts.reduce((a, b) => a * b, 1);
  }, [selectedTypeSlugs, selectedOptions]);

  /* ---- Generate variants from selections ---- */
  const regenerateVariants = useCallback(
    (typeSlugs: string[], optionsMap: Map<string, Set<string>>) => {
      const validTypeSlugs = typeSlugs.filter((slug) => (optionsMap.get(slug)?.size ?? 0) > 0);
      if (validTypeSlugs.length === 0) {
        onChange([]);
        return;
      }

      // Build arrays for cartesian product
      const optionArrays: VariantOptionSelection[][] = validTypeSlugs.map((typeSlug) => {
        const typeObj = variantTypes.find((vt) => vt.slug === typeSlug);
        const optSlugs = Array.from(optionsMap.get(typeSlug) ?? []);
        return optSlugs.map((optSlug) => {
          const optObj = typeObj?.options.find((o) => o.slug === optSlug);
          return {
            variantTypeSlug: typeSlug,
            variantOptionSlug: optSlug,
            variantTypeName: typeObj ? locName(typeObj.name, locale) : typeSlug,
            variantOptionName: optObj ? locName(optObj.name, locale) : optSlug,
          };
        });
      });

      const combos = cartesian(optionArrays);

      // Build lookup of existing variants by key
      const existingByKey = new Map<string, ProductVariantData>();
      for (const v of variants) {
        existingByKey.set(variantKey(v.options), v);
      }

      const newVariants: ProductVariantData[] = combos.map((combo) => {
        const key = variantKey(combo);
        const existing = existingByKey.get(key);
        if (existing) {
          return { ...existing, options: combo };
        }
        return makeDefaultVariant(combo);
      });

      onChange(newVariants);
    },
    [variantTypes, variants, onChange, locale],
  );

  /* ---- Handlers ---- */

  const handleAddType = (typeSlug: string) => {
    if (selectedTypeSlugs.includes(typeSlug)) return;
    const next = [...selectedTypeSlugs, typeSlug];
    setSelectedTypeSlugs(next);
    setTypeDropdownOpen(false);
  };

  const handleRemoveType = (typeSlug: string) => {
    const nextSlugs = selectedTypeSlugs.filter((s) => s !== typeSlug);
    const nextOpts = new Map(selectedOptions);
    nextOpts.delete(typeSlug);
    setSelectedTypeSlugs(nextSlugs);
    setSelectedOptions(nextOpts);
    regenerateVariants(nextSlugs, nextOpts);
  };

  const handleToggleOption = (typeSlug: string, optionSlug: string) => {
    const nextOpts = new Map(selectedOptions);
    const set = new Set(nextOpts.get(typeSlug) ?? []);
    if (set.has(optionSlug)) {
      set.delete(optionSlug);
    } else {
      set.add(optionSlug);
    }
    nextOpts.set(typeSlug, set);
    setSelectedOptions(nextOpts);
    regenerateVariants(selectedTypeSlugs, nextOpts);
  };

  const handleAddCustomOption = (typeSlug: string) => {
    const value = (customOptionInputs.get(typeSlug) ?? '').trim();
    if (!value) return;

    const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (!slug) return;

    // Add to type options locally
    setVariantTypes((prev) =>
      prev.map((vt) => {
        if (vt.slug !== typeSlug) return vt;
        if (vt.options.some((o) => o.slug === slug)) return vt;
        return {
          ...vt,
          options: [
            ...vt.options,
            {
              id: `custom-${slug}`,
              name: { [locale]: value, en: value },
              slug,
              sortOrder: vt.options.length,
            },
          ],
        };
      }),
    );

    // Auto-select the new option
    const nextOpts = new Map(selectedOptions);
    const set = new Set(nextOpts.get(typeSlug) ?? []);
    set.add(slug);
    nextOpts.set(typeSlug, set);
    setSelectedOptions(nextOpts);

    // Clear input
    setCustomOptionInputs((prev) => {
      const next = new Map(prev);
      next.delete(typeSlug);
      return next;
    });

    regenerateVariants(selectedTypeSlugs, nextOpts);
  };

  const handleVariantFieldChange = (index: number, field: keyof ProductVariantData, value: unknown) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleBulkPrice = () => {
    const price = parseFloat(bulkPrice);
    if (isNaN(price) || price < 0) return;
    onChange(variants.map((v) => ({ ...v, price })));
    setBulkPrice('');
  };

  const handleBulkStock = () => {
    const stock = parseInt(bulkStock, 10);
    if (isNaN(stock) || stock < 0) return;
    onChange(variants.map((v) => ({ ...v, stock })));
    setBulkStock('');
  };

  /* ---- Available (unselected) types ---- */
  const availableTypes = variantTypes.filter((vt) => !selectedTypeSlugs.includes(vt.slug));

  /* ---- Loading state ---- */
  if (loading) {
    return (
      <div className="flex items-center gap-2 py-8">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-violet-600 border-t-transparent" />
        <span className="text-sm text-slate-500">Loading variant types...</span>
      </div>
    );
  }

  /* ---- Error state ---- */
  if (fetchError) {
    return (
      <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        {fetchError}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* ================================================================= */}
      {/*  Step 1: Select Variant Types                                      */}
      {/* ================================================================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Variant Types
          </h3>

          {/* Add Type Dropdown */}
          {availableTypes.length > 0 && (
            <div className="relative" ref={dropdownRef}>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 text-xs"
                onClick={() => setTypeDropdownOpen(!typeDropdownOpen)}
              >
                <PlusIcon className="h-3.5 w-3.5" />
                Add Variant Type
                <ChevronDownIcon className="h-3 w-3" />
              </Button>

              {typeDropdownOpen && (
                <div className="absolute right-0 z-50 mt-1 w-56 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                  {availableTypes.map((vt) => (
                    <button
                      key={vt.slug}
                      type="button"
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                      onClick={() => handleAddType(vt.slug)}
                    >
                      {locName(vt.name, locale)}
                      <span className="ml-auto text-xs text-slate-400">
                        {vt.options.length} options
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Selected types as pills */}
        {selectedTypeSlugs.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedTypeSlugs.map((slug) => {
              const typeObj = variantTypes.find((vt) => vt.slug === slug);
              return (
                <Badge
                  key={slug}
                  className="flex items-center gap-1.5 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700"
                >
                  {typeObj ? locName(typeObj.name, locale) : slug}
                  <button
                    type="button"
                    onClick={() => handleRemoveType(slug)}
                    className="ml-0.5 rounded-full p-0.5 hover:bg-violet-200"
                  >
                    <XIcon className="h-3 w-3" />
                  </button>
                </Badge>
              );
            })}
          </div>
        )}

        {/* No types selected placeholder */}
        {selectedTypeSlugs.length === 0 && (
          <p className="text-sm text-slate-400">
            Select variant types to create product variants (e.g. Color, Size).
          </p>
        )}
      </div>

      {/* ================================================================= */}
      {/*  Step 1b: Select Options per Type                                  */}
      {/* ================================================================= */}
      {selectedTypeObjects.length > 0 && (
        <div className="space-y-4">
          {selectedTypeObjects.map((typeObj) => {
            const selectedSet = selectedOptions.get(typeObj.slug) ?? new Set<string>();
            const customInput = customOptionInputs.get(typeObj.slug) ?? '';

            return (
              <div key={typeObj.slug} className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
                <h4 className="mb-3 text-xs font-semibold text-slate-600">
                  {locName(typeObj.name, locale)}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {typeObj.options.map((opt) => {
                    const isSelected = selectedSet.has(opt.slug);
                    const hasColor = !!opt.colorCode;

                    return (
                      <button
                        key={opt.slug}
                        type="button"
                        onClick={() => handleToggleOption(typeObj.slug, opt.slug)}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                          isSelected
                            ? 'border-violet-300 bg-violet-100 text-violet-800 shadow-sm'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {hasColor && (
                          <span
                            className="inline-block h-3.5 w-3.5 rounded-full border border-slate-200"
                            style={{ backgroundColor: opt.colorCode }}
                          />
                        )}
                        {locName(opt.name, locale)}
                        {isSelected && (
                          <svg className="h-3 w-3 text-violet-600" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </button>
                    );
                  })}

                  {/* Add custom option inline */}
                  <div className="inline-flex items-center gap-1">
                    <Input
                      value={customInput}
                      onChange={(e) =>
                        setCustomOptionInputs((prev) => new Map(prev).set(typeObj.slug, e.target.value))
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomOption(typeObj.slug);
                        }
                      }}
                      placeholder="New option..."
                      className="h-8 w-28 text-xs"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 px-2"
                      onClick={() => handleAddCustomOption(typeObj.slug)}
                    >
                      <PlusIcon className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================================================================= */}
      {/*  Step 2: Combination Preview                                       */}
      {/* ================================================================= */}
      {selectedTypeSlugs.length > 0 && combinationCount > 0 && (
        <div className="flex items-center gap-2 rounded-lg border border-violet-200 bg-violet-50/50 px-4 py-2.5">
          <svg className="h-4 w-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm text-violet-700">
            <strong>{combinationCount}</strong> variant combination{combinationCount !== 1 ? 's' : ''} will be created
          </span>
        </div>
      )}

      {/* ================================================================= */}
      {/*  Step 3: Variant Table                                             */}
      {/* ================================================================= */}
      {variants.length > 0 && (
        <div className="space-y-3">
          {/* Bulk Actions */}
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Variants ({variants.length})
            </h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={() => setShowBulkActions(!showBulkActions)}
            >
              {showBulkActions ? 'Hide' : 'Bulk Actions'}
            </Button>
          </div>

          {showBulkActions && (
            <div className="flex flex-wrap gap-3 rounded-lg border border-slate-200 bg-slate-50/50 p-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500">Set all prices:</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-slate-400">&#8378;</span>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={bulkPrice}
                    onChange={(e) => setBulkPrice(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleBulkPrice();
                      }
                    }}
                    placeholder="0.00"
                    className="h-7 w-24 text-xs"
                  />
                  <Button type="button" variant="outline" size="sm" className="h-7 px-2 text-xs" onClick={handleBulkPrice}>
                    Apply
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500">Set all stock:</span>
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    min="0"
                    value={bulkStock}
                    onChange={(e) => setBulkStock(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleBulkStock();
                      }
                    }}
                    placeholder="0"
                    className="h-7 w-20 text-xs"
                  />
                  <Button type="button" variant="outline" size="sm" className="h-7 px-2 text-xs" onClick={handleBulkStock}>
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    {selectedTypeObjects.map((typeObj) => (
                      <th
                        key={typeObj.slug}
                        className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600"
                      >
                        {locName(typeObj.name, locale)}
                      </th>
                    ))}
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600">
                      Price (&#8378;)
                    </th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600">
                      Stock
                    </th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600">
                      Barcode
                    </th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600">
                      SKU
                    </th>
                    <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-600">
                      Active
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {variants.map((variant, index) => (
                    <tr key={variantKey(variant.options) || `v-${index}`} className="hover:bg-slate-50/50">
                      {/* Option columns */}
                      {selectedTypeObjects.map((typeObj) => {
                        const opt = (variant.options ?? []).find(
                          (o) => o.variantTypeSlug === typeObj.slug,
                        );
                        const optObj = typeObj.options.find(
                          (o) => o.slug === opt?.variantOptionSlug,
                        );
                        const hasColor = !!optObj?.colorCode;

                        return (
                          <td key={typeObj.slug} className="px-3 py-2">
                            <div className="flex items-center gap-1.5">
                              {hasColor && (
                                <span
                                  className="inline-block h-4 w-4 rounded-full border border-slate-200"
                                  style={{ backgroundColor: optObj!.colorCode }}
                                />
                              )}
                              <span className="text-xs font-medium text-slate-700">
                                {opt?.variantOptionName || locName(optObj?.name, locale) || opt?.variantOptionSlug || '-'}
                              </span>
                            </div>
                          </td>
                        );
                      })}

                      {/* Price */}
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-slate-400">&#8378;</span>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={variant.price || ''}
                            onChange={(e) =>
                              handleVariantFieldChange(index, 'price', parseFloat(e.target.value) || 0)
                            }
                            className="h-8 w-24 text-right text-xs"
                          />
                        </div>
                      </td>

                      {/* Stock */}
                      <td className="px-3 py-2">
                        <Input
                          type="number"
                          min="0"
                          value={variant.stock || ''}
                          onChange={(e) =>
                            handleVariantFieldChange(index, 'stock', parseInt(e.target.value, 10) || 0)
                          }
                          className={`h-8 w-20 text-right text-xs ${variant.stock > 0 ? '' : 'text-rose-500'}`}
                        />
                      </td>

                      {/* Barcode */}
                      <td className="px-3 py-2">
                        <Input
                          value={variant.barcode}
                          onChange={(e) => handleVariantFieldChange(index, 'barcode', e.target.value)}
                          placeholder="EAN/UPC"
                          className="h-8 w-32 font-mono text-xs"
                        />
                      </td>

                      {/* SKU */}
                      <td className="px-3 py-2">
                        <Input
                          value={variant.sku}
                          onChange={(e) => handleVariantFieldChange(index, 'sku', e.target.value)}
                          placeholder="SKU"
                          className="h-8 w-28 font-mono text-xs"
                        />
                      </td>

                      {/* Active toggle */}
                      <td className="px-3 py-2 text-center">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={variant.isActive}
                          onClick={() => handleVariantFieldChange(index, 'isActive', !variant.isActive)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                            variant.isActive ? 'bg-violet-600' : 'bg-slate-200'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                              variant.isActive ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary */}
          {variants.length > 0 && (
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <span>
                Total stock:{' '}
                <strong className="text-slate-700">
                  {variants.reduce((s, v) => s + v.stock, 0)}
                </strong>
              </span>
              {variants.some((v) => v.price > 0) && (
                <span>
                  Price range:{' '}
                  <strong className="text-slate-700">
                    {formatTRY(Math.min(...variants.filter((v) => v.price > 0).map((v) => v.price)))}
                    {' '}--{' '}
                    {formatTRY(Math.max(...variants.map((v) => v.price)))}
                  </strong>
                </span>
              )}
              <span>
                Active:{' '}
                <strong className="text-slate-700">
                  {variants.filter((v) => v.isActive).length}/{variants.length}
                </strong>
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
