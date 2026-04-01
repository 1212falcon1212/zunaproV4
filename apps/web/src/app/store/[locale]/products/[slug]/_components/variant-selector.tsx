'use client';

import { useMemo, useCallback } from 'react';
import { useTranslations } from 'next-intl';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ProductVariantDisplay {
  id: string;
  sku?: string | null;
  barcode?: string | null;
  price: number;
  listPrice?: number | null;
  stock: number;
  images: string[];
  isActive: boolean;
  optionValues: Array<{
    variantOption: {
      slug: string;
      name: Record<string, string>;
      colorCode?: string;
      variantType: {
        slug: string;
        name: Record<string, string>;
      };
    };
  }>;
}

interface VariantType {
  slug: string;
  name: Record<string, string>;
}

interface VariantOptionItem {
  slug: string;
  name: Record<string, string>;
  colorCode?: string;
  type: VariantType;
}

export interface VariantSelectorProps {
  variants: ProductVariantDisplay[];
  locale: string;
  onVariantSelect: (variant: ProductVariantDisplay | null) => void;
  selectedVariant: ProductVariantDisplay | null;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const COLOR_SLUGS = new Set(['renk', 'color', 'colour', 'farbe', 'couleur']);
const SIZE_SLUGS = new Set(['beden', 'size', 'taille', 'grosse', 'talla']);

function isColorType(slug: string): boolean {
  return COLOR_SLUGS.has(slug.toLowerCase());
}

function isSizeType(slug: string): boolean {
  return SIZE_SLUGS.has(slug.toLowerCase());
}

function getLocalizedName(name: Record<string, string>, locale: string): string {
  return name[locale] ?? name.en ?? Object.values(name)[0] ?? '';
}

/**
 * Build a map: typeSlug -> unique options (preserving order of first appearance)
 */
function extractOptionGroups(variants: ProductVariantDisplay[]) {
  const typeMap = new Map<string, { type: VariantType; options: Map<string, VariantOptionItem> }>();

  for (const variant of variants) {
    for (const ov of variant.optionValues) {
      const typeSlug = ov.variantOption.variantType.slug;
      if (!typeMap.has(typeSlug)) {
        typeMap.set(typeSlug, {
          type: ov.variantOption.variantType,
          options: new Map(),
        });
      }
      const group = typeMap.get(typeSlug)!;
      if (!group.options.has(ov.variantOption.slug)) {
        group.options.set(ov.variantOption.slug, {
          slug: ov.variantOption.slug,
          name: ov.variantOption.name,
          colorCode: ov.variantOption.colorCode,
          type: ov.variantOption.variantType,
        });
      }
    }
  }

  return Array.from(typeMap.entries()).map(([typeSlug, { type, options }]) => ({
    typeSlug,
    type,
    options: Array.from(options.values()),
  }));
}

/**
 * Given all variants and current selections, find whether a specific option
 * is available (leads to at least one in-stock variant).
 */
function isOptionAvailable(
  variants: ProductVariantDisplay[],
  selections: Record<string, string>,
  typeSlug: string,
  optionSlug: string,
): boolean {
  const testSelections = { ...selections, [typeSlug]: optionSlug };

  return variants.some((v) => {
    if (v.stock <= 0) return false;
    return Object.entries(testSelections).every(([tSlug, oSlug]) =>
      v.optionValues.some(
        (ov) =>
          ov.variantOption.variantType.slug === tSlug &&
          ov.variantOption.slug === oSlug,
      ),
    );
  });
}

/**
 * Find the variant matching all current selections exactly.
 */
function findMatchingVariant(
  variants: ProductVariantDisplay[],
  selections: Record<string, string>,
  totalTypes: number,
): ProductVariantDisplay | null {
  const selectionEntries = Object.entries(selections);
  if (selectionEntries.length < totalTypes) return null;

  return (
    variants.find((v) =>
      selectionEntries.every(([tSlug, oSlug]) =>
        v.optionValues.some(
          (ov) =>
            ov.variantOption.variantType.slug === tSlug &&
            ov.variantOption.slug === oSlug,
        ),
      ),
    ) ?? null
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function VariantSelector({
  variants,
  locale,
  onVariantSelect,
  selectedVariant,
}: VariantSelectorProps) {
  const t = useTranslations('storefront');

  const optionGroups = useMemo(() => extractOptionGroups(variants), [variants]);

  // Derive current selections from the selectedVariant
  const selections = useMemo(() => {
    const map: Record<string, string> = {};
    if (selectedVariant) {
      for (const ov of selectedVariant.optionValues) {
        map[ov.variantOption.variantType.slug] = ov.variantOption.slug;
      }
    }
    return map;
  }, [selectedVariant]);

  const handleSelect = useCallback(
    (typeSlug: string, optionSlug: string) => {
      const newSelections = { ...selections, [typeSlug]: optionSlug };

      // Toggle off if clicking the same option
      if (selections[typeSlug] === optionSlug) {
        delete newSelections[typeSlug];
        // Try to find partial match or null
        const match = findMatchingVariant(variants, newSelections, optionGroups.length);
        onVariantSelect(match);
        return;
      }

      const match = findMatchingVariant(variants, newSelections, optionGroups.length);
      onVariantSelect(match);
    },
    [selections, variants, optionGroups.length, onVariantSelect],
  );

  if (variants.length === 0 || optionGroups.length === 0) return null;

  return (
    <div className="space-y-5">
      {optionGroups.map((group) => {
        const typeName = getLocalizedName(group.type.name, locale);
        const selectedOptionSlug = selections[group.typeSlug];
        const selectedOption = group.options.find((o) => o.slug === selectedOptionSlug);
        const selectedOptionName = selectedOption
          ? getLocalizedName(selectedOption.name, locale)
          : null;

        return (
          <div key={group.typeSlug}>
            <div className="mb-2 flex items-center gap-2">
              <span className="text-sm font-medium text-[var(--color-foreground)]">
                {typeName}
              </span>
              {selectedOptionName && (
                <span className="text-sm text-[var(--color-secondary)]">
                  — {selectedOptionName}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {isColorType(group.typeSlug)
                ? group.options.map((option) => (
                    <ColorSwatch
                      key={option.slug}
                      option={option}
                      locale={locale}
                      isSelected={selectedOptionSlug === option.slug}
                      isAvailable={isOptionAvailable(variants, selections, group.typeSlug, option.slug)}
                      onSelect={() => handleSelect(group.typeSlug, option.slug)}
                    />
                  ))
                : isSizeType(group.typeSlug)
                  ? group.options.map((option) => (
                      <SizeButton
                        key={option.slug}
                        option={option}
                        locale={locale}
                        isSelected={selectedOptionSlug === option.slug}
                        isAvailable={isOptionAvailable(variants, selections, group.typeSlug, option.slug)}
                        onSelect={() => handleSelect(group.typeSlug, option.slug)}
                      />
                    ))
                  : group.options.map((option) => (
                      <TextButton
                        key={option.slug}
                        option={option}
                        locale={locale}
                        isSelected={selectedOptionSlug === option.slug}
                        isAvailable={isOptionAvailable(variants, selections, group.typeSlug, option.slug)}
                        onSelect={() => handleSelect(group.typeSlug, option.slug)}
                      />
                    ))}
            </div>
          </div>
        );
      })}

      {/* Show out of stock for selected variant */}
      {selectedVariant && selectedVariant.stock <= 0 && (
        <p className="text-sm font-medium text-red-600">
          {t('product.outOfStock')}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

interface OptionButtonProps {
  option: VariantOptionItem;
  locale: string;
  isSelected: boolean;
  isAvailable: boolean;
  onSelect: () => void;
}

function ColorSwatch({ option, locale, isSelected, isAvailable, onSelect }: OptionButtonProps) {
  const label = getLocalizedName(option.name, locale);
  const bgColor = option.colorCode || '#ccc';

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={!isAvailable}
      title={label}
      aria-label={label}
      aria-pressed={isSelected}
      className={`
        relative h-9 w-9 rounded-full border-2 transition-all
        ${isSelected
          ? 'ring-2 ring-[var(--color-primary)] ring-offset-2 border-[var(--color-primary)]'
          : 'border-[var(--color-border)] hover:border-[var(--color-primary)]'
        }
        ${!isAvailable ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
      `}
      style={{ backgroundColor: bgColor }}
    >
      {/* Check mark for selected */}
      {isSelected && (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg className="h-4 w-4 drop-shadow-sm" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 13l4 4L19 7" />
          </svg>
        </span>
      )}
      {/* Strikethrough for unavailable */}
      {!isAvailable && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="block h-[2px] w-full rotate-45 bg-red-500 opacity-70" />
        </span>
      )}
    </button>
  );
}

function SizeButton({ option, locale, isSelected, isAvailable, onSelect }: OptionButtonProps) {
  const label = getLocalizedName(option.name, locale);

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={!isAvailable}
      aria-pressed={isSelected}
      className={`
        min-w-[2.5rem] rounded-md border px-3 py-1.5 text-sm font-medium transition-all
        ${isSelected
          ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
          : 'border-[var(--color-border)] text-[var(--color-foreground)] hover:border-[var(--color-primary)]'
        }
        ${!isAvailable ? 'opacity-40 cursor-not-allowed line-through' : 'cursor-pointer'}
      `}
    >
      {label}
    </button>
  );
}

function TextButton({ option, locale, isSelected, isAvailable, onSelect }: OptionButtonProps) {
  const label = getLocalizedName(option.name, locale);

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={!isAvailable}
      aria-pressed={isSelected}
      className={`
        rounded-[var(--radius)] border px-4 py-2 text-sm font-medium transition-all
        ${isSelected
          ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
          : 'border-[var(--color-border)] text-[var(--color-foreground)] hover:border-[var(--color-primary)]'
        }
        ${!isAvailable ? 'opacity-40 cursor-not-allowed line-through' : 'cursor-pointer'}
      `}
    >
      {label}
    </button>
  );
}
