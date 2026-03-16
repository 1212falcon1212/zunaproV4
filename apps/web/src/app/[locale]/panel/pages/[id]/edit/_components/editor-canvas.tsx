'use client';

import { useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { usePageBuilderStore } from '@/lib/stores/page-builder-store';
import { BlockWrapper } from './block-wrapper';
import { cn } from '@zunapro/ui';
import type { Block, BlockType } from '@zunapro/types';
import { useState } from 'react';
import {
  Layers,
  Plus,
} from 'lucide-react';

const BLOCK_TYPE_LABELS: Record<BlockType, string> = {
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

function getDefaultPropsForType(type: BlockType): Record<string, unknown> {
  switch (type) {
    case 'text':
      return { content: { en: 'New text block' }, tag: 'p' };
    case 'image':
      return { src: '', alt: { en: '' }, link: '', width: '100%' };
    case 'hero':
      return {
        title: { en: 'Hero Title' },
        subtitle: { en: 'Hero Subtitle' },
        buttonText: { en: 'Get Started' },
        buttonLink: '#',
        secondaryButton: false,
        backgroundImage: '',
        overlayOpacity: 0.5,
      };
    case 'button':
      return {
        text: { en: 'Click me' },
        link: '#',
        variant: 'primary',
        size: 'md',
        align: 'center',
      };
    case 'spacer':
      return { height: '40px' };
    case 'divider':
      return { color: '#e2e8f0', thickness: '1px', style: 'solid' };
    case 'columns':
      return { columns: 2, gap: '16px' };
    case 'container':
      return { fullWidth: false };
    case 'product-showcase':
      return { title: { en: 'Featured Products' }, limit: 4, categoryId: '', columns: 4 };
    case 'category-showcase':
      return { title: { en: 'Shop by Category' }, limit: 6, columns: 3 };
    case 'product-listing':
      return { title: { en: 'All Products' }, columns: 4, productsPerPage: 12, showFilters: true, showSearch: true };
    case 'category-listing':
      return { title: { en: 'Categories' }, columns: 4, showProductCount: true, layout: 'grid' };
    case 'banner':
      return {
        title: { en: 'Banner Title' },
        subtitle: { en: '' },
        buttonText: { en: 'Learn More' },
        buttonLink: '#',
        backgroundColor: '#4f46e5',
        backgroundImage: '',
      };
    case 'accordion':
      return {
        title: { en: 'FAQ' },
        items: [
          {
            title: { en: 'Question 1' },
            content: { en: 'Answer 1' },
          },
        ],
      };
    case 'html':
      return { html: { en: '<div>Custom HTML</div>' } };
    default:
      return {};
  }
}

export function EditorCanvas() {
  const {
    blocks,
    devicePreview,
    addBlock,
    moveBlock,
    selectBlock,
  } = usePageBuilderStore();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeCatalogType, setActiveCatalogType] = useState<BlockType | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      const activeData = active.data.current;

      if (activeData?.type === 'catalog-item') {
        setActiveCatalogType(activeData.blockType as BlockType);
        setActiveId(null);
      } else {
        setActiveId(active.id as string);
        setActiveCatalogType(null);
      }
    },
    [],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);
      setActiveCatalogType(null);

      if (!over) return;

      const activeData = active.data.current;

      // Dropping a new block from catalog
      if (activeData?.type === 'catalog-item') {
        const blockType = activeData.blockType as BlockType;
        const newBlock: Block = {
          id: `block_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          type: blockType,
          props: getDefaultPropsForType(blockType),
          children: blockType === 'container' || blockType === 'columns' ? [] : undefined,
        };

        // Determine insertion index
        const overIndex = blocks.findIndex((b) => b.id === over.id);
        const insertIndex = overIndex >= 0 ? overIndex + 1 : blocks.length;
        addBlock(newBlock, undefined, insertIndex);
        return;
      }

      // Reordering existing blocks
      if (active.id !== over.id) {
        const oldIndex = blocks.findIndex((b) => b.id === active.id);
        const newIndex = blocks.findIndex((b) => b.id === over.id);
        if (oldIndex >= 0 && newIndex >= 0) {
          moveBlock(active.id as string, null, newIndex);
        }
      }
    },
    [blocks, addBlock, moveBlock],
  );

  const canvasWidth =
    devicePreview === 'desktop'
      ? '100%'
      : devicePreview === 'tablet'
        ? '768px'
        : '375px';

  return (
    <div
      className="flex flex-1 flex-col items-center overflow-y-auto bg-slate-100 p-6"
      onClick={(e) => {
        // Deselect when clicking on canvas background
        if (e.target === e.currentTarget) {
          selectBlock(null);
        }
      }}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div
          className={cn(
            'min-h-[600px] rounded-lg border border-slate-200 bg-white shadow-sm transition-all duration-300',
            devicePreview !== 'desktop' && 'mx-auto',
          )}
          style={{ width: canvasWidth, maxWidth: '100%' }}
        >
          {blocks.length === 0 ? (
            <EmptyCanvas />
          ) : (
            <SortableContext
              items={blocks.map((b) => b.id)}
              strategy={verticalListSortingStrategy}
            >
              {blocks.map((block) => (
                <BlockWrapper key={block.id} block={block} />
              ))}
            </SortableContext>
          )}
        </div>

        <DragOverlay>
          {activeCatalogType ? (
            <div className="flex items-center gap-2 rounded-lg border border-violet-300 bg-violet-50 px-4 py-3 shadow-lg">
              <Layers className="h-4 w-4 text-violet-600" />
              <span className="text-sm font-medium text-violet-700">
                {BLOCK_TYPE_LABELS[activeCatalogType] || activeCatalogType}
              </span>
            </div>
          ) : activeId ? (
            <div className="flex items-center gap-2 rounded-lg border border-blue-300 bg-blue-50 px-4 py-3 shadow-lg">
              <Layers className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">
                Moving block...
              </span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

function EmptyCanvas() {
  return (
    <div className="flex min-h-[600px] flex-col items-center justify-center gap-4 p-12 text-center">
      <div className="rounded-2xl bg-slate-50 p-6">
        <Plus className="h-12 w-12 text-slate-300" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-slate-700">
          Start building your page
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Drag blocks from the left sidebar to start designing your page.
        </p>
      </div>
    </div>
  );
}
