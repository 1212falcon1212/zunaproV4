'use client';

import { useDraggable } from '@dnd-kit/core';
import { cn } from '@zunapro/ui';
import type { BlockType } from '@zunapro/types';
import {
  LayoutTemplate,
  Columns3,
  Minus,
  SeparatorHorizontal,
  Type,
  ImageIcon,
  MousePointerClick,
  Code2,
  ChevronDown,
  ShoppingBag,
  Grid3X3,
  Megaphone,
  Flag,
  GripVertical,
  Sparkles,
  List,
  LayoutGrid,
} from 'lucide-react';
import { useState } from 'react';

interface BlockCatalogItem {
  type: BlockType;
  label: string;
  icon: React.ReactNode;
}

interface BlockGroup {
  label: string;
  icon: React.ReactNode;
  items: BlockCatalogItem[];
}

const BLOCK_GROUPS: BlockGroup[] = [
  {
    label: 'Layout',
    icon: <LayoutTemplate className="h-4 w-4" />,
    items: [
      { type: 'container', label: 'Container', icon: <LayoutTemplate className="h-5 w-5" /> },
      { type: 'columns', label: 'Columns', icon: <Columns3 className="h-5 w-5" /> },
      { type: 'spacer', label: 'Spacer', icon: <Minus className="h-5 w-5" /> },
      { type: 'divider', label: 'Divider', icon: <SeparatorHorizontal className="h-5 w-5" /> },
    ],
  },
  {
    label: 'Content',
    icon: <Type className="h-4 w-4" />,
    items: [
      { type: 'text', label: 'Text', icon: <Type className="h-5 w-5" /> },
      { type: 'image', label: 'Image', icon: <ImageIcon className="h-5 w-5" /> },
      { type: 'button', label: 'Button', icon: <MousePointerClick className="h-5 w-5" /> },
      { type: 'html', label: 'HTML', icon: <Code2 className="h-5 w-5" /> },
      { type: 'accordion', label: 'Accordion', icon: <ChevronDown className="h-5 w-5" /> },
    ],
  },
  {
    label: 'Commerce',
    icon: <ShoppingBag className="h-4 w-4" />,
    items: [
      { type: 'product-showcase', label: 'Products', icon: <ShoppingBag className="h-5 w-5" /> },
      { type: 'category-showcase', label: 'Categories', icon: <Grid3X3 className="h-5 w-5" /> },
      { type: 'product-listing', label: 'Product Listing', icon: <List className="h-5 w-5" /> },
      { type: 'category-listing', label: 'Category Grid', icon: <LayoutGrid className="h-5 w-5" /> },
    ],
  },
  {
    label: 'Marketing',
    icon: <Megaphone className="h-4 w-4" />,
    items: [
      { type: 'hero', label: 'Hero', icon: <Sparkles className="h-5 w-5" /> },
      { type: 'banner', label: 'Banner', icon: <Flag className="h-5 w-5" /> },
    ],
  },
];

function DraggableBlockItem({ item }: { item: BlockCatalogItem }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `catalog-${item.type}`,
      data: {
        type: 'catalog-item',
        blockType: item.type,
      },
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        'group flex cursor-grab flex-col items-center gap-1.5 rounded-lg border border-slate-200 bg-white p-3 transition-all hover:border-violet-300 hover:shadow-sm active:cursor-grabbing',
        isDragging && 'opacity-50 shadow-lg ring-2 ring-violet-400',
      )}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-slate-500 transition-colors group-hover:bg-violet-50 group-hover:text-violet-600">
        {item.icon}
      </div>
      <span className="text-[11px] font-medium text-slate-600 group-hover:text-slate-800">
        {item.label}
      </span>
    </div>
  );
}

export function BlockSidebar() {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(
    BLOCK_GROUPS.map((g) => g.label),
  );

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) =>
      prev.includes(label)
        ? prev.filter((l) => l !== label)
        : [...prev, label],
    );
  };

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-slate-200 bg-slate-50">
      <div className="flex h-10 items-center border-b border-slate-200 px-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Blocks
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {BLOCK_GROUPS.map((group) => {
          const isExpanded = expandedGroups.includes(group.label);

          return (
            <div key={group.label} className="mb-4">
              <button
                onClick={() => toggleGroup(group.label)}
                className="mb-2 flex w-full items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-600"
              >
                <div className="flex items-center gap-1.5">
                  {group.icon}
                  <span>{group.label}</span>
                </div>
                <ChevronDown
                  className={cn(
                    'h-3 w-3 transition-transform',
                    isExpanded && 'rotate-180',
                  )}
                />
              </button>

              {isExpanded && (
                <div className="grid grid-cols-2 gap-2">
                  {group.items.map((item) => (
                    <DraggableBlockItem key={item.type} item={item} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
