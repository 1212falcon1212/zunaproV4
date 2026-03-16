'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { usePageBuilderStore } from '@/lib/stores/page-builder-store';
import { cn } from '@zunapro/ui';
import type { Block, BlockType } from '@zunapro/types';
import {
  GripVertical,
  Copy,
  Trash2,
  Type,
  ImageIcon,
  MousePointerClick,
  Code2,
  ChevronDown,
  ShoppingBag,
  Grid3X3,
  Sparkles,
  Flag,
  LayoutTemplate,
  Columns3,
  Minus,
  SeparatorHorizontal,
  Layers,
  List,
  LayoutGrid,
} from 'lucide-react';

const BLOCK_TYPE_LABELS: Record<string, string> = {
  hero: 'Hero',
  text: 'Text',
  image: 'Image',
  html: 'HTML',
  container: 'Container',
  columns: 'Columns',
  'product-showcase': 'Products',
  'category-showcase': 'Categories',
  banner: 'Banner',
  spacer: 'Spacer',
  divider: 'Divider',
  button: 'Button',
  accordion: 'Accordion',
  'blog-posts': 'Blog Posts',
  'navigation-menu': 'Navigation',
  logo: 'Logo',
  'search-bar': 'Search',
  'cart-icon': 'Cart',
  'social-links': 'Social Links',
  newsletter: 'Newsletter',
  'product-listing': 'Product Listing',
  'category-listing': 'Category Grid',
};

const BLOCK_TYPE_ICONS: Record<string, React.ReactNode> = {
  hero: <Sparkles className="h-3 w-3" />,
  text: <Type className="h-3 w-3" />,
  image: <ImageIcon className="h-3 w-3" />,
  html: <Code2 className="h-3 w-3" />,
  container: <LayoutTemplate className="h-3 w-3" />,
  columns: <Columns3 className="h-3 w-3" />,
  'product-showcase': <ShoppingBag className="h-3 w-3" />,
  'category-showcase': <Grid3X3 className="h-3 w-3" />,
  banner: <Flag className="h-3 w-3" />,
  spacer: <Minus className="h-3 w-3" />,
  divider: <SeparatorHorizontal className="h-3 w-3" />,
  button: <MousePointerClick className="h-3 w-3" />,
  accordion: <ChevronDown className="h-3 w-3" />,
  'product-listing': <List className="h-3 w-3" />,
  'category-listing': <LayoutGrid className="h-3 w-3" />,
};

interface BlockWrapperProps {
  block: Block;
}

export function BlockWrapper({ block }: BlockWrapperProps) {
  const {
    selectedBlockId,
    hoveredBlockId,
    selectBlock,
    hoverBlock,
    duplicateBlock,
    removeBlock,
  } = usePageBuilderStore();

  const isSelected = selectedBlockId === block.id;
  const isHovered = hoveredBlockId === block.id;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative transition-all',
        isDragging && 'z-50 opacity-50',
        isSelected && 'ring-2 ring-violet-500 ring-offset-1',
        !isSelected && isHovered && 'ring-1 ring-dashed ring-slate-300',
      )}
      onClick={(e) => {
        e.stopPropagation();
        selectBlock(block.id);
      }}
      onMouseEnter={() => hoverBlock(block.id)}
      onMouseLeave={() => hoverBlock(null)}
    >
      {/* Block type label - shown on hover */}
      {(isHovered || isSelected) && (
        <div
          className={cn(
            'absolute -top-6 left-0 z-10 flex items-center gap-1 rounded-t-md px-2 py-0.5 text-[10px] font-semibold text-white',
            isSelected ? 'bg-violet-500' : 'bg-slate-500',
          )}
        >
          {BLOCK_TYPE_ICONS[block.type] ?? <Layers className="h-3 w-3" />}
          {BLOCK_TYPE_LABELS[block.type] ?? block.type}
        </div>
      )}

      {/* Hover toolbar */}
      {(isHovered || isSelected) && (
        <div className="absolute -top-6 right-0 z-10 flex items-center gap-0.5 rounded-t-md bg-slate-800 px-1">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab rounded p-1 text-slate-300 hover:text-white active:cursor-grabbing"
            title="Drag to reorder"
          >
            <GripVertical className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              duplicateBlock(block.id);
            }}
            className="rounded p-1 text-slate-300 hover:text-white"
            title="Duplicate"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeBlock(block.id);
            }}
            className="rounded p-1 text-slate-300 hover:text-red-400"
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Block preview */}
      <div className="min-h-[40px]">
        <BlockPreview block={block} />
      </div>
    </div>
  );
}

function BlockPreview({ block }: { block: Block }) {
  const props = block.props;

  switch (block.type) {
    case 'hero':
      return (
        <div
          className="relative flex min-h-[200px] flex-col items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-center"
          style={{
            backgroundImage: props.backgroundImage
              ? `url(${props.backgroundImage as string})`
              : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {(props.backgroundImage as string) ? (
            <div
              className="absolute inset-0 bg-black"
              style={{ opacity: (props.overlayOpacity as number) ?? 0.5 }}
            />
          ) : null}
          <h2 className="relative z-10 text-2xl font-bold text-white">
            {getLocalizedText(props.title)}
          </h2>
          {getLocalizedText(props.subtitle) && (
            <p className="relative z-10 text-sm text-white/80">
              {getLocalizedText(props.subtitle)}
            </p>
          )}
          <div className="relative z-10 flex items-center gap-2">
            <span className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-indigo-600">
              {getLocalizedText(props.buttonText) || 'Button'}
            </span>
          </div>
        </div>
      );

    case 'text': {
      const Tag = (props.tag as string) === 'p' ? 'p' : 'div';
      return (
        <div className="px-6 py-4">
          <Tag
            className={cn(
              'text-slate-700',
              (props.tag as string)?.startsWith('h') && 'font-bold',
              props.tag === 'h1' && 'text-3xl',
              props.tag === 'h2' && 'text-2xl',
              props.tag === 'h3' && 'text-xl',
              props.tag === 'h4' && 'text-lg',
              props.tag === 'h5' && 'text-base',
              props.tag === 'h6' && 'text-sm',
            )}
          >
            {getLocalizedText(props.content) || 'Text block'}
          </Tag>
        </div>
      );
    }

    case 'image':
      return (
        <div className="flex items-center justify-center p-4">
          {(props.src as string) ? (
            <img
              src={props.src as string}
              alt={getLocalizedText(props.alt) || ''}
              className="max-h-48 rounded object-contain"
              style={{ width: (props.width as string) || '100%' }}
            />
          ) : (
            <div className="flex h-32 w-full items-center justify-center rounded bg-slate-100">
              <ImageIcon className="h-8 w-8 text-slate-300" />
              <span className="ml-2 text-sm text-slate-400">No image set</span>
            </div>
          )}
        </div>
      );

    case 'button':
      return (
        <div
          className="flex p-4"
          style={{
            justifyContent:
              props.align === 'center'
                ? 'center'
                : props.align === 'right'
                  ? 'flex-end'
                  : 'flex-start',
          }}
        >
          <span
            className={cn(
              'inline-flex items-center rounded-lg font-medium',
              props.variant === 'primary' && 'bg-violet-600 text-white',
              props.variant === 'secondary' && 'bg-slate-200 text-slate-800',
              props.variant === 'outline' &&
                'border border-violet-600 text-violet-600',
              props.variant === 'ghost' && 'text-violet-600',
              props.size === 'sm' && 'px-3 py-1.5 text-xs',
              props.size === 'md' && 'px-4 py-2 text-sm',
              props.size === 'lg' && 'px-6 py-3 text-base',
            )}
          >
            {getLocalizedText(props.text) || 'Button'}
          </span>
        </div>
      );

    case 'spacer':
      return (
        <div
          className="flex items-center justify-center border-y border-dashed border-slate-200 bg-slate-50/50"
          style={{ height: (props.height as string) || '40px' }}
        >
          <span className="text-[10px] text-slate-300">
            Spacer ({(props.height as string) || '40px'})
          </span>
        </div>
      );

    case 'divider':
      return (
        <div className="px-6 py-4">
          <hr
            style={{
              borderColor: (props.color as string) || '#e2e8f0',
              borderWidth: (props.thickness as string) || '1px',
              borderStyle:
                (props.style as string) || 'solid',
            }}
          />
        </div>
      );

    case 'columns':
      return (
        <div className="p-4">
          <div
            className="grid min-h-[80px] rounded border border-dashed border-slate-300"
            style={{
              gridTemplateColumns: `repeat(${(props.columns as number) || 2}, 1fr)`,
              gap: (props.gap as string) || '16px',
            }}
          >
            {Array.from({ length: (props.columns as number) || 2 }).map(
              (_, i) => (
                <div
                  key={i}
                  className="flex min-h-[80px] items-center justify-center rounded bg-slate-50 text-xs text-slate-400"
                >
                  Column {i + 1}
                </div>
              ),
            )}
          </div>
        </div>
      );

    case 'container':
      return (
        <div className="min-h-[80px] border border-dashed border-slate-300 bg-slate-50/50 p-4">
          <div className="flex h-full items-center justify-center text-xs text-slate-400">
            Container
            {block.children && block.children.length > 0
              ? ` (${block.children.length} blocks)`
              : ' (empty)'}
          </div>
        </div>
      );

    case 'product-showcase':
      return (
        <div className="p-6">
          <h3 className="mb-3 text-lg font-semibold text-slate-800">
            {getLocalizedText(props.title) || 'Products'}
          </h3>
          <div
            className="grid gap-3"
            style={{
              gridTemplateColumns: `repeat(${(props.columns as number) || 4}, 1fr)`,
            }}
          >
            {Array.from({ length: Math.min((props.limit as number) || 4, 4) }).map(
              (_, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center rounded-lg border border-slate-200 bg-slate-50 p-3"
                >
                  <div className="mb-2 h-16 w-16 rounded bg-slate-200" />
                  <div className="h-2 w-16 rounded bg-slate-200" />
                  <div className="mt-1 h-2 w-10 rounded bg-slate-100" />
                </div>
              ),
            )}
          </div>
        </div>
      );

    case 'category-showcase':
      return (
        <div className="p-6">
          <h3 className="mb-3 text-lg font-semibold text-slate-800">
            {getLocalizedText(props.title) || 'Categories'}
          </h3>
          <div
            className="grid gap-3"
            style={{
              gridTemplateColumns: `repeat(${(props.columns as number) || 3}, 1fr)`,
            }}
          >
            {Array.from({ length: Math.min((props.limit as number) || 6, 6) }).map(
              (_, i) => (
                <div
                  key={i}
                  className="flex h-20 items-center justify-center rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 text-xs text-slate-400"
                >
                  Category {i + 1}
                </div>
              ),
            )}
          </div>
        </div>
      );

    case 'banner':
      return (
        <div
          className="flex min-h-[120px] flex-col items-center justify-center gap-2 p-6 text-center"
          style={{
            backgroundColor: (props.backgroundColor as string) || '#4f46e5',
            backgroundImage: props.backgroundImage
              ? `url(${props.backgroundImage as string})`
              : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <h3 className="text-xl font-bold text-white">
            {getLocalizedText(props.title) || 'Banner'}
          </h3>
          {getLocalizedText(props.subtitle) && (
            <p className="text-sm text-white/80">
              {getLocalizedText(props.subtitle)}
            </p>
          )}
          {getLocalizedText(props.buttonText) && (
            <span className="mt-1 rounded-lg bg-white px-4 py-1.5 text-sm font-medium text-slate-800">
              {getLocalizedText(props.buttonText)}
            </span>
          )}
        </div>
      );

    case 'accordion': {
      const items = (props.items as Array<{ title: unknown; content: unknown }>) ?? [];
      return (
        <div className="p-6">
          <h3 className="mb-3 text-lg font-semibold text-slate-800">
            {getLocalizedText(props.title) || 'Accordion'}
          </h3>
          <div className="space-y-1">
            {items.slice(0, 3).map((item, i) => (
              <div
                key={i}
                className="rounded border border-slate-200 bg-slate-50 px-3 py-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">
                    {getLocalizedText(item.title)}
                  </span>
                  <ChevronDown className="h-3 w-3 text-slate-400" />
                </div>
              </div>
            ))}
            {items.length > 3 && (
              <p className="text-xs text-slate-400">
                + {items.length - 3} more items
              </p>
            )}
          </div>
        </div>
      );
    }

    case 'html':
      return (
        <div className="p-4">
          <div className="flex items-center gap-2 rounded border border-orange-200 bg-orange-50 p-3">
            <Code2 className="h-4 w-4 text-orange-500" />
            <span className="text-xs text-orange-700">Custom HTML Block</span>
          </div>
        </div>
      );

    case 'product-listing':
      return (
        <div className="p-6">
          <h3 className="mb-3 text-lg font-semibold text-slate-800">
            {getLocalizedText(props.title) || 'All Products'}
          </h3>
          {((props.showFilters as boolean) ?? true) && (
            <div className="mb-3 flex gap-2">
              <div className="h-8 w-28 rounded bg-slate-100 border border-slate-200" />
              <div className="h-8 w-28 rounded bg-slate-100 border border-slate-200" />
              <div className="h-8 w-20 rounded bg-slate-100 border border-slate-200" />
            </div>
          )}
          {((props.showSearch as boolean) ?? true) && (
            <div className="mb-3 h-8 w-48 rounded bg-slate-100 border border-slate-200" />
          )}
          <div
            className="grid gap-3"
            style={{
              gridTemplateColumns: `repeat(${(props.columns as number) || 4}, 1fr)`,
            }}
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col items-center rounded-lg border border-slate-200 bg-slate-50 p-3"
              >
                <div className="mb-2 h-16 w-16 rounded bg-slate-200" />
                <div className="h-2 w-16 rounded bg-slate-200" />
                <div className="mt-1 h-2 w-10 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        </div>
      );

    case 'category-listing':
      return (
        <div className="p-6">
          <h3 className="mb-3 text-lg font-semibold text-slate-800">
            {getLocalizedText(props.title) || 'Categories'}
          </h3>
          <div
            className="grid gap-3"
            style={{
              gridTemplateColumns: `repeat(${(props.columns as number) || 4}, 1fr)`,
            }}
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex h-24 flex-col items-center justify-center rounded-lg bg-gradient-to-br from-slate-100 to-slate-200"
              >
                <span className="text-xs font-medium text-slate-500">Category {i + 1}</span>
                {(props.showProductCount as boolean) !== false && (
                  <span className="mt-1 text-[10px] text-slate-400">12 products</span>
                )}
              </div>
            ))}
          </div>
        </div>
      );

    default:
      return (
        <div className="flex items-center justify-center p-6">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Layers className="h-4 w-4" />
            {BLOCK_TYPE_LABELS[block.type] ?? block.type}
          </div>
        </div>
      );
  }
}

function getLocalizedText(value: unknown): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value !== null) {
    const obj = value as Record<string, string>;
    return obj.en || obj.de || obj.fr || obj.es || obj.tr || '';
  }
  return '';
}
