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
          <FieldInput
            label="Product Limit"
            value={String((block.props.limit as number) ?? 4)}
            onChange={(v) => updateProp('limit', parseInt(v, 10) || 4)}
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
          <FieldInput
            label="Limit"
            value={String((block.props.limit as number) ?? 6)}
            onChange={(v) => updateProp('limit', parseInt(v, 10) || 6)}
            type="number"
          />
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

    default:
      return (
        <div className="pt-3 text-center text-sm text-slate-400">
          No settings available for this block type.
        </div>
      );
  }
}

// ─── Accordion Settings (complex due to items array) ──────────────────────

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
    spacer: 'Spacer',
    divider: 'Divider',
    button: 'Button',
    accordion: 'Accordion',
  };
  return labels[type] ?? type;
}
