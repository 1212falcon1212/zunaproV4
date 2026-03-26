'use client';

import { useCallback } from 'react';
import { usePageBuilderStore } from '@/lib/stores/page-builder-store';
import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Separator,
} from '@zunapro/ui';
import { X, Plus, Trash2 } from 'lucide-react';
import type { Block, BlockStyle } from '@zunapro/types';

const LOCALES = ['en', 'de', 'fr', 'es', 'tr'] as const;
const LOCALE_LABELS: Record<string, string> = {
  en: 'EN',
  de: 'DE',
  fr: 'FR',
  es: 'ES',
  tr: 'TR',
};

interface BlockSettingsPanelProps {
  locale: string;
}

export function BlockSettingsPanel({ locale }: BlockSettingsPanelProps) {
  const { selectedBlockId, selectBlock, getSelectedBlock, updateBlockProps, updateBlockStyle } =
    usePageBuilderStore();

  const selectedBlock = getSelectedBlock();

  if (!selectedBlockId || !selectedBlock) {
    return (
      <aside className="flex w-72 shrink-0 flex-col border-l border-slate-200 bg-white">
        <div className="flex flex-1 items-center justify-center p-6 text-center">
          <div className="text-slate-400">
            <p className="text-sm font-medium">No block selected</p>
            <p className="mt-1 text-xs">Click a block on the canvas to edit its settings.</p>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="flex w-72 shrink-0 flex-col border-l border-slate-200 bg-white">
      {/* Header */}
      <div className="flex h-10 items-center justify-between border-b border-slate-200 px-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {getBlockTypeLabel(selectedBlock.type)}
        </h3>
        <button
          onClick={() => selectBlock(null)}
          className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="content" className="flex flex-1 flex-col overflow-hidden">
        <TabsList className="mx-4 mt-3 grid w-auto grid-cols-2">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="flex-1 overflow-y-auto px-4 pb-4">
          <ContentSettings block={selectedBlock} onUpdate={updateBlockProps} />
        </TabsContent>

        <TabsContent value="style" className="flex-1 overflow-y-auto px-4 pb-4">
          <StyleSettings
            block={selectedBlock}
            onUpdate={updateBlockStyle}
          />
        </TabsContent>
      </Tabs>
    </aside>
  );
}

// ─── Content Settings ────────────────────────────────────────────────────────

interface ContentSettingsProps {
  block: Block;
  onUpdate: (blockId: string, props: Record<string, unknown>) => void;
}

function ContentSettings({ block, onUpdate }: ContentSettingsProps) {
  const updateProp = useCallback(
    (key: string, value: unknown) => {
      onUpdate(block.id, { [key]: value });
    },
    [block.id, onUpdate],
  );

  const updateLocalizedProp = useCallback(
    (key: string, locale: string, value: string) => {
      const current = (block.props[key] as Record<string, string>) ?? {};
      onUpdate(block.id, { [key]: { ...current, [locale]: value } });
    },
    [block.id, block.props, onUpdate],
  );

  switch (block.type) {
    case 'text':
      return (
        <div className="space-y-4 pt-3">
          <LocalizedTextarea
            label="Content"
            propKey="content"
            value={block.props.content}
            onChange={updateLocalizedProp}
          />
          <div>
            <Label className="text-xs">Tag</Label>
            <Select
              value={(block.props.tag as string) || 'p'}
              onValueChange={(v) => updateProp('tag', v)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="p">Paragraph</SelectItem>
                <SelectItem value="h1">Heading 1</SelectItem>
                <SelectItem value="h2">Heading 2</SelectItem>
                <SelectItem value="h3">Heading 3</SelectItem>
                <SelectItem value="h4">Heading 4</SelectItem>
                <SelectItem value="h5">Heading 5</SelectItem>
                <SelectItem value="h6">Heading 6</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );

    case 'image':
      return (
        <div className="space-y-4 pt-3">
          <FieldInput
            label="Image URL"
            value={(block.props.src as string) ?? ''}
            onChange={(v) => updateProp('src', v)}
            placeholder="https://..."
          />
          <LocalizedInput
            label="Alt Text"
            propKey="alt"
            value={block.props.alt}
            onChange={updateLocalizedProp}
          />
          <FieldInput
            label="Link"
            value={(block.props.link as string) ?? ''}
            onChange={(v) => updateProp('link', v)}
            placeholder="https://..."
          />
          <FieldInput
            label="Width"
            value={(block.props.width as string) ?? '100%'}
            onChange={(v) => updateProp('width', v)}
            placeholder="100%, 500px, etc."
          />
        </div>
      );

    case 'hero':
      return (
        <div className="space-y-4 pt-3">
          <LocalizedInput
            label="Title"
            propKey="title"
            value={block.props.title}
            onChange={updateLocalizedProp}
          />
          <LocalizedInput
            label="Subtitle"
            propKey="subtitle"
            value={block.props.subtitle}
            onChange={updateLocalizedProp}
          />
          <LocalizedInput
            label="Button Text"
            propKey="buttonText"
            value={block.props.buttonText}
            onChange={updateLocalizedProp}
          />
          <FieldInput
            label="Button Link"
            value={(block.props.buttonLink as string) ?? ''}
            onChange={(v) => updateProp('buttonLink', v)}
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="secondaryButton"
              checked={!!block.props.secondaryButton}
              onChange={(e) => updateProp('secondaryButton', e.target.checked)}
              className="h-4 w-4 rounded border-slate-300"
            />
            <Label htmlFor="secondaryButton" className="text-xs">
              Show secondary button
            </Label>
          </div>
          <FieldInput
            label="Background Image"
            value={(block.props.backgroundImage as string) ?? ''}
            onChange={(v) => updateProp('backgroundImage', v)}
            placeholder="https://..."
          />
          <div>
            <Label className="text-xs">Overlay Opacity</Label>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={(block.props.overlayOpacity as number) ?? 0.5}
                onChange={(e) =>
                  updateProp('overlayOpacity', parseFloat(e.target.value))
                }
                className="flex-1"
              />
              <span className="w-10 text-right text-xs text-slate-500">
                {Math.round(((block.props.overlayOpacity as number) ?? 0.5) * 100)}%
              </span>
            </div>
          </div>
        </div>
      );

    case 'button':
      return (
        <div className="space-y-4 pt-3">
          <LocalizedInput
            label="Text"
            propKey="text"
            value={block.props.text}
            onChange={updateLocalizedProp}
          />
          <FieldInput
            label="Link"
            value={(block.props.link as string) ?? ''}
            onChange={(v) => updateProp('link', v)}
          />
          <div>
            <Label className="text-xs">Variant</Label>
            <Select
              value={(block.props.variant as string) || 'primary'}
              onValueChange={(v) => updateProp('variant', v)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="primary">Primary</SelectItem>
                <SelectItem value="secondary">Secondary</SelectItem>
                <SelectItem value="outline">Outline</SelectItem>
                <SelectItem value="ghost">Ghost</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Size</Label>
            <Select
              value={(block.props.size as string) || 'md'}
              onValueChange={(v) => updateProp('size', v)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sm">Small</SelectItem>
                <SelectItem value="md">Medium</SelectItem>
                <SelectItem value="lg">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Alignment</Label>
            <Select
              value={(block.props.align as string) || 'center'}
              onValueChange={(v) => updateProp('align', v)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );

    case 'spacer':
      return (
        <div className="space-y-4 pt-3">
          <FieldInput
            label="Height"
            value={(block.props.height as string) ?? '40px'}
            onChange={(v) => updateProp('height', v)}
            placeholder="40px, 2rem, etc."
          />
        </div>
      );

    case 'divider':
      return (
        <div className="space-y-4 pt-3">
          <FieldInput
            label="Color"
            value={(block.props.color as string) ?? '#e2e8f0'}
            onChange={(v) => updateProp('color', v)}
            type="color"
          />
          <FieldInput
            label="Thickness"
            value={(block.props.thickness as string) ?? '1px'}
            onChange={(v) => updateProp('thickness', v)}
            placeholder="1px, 2px, etc."
          />
          <div>
            <Label className="text-xs">Style</Label>
            <Select
              value={(block.props.style as string) || 'solid'}
              onValueChange={(v) => updateProp('style', v)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solid">Solid</SelectItem>
                <SelectItem value="dashed">Dashed</SelectItem>
                <SelectItem value="dotted">Dotted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );

    case 'columns':
      return (
        <div className="space-y-4 pt-3">
          <div>
            <Label className="text-xs">Columns</Label>
            <Select
              value={String((block.props.columns as number) || 2)}
              onValueChange={(v) => updateProp('columns', parseInt(v, 10))}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Column</SelectItem>
                <SelectItem value="2">2 Columns</SelectItem>
                <SelectItem value="3">3 Columns</SelectItem>
                <SelectItem value="4">4 Columns</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <FieldInput
            label="Gap"
            value={(block.props.gap as string) ?? '16px'}
            onChange={(v) => updateProp('gap', v)}
            placeholder="16px, 1rem, etc."
          />
        </div>
      );

    case 'container':
      return (
        <div className="space-y-4 pt-3">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="fullWidth"
              checked={!!block.props.fullWidth}
              onChange={(e) => updateProp('fullWidth', e.target.checked)}
              className="h-4 w-4 rounded border-slate-300"
            />
            <Label htmlFor="fullWidth" className="text-xs">
              Full Width
            </Label>
          </div>
        </div>
      );

    case 'product-showcase':
      return (
        <div className="space-y-4 pt-3">
          <LocalizedInput
            label="Title"
            propKey="title"
            value={block.props.title}
            onChange={updateLocalizedProp}
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={(block.props.featuredOnly as boolean) ?? false}
              onChange={(e) => updateProp('featuredOnly', e.target.checked)}
              className="rounded"
            />
            <Label className="text-xs">Featured products only</Label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={(block.props.showViewAll as boolean) ?? true}
              onChange={(e) => updateProp('showViewAll', e.target.checked)}
              className="rounded"
            />
            <Label className="text-xs">Show &quot;View All&quot; button</Label>
          </div>
          <FieldInput
            label="Product Limit"
            value={String((block.props.limit as number) ?? 10)}
            onChange={(v) => updateProp('limit', parseInt(v, 10) || 10)}
            type="number"
          />
          <FieldInput
            label="Category ID"
            value={(block.props.categoryId as string) ?? ''}
            onChange={(v) => updateProp('categoryId', v)}
            placeholder="Leave empty for all"
          />
          <div>
            <Label className="text-xs">Columns</Label>
            <Select
              value={String((block.props.columns as number) || 5)}
              onValueChange={(v) => updateProp('columns', parseInt(v, 10))}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 Columns</SelectItem>
                <SelectItem value="4">4 Columns</SelectItem>
                <SelectItem value="5">5 Columns</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <FieldInput
            label="View All Link"
            value={(block.props.viewAllLink as string) ?? '/products'}
            onChange={(v) => updateProp('viewAllLink', v)}
          />
        </div>
      );

    case 'category-showcase':
      return (
        <div className="space-y-4 pt-3">
          <LocalizedInput
            label="Title"
            propKey="title"
            value={block.props.title}
            onChange={updateLocalizedProp}
          />
          <div>
            <Label className="text-xs">Layout</Label>
            <Select
              value={(block.props.layout as string) || 'carousel'}
              onValueChange={(v) => updateProp('layout', v)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="carousel">Carousel (circular icons)</SelectItem>
                <SelectItem value="grid">Grid (cards)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={(block.props.featuredOnly as boolean) ?? true}
              onChange={(e) => updateProp('featuredOnly', e.target.checked)}
              className="rounded"
            />
            <Label className="text-xs">Featured categories only</Label>
          </div>
          <FieldInput
            label="Limit"
            value={String((block.props.limit as number) ?? 10)}
            onChange={(v) => updateProp('limit', parseInt(v, 10) || 10)}
            type="number"
          />
          {(block.props.layout as string) === 'grid' && (
            <div>
              <Label className="text-xs">Columns</Label>
              <Select
                value={String((block.props.columns as number) || 3)}
                onValueChange={(v) => updateProp('columns', parseInt(v, 10))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 Columns</SelectItem>
                  <SelectItem value="3">3 Columns</SelectItem>
                  <SelectItem value="4">4 Columns</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      );

    case 'product-listing':
      return (
        <div className="space-y-4 pt-3">
          <LocalizedInput
            label="Title"
            propKey="title"
            value={block.props.title}
            onChange={updateLocalizedProp}
          />
          <div>
            <Label className="text-xs">Columns</Label>
            <Select
              value={String((block.props.columns as number) || 4)}
              onValueChange={(v) => updateProp('columns', parseInt(v, 10))}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 Columns</SelectItem>
                <SelectItem value="4">4 Columns</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Products Per Page</Label>
            <Select
              value={String((block.props.productsPerPage as number) || 12)}
              onValueChange={(v) => updateProp('productsPerPage', parseInt(v, 10))}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="24">24</SelectItem>
                <SelectItem value="48">48</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showFilters"
              checked={block.props.showFilters !== false}
              onChange={(e) => updateProp('showFilters', e.target.checked)}
              className="h-4 w-4 rounded border-slate-300"
            />
            <Label htmlFor="showFilters" className="text-xs">
              Show Filters
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showSearch"
              checked={block.props.showSearch !== false}
              onChange={(e) => updateProp('showSearch', e.target.checked)}
              className="h-4 w-4 rounded border-slate-300"
            />
            <Label htmlFor="showSearch" className="text-xs">
              Show Search
            </Label>
          </div>
        </div>
      );

    case 'category-listing':
      return (
        <div className="space-y-4 pt-3">
          <LocalizedInput
            label="Title"
            propKey="title"
            value={block.props.title}
            onChange={updateLocalizedProp}
          />
          <div>
            <Label className="text-xs">Columns</Label>
            <Select
              value={String((block.props.columns as number) || 4)}
              onValueChange={(v) => updateProp('columns', parseInt(v, 10))}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 Columns</SelectItem>
                <SelectItem value="4">4 Columns</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showProductCount"
              checked={block.props.showProductCount !== false}
              onChange={(e) => updateProp('showProductCount', e.target.checked)}
              className="h-4 w-4 rounded border-slate-300"
            />
            <Label htmlFor="showProductCount" className="text-xs">
              Show Product Count
            </Label>
          </div>
          <div>
            <Label className="text-xs">Layout</Label>
            <Select
              value={(block.props.layout as string) || 'grid'}
              onValueChange={(v) => updateProp('layout', v)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grid">Grid</SelectItem>
                <SelectItem value="list">List</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );

    case 'banner':
      return (
        <div className="space-y-4 pt-3">
          <LocalizedInput
            label="Title"
            propKey="title"
            value={block.props.title}
            onChange={updateLocalizedProp}
          />
          <LocalizedInput
            label="Subtitle"
            propKey="subtitle"
            value={block.props.subtitle}
            onChange={updateLocalizedProp}
          />
          <LocalizedInput
            label="Button Text"
            propKey="buttonText"
            value={block.props.buttonText}
            onChange={updateLocalizedProp}
          />
          <FieldInput
            label="Button Link"
            value={(block.props.buttonLink as string) ?? ''}
            onChange={(v) => updateProp('buttonLink', v)}
          />
          <FieldInput
            label="Background Color"
            value={(block.props.backgroundColor as string) ?? '#4f46e5'}
            onChange={(v) => updateProp('backgroundColor', v)}
            type="color"
          />
          <FieldInput
            label="Background Image"
            value={(block.props.backgroundImage as string) ?? ''}
            onChange={(v) => updateProp('backgroundImage', v)}
            placeholder="https://..."
          />
        </div>
      );

    case 'banner-grid':
      return (
        <BannerGridSettings
          block={block}
          onUpdate={onUpdate}
          updateProp={updateProp}
        />
      );

    case 'accordion':
      return (
        <AccordionSettings
          block={block}
          onUpdate={onUpdate}
          updateLocalizedProp={updateLocalizedProp}
          updateProp={updateProp}
        />
      );

    case 'html':
      return (
        <div className="space-y-4 pt-3">
          <LocalizedTextarea
            label="HTML Content"
            propKey="html"
            value={block.props.html}
            onChange={updateLocalizedProp}
            rows={10}
          />
        </div>
      );

    case 'category-products':
      return (
        <CategoryProductsSettings
          block={block}
          onUpdate={onUpdate}
          updateProp={updateProp}
          updateLocalizedProp={updateLocalizedProp}
        />
      );

    case 'promo-banners':
      return (
        <PromoBannersSettings
          block={block}
          onUpdate={onUpdate}
          updateProp={updateProp}
        />
      );

    case 'contact-form':
      return (
        <div className="space-y-4 pt-3">
          <LocalizedInput
            label="Title"
            propKey="title"
            value={block.props.title}
            onChange={updateLocalizedProp}
          />
          <LocalizedInput
            label="Subtitle"
            propKey="subtitle"
            value={block.props.subtitle}
            onChange={updateLocalizedProp}
          />
          <div>
            <Label className="text-xs">Layout</Label>
            <Select
              value={(block.props.layout as string) || 'side-by-side'}
              onValueChange={(v) => updateProp('layout', v)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="side-by-side">Side by Side</SelectItem>
                <SelectItem value="stacked">Stacked</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showContactInfo"
              checked={block.props.showContactInfo !== false}
              onChange={(e) => updateProp('showContactInfo', e.target.checked)}
              className="h-4 w-4 rounded border-slate-300"
            />
            <Label htmlFor="showContactInfo" className="text-xs">
              Show Contact Info
            </Label>
          </div>
        </div>
      );

    case 'blog-posts':
      return (
        <div className="space-y-4 pt-3">
          <LocalizedInput
            label="Title"
            propKey="title"
            value={block.props.title}
            onChange={updateLocalizedProp}
          />
          <FieldInput
            label="Limit"
            value={String((block.props.limit as number) ?? 4)}
            onChange={(v) => updateProp('limit', parseInt(v, 10) || 4)}
            type="number"
          />
          <div>
            <Label className="text-xs">Columns</Label>
            <Select
              value={String((block.props.columns as number) || 4)}
              onValueChange={(v) => updateProp('columns', parseInt(v, 10))}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 Columns</SelectItem>
                <SelectItem value="3">3 Columns</SelectItem>
                <SelectItem value="4">4 Columns</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showExcerpt"
              checked={block.props.showExcerpt !== false}
              onChange={(e) => updateProp('showExcerpt', e.target.checked)}
              className="h-4 w-4 rounded border-slate-300"
            />
            <Label htmlFor="showExcerpt" className="text-xs">
              Show Excerpt
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showDate"
              checked={block.props.showDate !== false}
              onChange={(e) => updateProp('showDate', e.target.checked)}
              className="h-4 w-4 rounded border-slate-300"
            />
            <Label htmlFor="showDate" className="text-xs">
              Show Date
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showAuthor"
              checked={block.props.showAuthor !== false}
              onChange={(e) => updateProp('showAuthor', e.target.checked)}
              className="h-4 w-4 rounded border-slate-300"
            />
            <Label htmlFor="showAuthor" className="text-xs">
              Show Author
            </Label>
          </div>
        </div>
      );

    default:
      return (
        <div className="pt-3 text-center text-sm text-slate-400">
          No settings available for this block type.
        </div>
      );
  }
}

// ─── Category Products Settings ───────────────────────────────────────────

function CategoryProductsSettings({
  block,
  onUpdate,
  updateProp,
  updateLocalizedProp,
}: {
  block: Block;
  onUpdate: (id: string, props: Record<string, unknown>) => void;
  updateProp: (key: string, value: unknown) => void;
  updateLocalizedProp: (key: string, locale: string, value: string) => void;
}) {
  const sideBanner = (block.props.sideBanner as Record<string, unknown>) ?? {};

  const updateSideBannerField = (key: string, value: unknown) => {
    updateProp('sideBanner', { ...sideBanner, [key]: value });
  };

  const updateSideBannerLocalized = (key: string, locale: string, value: string) => {
    const current = (sideBanner[key] as Record<string, string>) ?? {};
    updateProp('sideBanner', { ...sideBanner, [key]: { ...current, [locale]: value } });
  };

  return (
    <div className="space-y-4 pt-3">
      <LocalizedInput
        label="Title"
        propKey="title"
        value={block.props.title}
        onChange={updateLocalizedProp}
      />
      <FieldInput
        label="Category Slug"
        value={(block.props.categorySlug as string) ?? ''}
        onChange={(v) => updateProp('categorySlug', v)}
        placeholder="e.g. electronics"
      />
      <FieldInput
        label="Product Limit"
        value={String((block.props.limit as number) ?? 4)}
        onChange={(v) => updateProp('limit', parseInt(v, 10) || 4)}
        type="number"
      />
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="showSideBanner"
          checked={block.props.showSideBanner !== false}
          onChange={(e) => updateProp('showSideBanner', e.target.checked)}
          className="h-4 w-4 rounded border-slate-300"
        />
        <Label htmlFor="showSideBanner" className="text-xs">
          Show Side Banner
        </Label>
      </div>

      {block.props.showSideBanner !== false && (
        <>
          <Separator />
          <Label className="text-xs font-semibold uppercase">Side Banner</Label>
          <FieldInput
            label="Image URL"
            value={(sideBanner.image as string) ?? ''}
            onChange={(v) => updateSideBannerField('image', v)}
            placeholder="https://..."
          />
          {LOCALES.map((loc) => (
            <FieldInput
              key={`sb-title-${loc}`}
              label={`Title (${LOCALE_LABELS[loc]})`}
              value={((sideBanner.title as Record<string, string>)?.[loc]) ?? ''}
              onChange={(v) => updateSideBannerLocalized('title', loc, v)}
            />
          ))}
          {LOCALES.map((loc) => (
            <FieldInput
              key={`sb-subtitle-${loc}`}
              label={`Subtitle (${LOCALE_LABELS[loc]})`}
              value={((sideBanner.subtitle as Record<string, string>)?.[loc]) ?? ''}
              onChange={(v) => updateSideBannerLocalized('subtitle', loc, v)}
            />
          ))}
          {LOCALES.map((loc) => (
            <FieldInput
              key={`sb-btn-${loc}`}
              label={`Button (${LOCALE_LABELS[loc]})`}
              value={((sideBanner.buttonText as Record<string, string>)?.[loc]) ?? ''}
              onChange={(v) => updateSideBannerLocalized('buttonText', loc, v)}
            />
          ))}
          <FieldInput
            label="Button Link"
            value={(sideBanner.buttonLink as string) ?? '#'}
            onChange={(v) => updateSideBannerField('buttonLink', v)}
          />
          <FieldInput
            label="Background Color"
            value={(sideBanner.backgroundColor as string) ?? '#1a1a2e'}
            onChange={(v) => updateSideBannerField('backgroundColor', v)}
            type="color"
          />
        </>
      )}
    </div>
  );
}

// ─── Promo Banners Settings ───────────────────────────────────────────────

interface PromoBannerItem {
  id: string;
  image?: string;
  title?: Record<string, string>;
  subtitle?: Record<string, string>;
  buttonText?: Record<string, string>;
  buttonLink?: string;
  backgroundColor?: string;
  textColor?: string;
}

function PromoBannersSettings({
  block,
  onUpdate,
  updateProp,
}: {
  block: Block;
  onUpdate: (id: string, props: Record<string, unknown>) => void;
  updateProp: (key: string, value: unknown) => void;
}) {
  const banners = (block.props.banners as PromoBannerItem[]) ?? [];

  const updateBanner = (index: number, key: string, value: unknown) => {
    const updated = [...banners];
    updated[index] = { ...updated[index], [key]: value };
    updateProp('banners', updated);
  };

  const updateBannerLocalized = (index: number, key: string, locale: string, value: string) => {
    const updated = [...banners];
    const current = (updated[index][key as keyof PromoBannerItem] as Record<string, string>) ?? {};
    updated[index] = { ...updated[index], [key]: { ...current, [locale]: value } };
    updateProp('banners', updated);
  };

  const addBanner = () => {
    updateProp('banners', [
      ...banners,
      {
        id: `pb_${Date.now()}`,
        image: '',
        title: { en: '' },
        subtitle: { en: '' },
        buttonText: { en: 'View Details' },
        buttonLink: '#',
        backgroundColor: '#3b82f6',
        textColor: 'white',
      },
    ]);
  };

  const removeBanner = (index: number) => {
    updateProp('banners', banners.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4 pt-3">
      <div className="mb-2 flex items-center justify-between">
        <Label className="text-xs font-semibold uppercase">Banners ({banners.length}/3)</Label>
        {banners.length < 3 && (
          <button onClick={addBanner} className="flex items-center gap-1 text-xs text-violet-600 hover:text-violet-800">
            <Plus className="h-3 w-3" /> Add
          </button>
        )}
      </div>
      <div className="space-y-3">
        {banners.map((banner, idx) => (
          <div key={banner.id} className="rounded-md border border-slate-200 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600">Banner {idx + 1}</span>
              <button onClick={() => removeBanner(idx)} className="text-red-400 hover:text-red-600">
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
            <div className="space-y-2">
              <FieldInput
                label="Image URL"
                value={banner.image ?? ''}
                onChange={(v) => updateBanner(idx, 'image', v)}
                placeholder="https://..."
              />
              {LOCALES.map((loc) => (
                <FieldInput
                  key={`title-${loc}`}
                  label={`Title (${LOCALE_LABELS[loc]})`}
                  value={banner.title?.[loc] ?? ''}
                  onChange={(v) => updateBannerLocalized(idx, 'title', loc, v)}
                />
              ))}
              {LOCALES.map((loc) => (
                <FieldInput
                  key={`subtitle-${loc}`}
                  label={`Subtitle (${LOCALE_LABELS[loc]})`}
                  value={banner.subtitle?.[loc] ?? ''}
                  onChange={(v) => updateBannerLocalized(idx, 'subtitle', loc, v)}
                />
              ))}
              {LOCALES.map((loc) => (
                <FieldInput
                  key={`btn-${loc}`}
                  label={`Button (${LOCALE_LABELS[loc]})`}
                  value={banner.buttonText?.[loc] ?? ''}
                  onChange={(v) => updateBannerLocalized(idx, 'buttonText', loc, v)}
                />
              ))}
              <FieldInput
                label="Button Link"
                value={banner.buttonLink ?? '#'}
                onChange={(v) => updateBanner(idx, 'buttonLink', v)}
              />
              <FieldInput
                label="Background Color"
                value={banner.backgroundColor ?? '#3b82f6'}
                onChange={(v) => updateBanner(idx, 'backgroundColor', v)}
                type="color"
              />
              <FieldInput
                label="Text Color"
                value={banner.textColor ?? 'white'}
                onChange={(v) => updateBanner(idx, 'textColor', v)}
                type="color"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Accordion Settings (complex due to items array) ──────────────────────

// ---------------------------------------------------------------------------
// Banner Grid Settings
// ---------------------------------------------------------------------------

interface BannerGridSlide {
  id: string;
  image: string;
  title?: Record<string, string>;
  subtitle?: Record<string, string>;
  buttonText?: Record<string, string>;
  buttonLink?: string;
  textColor?: string;
  textPosition?: string;
  overlayOpacity?: number;
}

interface BannerGridSideBanner {
  id: string;
  image: string;
  title?: Record<string, string>;
  subtitle?: Record<string, string>;
  buttonText?: Record<string, string>;
  buttonLink?: string;
  textColor?: string;
  countdown?: string;
}

function BannerGridSettings({
  block,
  onUpdate,
  updateProp,
}: {
  block: Block;
  onUpdate: (id: string, props: Record<string, unknown>) => void;
  updateProp: (key: string, value: unknown) => void;
}) {
  const slides = (block.props.slides as BannerGridSlide[]) ?? [];
  const sideBanners = (block.props.sideBanners as BannerGridSideBanner[]) ?? [];

  const updateSlide = (index: number, key: string, value: unknown) => {
    const updated = [...slides];
    updated[index] = { ...updated[index], [key]: value };
    updateProp('slides', updated);
  };

  const updateSlideLocalized = (index: number, key: string, locale: string, value: string) => {
    const updated = [...slides];
    const current = (updated[index][key as keyof BannerGridSlide] as Record<string, string>) ?? {};
    updated[index] = { ...updated[index], [key]: { ...current, [locale]: value } };
    updateProp('slides', updated);
  };

  const addSlide = () => {
    updateProp('slides', [
      ...slides,
      {
        id: `slide_${Date.now()}`,
        image: '',
        title: { en: '' },
        subtitle: { en: '' },
        buttonText: { en: '' },
        buttonLink: '',
        textColor: 'white',
        textPosition: 'left',
        overlayOpacity: 0.3,
      },
    ]);
  };

  const removeSlide = (index: number) => {
    updateProp('slides', slides.filter((_, i) => i !== index));
  };

  const updateSideBanner = (index: number, key: string, value: unknown) => {
    const updated = [...sideBanners];
    updated[index] = { ...updated[index], [key]: value };
    updateProp('sideBanners', updated);
  };

  const updateSideBannerLocalized = (index: number, key: string, locale: string, value: string) => {
    const updated = [...sideBanners];
    const current = (updated[index][key as keyof BannerGridSideBanner] as Record<string, string>) ?? {};
    updated[index] = { ...updated[index], [key]: { ...current, [locale]: value } };
    updateProp('sideBanners', updated);
  };

  const addSideBanner = () => {
    updateProp('sideBanners', [
      ...sideBanners,
      {
        id: `side_${Date.now()}`,
        image: '',
        title: { en: '' },
        subtitle: { en: '' },
        buttonText: { en: '' },
        buttonLink: '',
        textColor: 'white',
        countdown: '',
      },
    ]);
  };

  const removeSideBanner = (index: number) => {
    updateProp('sideBanners', sideBanners.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4 pt-3">
      {/* General Settings */}
      <div className="space-y-3">
        <FieldInput
          label="Height"
          value={(block.props.height as string) ?? '500px'}
          onChange={(v) => updateProp('height', v)}
          placeholder="500px"
        />
        <FieldInput
          label="Gap"
          value={(block.props.gap as string) ?? '12px'}
          onChange={(v) => updateProp('gap', v)}
          placeholder="12px"
        />
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={(block.props.autoplay as boolean) ?? true}
            onChange={(e) => updateProp('autoplay', e.target.checked)}
            className="rounded"
          />
          <Label className="text-xs">Autoplay</Label>
        </div>
        {block.props.autoplay !== false && (
          <FieldInput
            label="Interval (ms)"
            value={String((block.props.autoplayInterval as number) ?? 5000)}
            onChange={(v) => updateProp('autoplayInterval', parseInt(v) || 5000)}
            type="number"
          />
        )}
      </div>

      <Separator />

      {/* Main Slides */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <Label className="text-xs font-semibold uppercase">Main Slides ({slides.length})</Label>
          <button onClick={addSlide} className="flex items-center gap-1 text-xs text-violet-600 hover:text-violet-800">
            <Plus className="h-3 w-3" /> Add
          </button>
        </div>
        <div className="space-y-3">
          {slides.map((slide, idx) => (
            <div key={slide.id} className="rounded-md border border-slate-200 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-600">Slide {idx + 1}</span>
                <button onClick={() => removeSlide(idx)} className="text-red-400 hover:text-red-600">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
              <div className="space-y-2">
                <FieldInput
                  label="Image URL"
                  value={slide.image}
                  onChange={(v) => updateSlide(idx, 'image', v)}
                  placeholder="https://..."
                />
                {LOCALES.map((loc) => (
                  <FieldInput
                    key={`title-${loc}`}
                    label={`Title (${LOCALE_LABELS[loc]})`}
                    value={slide.title?.[loc] ?? ''}
                    onChange={(v) => updateSlideLocalized(idx, 'title', loc, v)}
                  />
                ))}
                {LOCALES.map((loc) => (
                  <FieldInput
                    key={`subtitle-${loc}`}
                    label={`Subtitle (${LOCALE_LABELS[loc]})`}
                    value={slide.subtitle?.[loc] ?? ''}
                    onChange={(v) => updateSlideLocalized(idx, 'subtitle', loc, v)}
                  />
                ))}
                {LOCALES.map((loc) => (
                  <FieldInput
                    key={`btn-${loc}`}
                    label={`Button (${LOCALE_LABELS[loc]})`}
                    value={slide.buttonText?.[loc] ?? ''}
                    onChange={(v) => updateSlideLocalized(idx, 'buttonText', loc, v)}
                  />
                ))}
                <FieldInput
                  label="Button Link"
                  value={slide.buttonLink ?? ''}
                  onChange={(v) => updateSlide(idx, 'buttonLink', v)}
                />
                <FieldInput
                  label="Text Color"
                  value={slide.textColor ?? 'white'}
                  onChange={(v) => updateSlide(idx, 'textColor', v)}
                  type="color"
                />
                <div>
                  <Label className="mb-1 block text-xs text-slate-600">Text Position</Label>
                  <select
                    value={slide.textPosition ?? 'left'}
                    onChange={(e) => updateSlide(idx, 'textPosition', e.target.value)}
                    className="w-full rounded-md border px-2 py-1 text-xs"
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </div>
                <FieldInput
                  label="Overlay Opacity (0-1)"
                  value={String(slide.overlayOpacity ?? 0.3)}
                  onChange={(v) => updateSlide(idx, 'overlayOpacity', parseFloat(v) || 0)}
                  type="number"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Side Banners */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <Label className="text-xs font-semibold uppercase">Side Banners ({sideBanners.length})</Label>
          <button onClick={addSideBanner} className="flex items-center gap-1 text-xs text-violet-600 hover:text-violet-800">
            <Plus className="h-3 w-3" /> Add
          </button>
        </div>
        <div className="space-y-3">
          {sideBanners.map((banner, idx) => (
            <div key={banner.id} className="rounded-md border border-slate-200 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-600">Side Banner {idx + 1}</span>
                <button onClick={() => removeSideBanner(idx)} className="text-red-400 hover:text-red-600">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
              <div className="space-y-2">
                <FieldInput
                  label="Image URL"
                  value={banner.image}
                  onChange={(v) => updateSideBanner(idx, 'image', v)}
                  placeholder="https://..."
                />
                {LOCALES.map((loc) => (
                  <FieldInput
                    key={`title-${loc}`}
                    label={`Title (${LOCALE_LABELS[loc]})`}
                    value={banner.title?.[loc] ?? ''}
                    onChange={(v) => updateSideBannerLocalized(idx, 'title', loc, v)}
                  />
                ))}
                {LOCALES.map((loc) => (
                  <FieldInput
                    key={`subtitle-${loc}`}
                    label={`Subtitle (${LOCALE_LABELS[loc]})`}
                    value={banner.subtitle?.[loc] ?? ''}
                    onChange={(v) => updateSideBannerLocalized(idx, 'subtitle', loc, v)}
                  />
                ))}
                {LOCALES.map((loc) => (
                  <FieldInput
                    key={`btn-${loc}`}
                    label={`Button (${LOCALE_LABELS[loc]})`}
                    value={banner.buttonText?.[loc] ?? ''}
                    onChange={(v) => updateSideBannerLocalized(idx, 'buttonText', loc, v)}
                  />
                ))}
                <FieldInput
                  label="Button Link"
                  value={banner.buttonLink ?? ''}
                  onChange={(v) => updateSideBanner(idx, 'buttonLink', v)}
                />
                <FieldInput
                  label="Text Color"
                  value={banner.textColor ?? 'white'}
                  onChange={(v) => updateSideBanner(idx, 'textColor', v)}
                  type="color"
                />
                <FieldInput
                  label="Countdown (ISO Date)"
                  value={banner.countdown ?? ''}
                  onChange={(v) => updateSideBanner(idx, 'countdown', v)}
                  placeholder="2026-12-31T00:00:00"
                  type="datetime-local"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AccordionSettings({
  block,
  onUpdate,
  updateLocalizedProp,
  updateProp,
}: {
  block: Block;
  onUpdate: (blockId: string, props: Record<string, unknown>) => void;
  updateLocalizedProp: (key: string, locale: string, value: string) => void;
  updateProp: (key: string, value: unknown) => void;
}) {
  const items = (block.props.items as Array<{
    title: Record<string, string>;
    content: Record<string, string>;
  }>) ?? [];

  const updateItem = useCallback(
    (index: number, field: 'title' | 'content', locale: string, value: string) => {
      const updated = items.map((item, i) => {
        if (i !== index) return item;
        return {
          ...item,
          [field]: { ...item[field], [locale]: value },
        };
      });
      onUpdate(block.id, { items: updated });
    },
    [block.id, items, onUpdate],
  );

  const addItem = useCallback(() => {
    const updated = [
      ...items,
      {
        title: { en: `Question ${items.length + 1}` },
        content: { en: `Answer ${items.length + 1}` },
      },
    ];
    onUpdate(block.id, { items: updated });
  }, [block.id, items, onUpdate]);

  const removeItem = useCallback(
    (index: number) => {
      const updated = items.filter((_, i) => i !== index);
      onUpdate(block.id, { items: updated });
    },
    [block.id, items, onUpdate],
  );

  return (
    <div className="space-y-4 pt-3">
      <LocalizedInput
        label="Section Title"
        propKey="title"
        value={block.props.title}
        onChange={updateLocalizedProp}
      />

      <Separator />

      <div>
        <div className="mb-2 flex items-center justify-between">
          <Label className="text-xs">Items</Label>
          <button
            onClick={addItem}
            className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-violet-600 hover:bg-violet-50"
          >
            <Plus className="h-3 w-3" />
            Add
          </button>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="rounded-lg border border-slate-200 bg-slate-50 p-3"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">
                  Item {index + 1}
                </span>
                <button
                  onClick={() => removeItem(index)}
                  className="rounded p-0.5 text-slate-400 hover:text-red-500"
                  disabled={items.length <= 1}
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>

              <div className="space-y-2">
                <AccordionItemLocalized
                  label="Title"
                  value={item.title}
                  onChange={(loc, val) => updateItem(index, 'title', loc, val)}
                />
                <AccordionItemLocalized
                  label="Content"
                  value={item.content}
                  onChange={(loc, val) => updateItem(index, 'content', loc, val)}
                  isTextarea
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AccordionItemLocalized({
  label,
  value,
  onChange,
  isTextarea,
}: {
  label: string;
  value: Record<string, string>;
  onChange: (locale: string, value: string) => void;
  isTextarea?: boolean;
}) {
  return (
    <div>
      <Label className="text-[10px] text-slate-400">{label}</Label>
      <Tabs defaultValue="en" className="mt-1">
        <TabsList className="h-6 p-0">
          {LOCALES.map((loc) => (
            <TabsTrigger
              key={loc}
              value={loc}
              className="h-6 px-2 text-[10px]"
            >
              {LOCALE_LABELS[loc]}
            </TabsTrigger>
          ))}
        </TabsList>
        {LOCALES.map((loc) => (
          <TabsContent key={loc} value={loc} className="mt-1">
            {isTextarea ? (
              <textarea
                value={value?.[loc] ?? ''}
                onChange={(e) => onChange(loc, e.target.value)}
                rows={2}
                className="w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs focus:border-violet-300 focus:outline-none focus:ring-1 focus:ring-violet-300"
              />
            ) : (
              <Input
                value={value?.[loc] ?? ''}
                onChange={(e) => onChange(loc, e.target.value)}
                className="h-7 text-xs"
              />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

// ─── Style Settings ──────────────────────────────────────────────────────────

interface StyleSettingsProps {
  block: Block;
  onUpdate: (blockId: string, style: Partial<BlockStyle>) => void;
}

function StyleSettings({ block, onUpdate }: StyleSettingsProps) {
  const style = block.style ?? {};

  const updateStyle = useCallback(
    (key: keyof BlockStyle, value: string) => {
      onUpdate(block.id, { [key]: value || undefined });
    },
    [block.id, onUpdate],
  );

  return (
    <div className="space-y-4 pt-3">
      <FieldInput
        label="Padding"
        value={style.padding ?? ''}
        onChange={(v) => updateStyle('padding', v)}
        placeholder="16px, 1rem 2rem, etc."
      />
      <FieldInput
        label="Margin"
        value={style.margin ?? ''}
        onChange={(v) => updateStyle('margin', v)}
        placeholder="0 auto, 16px 0, etc."
      />
      <FieldInput
        label="Background Color"
        value={style.backgroundColor ?? ''}
        onChange={(v) => updateStyle('backgroundColor', v)}
        type="color"
      />
      <FieldInput
        label="Text Color"
        value={style.textColor ?? ''}
        onChange={(v) => updateStyle('textColor', v)}
        type="color"
      />
      <FieldInput
        label="Border Radius"
        value={style.borderRadius ?? ''}
        onChange={(v) => updateStyle('borderRadius', v)}
        placeholder="8px, 0.5rem, etc."
      />
      <FieldInput
        label="Max Width"
        value={style.maxWidth ?? ''}
        onChange={(v) => updateStyle('maxWidth', v)}
        placeholder="1200px, 80%, etc."
      />
      <div>
        <Label className="text-xs">Text Align</Label>
        <Select
          value={style.textAlign ?? ''}
          onValueChange={(v) =>
            updateStyle('textAlign', v as BlockStyle['textAlign'] & string)
          }
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Default" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="right">Right</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-xs">Custom CSS</Label>
        <textarea
          value={style.customCss ?? ''}
          onChange={(e) => updateStyle('customCss', e.target.value)}
          rows={4}
          className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 font-mono text-xs focus:border-violet-300 focus:outline-none focus:ring-1 focus:ring-violet-300"
          placeholder=".block { ... }"
        />
      </div>
    </div>
  );
}

// ─── Shared UI Helpers ───────────────────────────────────────────────────────

function FieldInput({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  if (type === 'color') {
    return (
      <div>
        <Label className="text-xs">{label}</Label>
        <div className="mt-1 flex items-center gap-2">
          <input
            type="color"
            value={value || '#000000'}
            onChange={(e) => onChange(e.target.value)}
            className="h-8 w-8 cursor-pointer rounded border border-slate-200"
          />
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#000000"
            className="h-8 flex-1 text-xs"
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Label className="text-xs">{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 h-8 text-xs"
      />
    </div>
  );
}

function LocalizedInput({
  label,
  propKey,
  value,
  onChange,
}: {
  label: string;
  propKey: string;
  value: unknown;
  onChange: (key: string, locale: string, value: string) => void;
}) {
  const obj = (typeof value === 'object' && value !== null
    ? value
    : { en: typeof value === 'string' ? value : '' }) as Record<string, string>;

  return (
    <div>
      <Label className="text-xs">{label}</Label>
      <Tabs defaultValue="en" className="mt-1">
        <TabsList className="h-7 p-0.5">
          {LOCALES.map((loc) => (
            <TabsTrigger
              key={loc}
              value={loc}
              className="h-6 px-2 text-[10px]"
            >
              {LOCALE_LABELS[loc]}
            </TabsTrigger>
          ))}
        </TabsList>
        {LOCALES.map((loc) => (
          <TabsContent key={loc} value={loc} className="mt-1">
            <Input
              value={obj[loc] ?? ''}
              onChange={(e) => onChange(propKey, loc, e.target.value)}
              className="h-8 text-xs"
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function LocalizedTextarea({
  label,
  propKey,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  propKey: string;
  value: unknown;
  onChange: (key: string, locale: string, value: string) => void;
  rows?: number;
}) {
  const obj = (typeof value === 'object' && value !== null
    ? value
    : { en: typeof value === 'string' ? value : '' }) as Record<string, string>;

  return (
    <div>
      <Label className="text-xs">{label}</Label>
      <Tabs defaultValue="en" className="mt-1">
        <TabsList className="h-7 p-0.5">
          {LOCALES.map((loc) => (
            <TabsTrigger
              key={loc}
              value={loc}
              className="h-6 px-2 text-[10px]"
            >
              {LOCALE_LABELS[loc]}
            </TabsTrigger>
          ))}
        </TabsList>
        {LOCALES.map((loc) => (
          <TabsContent key={loc} value={loc} className="mt-1">
            <textarea
              value={obj[loc] ?? ''}
              onChange={(e) => onChange(propKey, loc, e.target.value)}
              rows={rows}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs focus:border-violet-300 focus:outline-none focus:ring-1 focus:ring-violet-300"
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function getBlockTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    hero: 'Hero Section',
    text: 'Text Block',
    image: 'Image',
    html: 'Custom HTML',
    container: 'Container',
    columns: 'Columns',
    'product-showcase': 'Product Showcase',
    'category-showcase': 'Category Showcase',
    'product-listing': 'Product Listing',
    'category-listing': 'Category Grid',
    banner: 'Banner',
    'banner-grid': 'Banner Grid',
    spacer: 'Spacer',
    divider: 'Divider',
    button: 'Button',
    accordion: 'Accordion',
    'category-products': 'Category Products',
    'promo-banners': 'Promo Banners',
    'contact-form': 'Contact Form',
    'blog-posts': 'Blog Posts',
  };
  return labels[type] ?? type;
}
