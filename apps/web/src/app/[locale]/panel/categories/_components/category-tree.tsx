'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Badge, Button } from '@zunapro/ui';
import {
  ChevronRight,
  ChevronDown,
  Pencil,
  Trash2,
  Star,
  Package,
} from 'lucide-react';

interface Category {
  id: string;
  name: Record<string, string>;
  slug: string;
  parentId: string | null;
  sortOrder: number;
  productCount?: number;
  image?: string;
  isFeatured?: boolean;
  children?: Category[];
}

interface CategoryTreeProps {
  categories: Category[];
  locale: string;
  search: string;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

function CategoryTreeItem({
  category,
  locale,
  depth,
  onEdit,
  onDelete,
}: {
  category: Category;
  locale: string;
  depth: number;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}) {
  const t = useTranslations('panel.categories');
  const [expanded, setExpanded] = useState(true);
  const hasChildren = category.children && category.children.length > 0;
  const name = category.name[locale] || category.name.en || category.slug;
  const count = category.productCount ?? 0;

  return (
    <div>
      <div
        className="group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-slate-50"
        style={{ paddingLeft: `${12 + depth * 24}px` }}
      >
        {/* Expand/Collapse */}
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded transition-colors ${
            hasChildren
              ? 'text-slate-400 hover:bg-slate-200 hover:text-slate-600'
              : 'invisible'
          }`}
        >
          {expanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>

        {/* Image Thumbnail */}
        {category.image ? (
          <img
            src={category.image}
            alt={name}
            className="h-8 w-8 shrink-0 rounded-md border border-slate-200 object-cover"
          />
        ) : (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-slate-50">
            <Package className="h-4 w-4 text-slate-400" />
          </div>
        )}

        {/* Name & Slug */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-medium text-slate-800">
              {name}
            </span>
            {category.isFeatured && (
              <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" />
            )}
          </div>
          <p className="truncate text-xs text-slate-400">{category.slug}</p>
        </div>

        {/* Product Count Badge */}
        <Badge
          variant="secondary"
          className="shrink-0 bg-slate-100 text-xs font-normal text-slate-600"
        >
          {count} {t('products')}
        </Badge>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => onEdit(category)}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-slate-400 hover:text-rose-600"
            onClick={() => onDelete(category.id)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Connecting line + Children */}
      {hasChildren && expanded && (
        <div className="relative" style={{ marginLeft: `${24 + depth * 24}px` }}>
          <div className="absolute bottom-0 left-0 top-0 w-px border-l border-dashed border-slate-200" />
          <div>
            {category.children!.map((child) => (
              <CategoryTreeItem
                key={child.id}
                category={child}
                locale={locale}
                depth={depth + 1}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function CategoryTree({
  categories,
  locale,
  search,
  onEdit,
  onDelete,
}: CategoryTreeProps) {
  const t = useTranslations('panel.categories');

  const filterCategories = (cats: Category[], query: string): Category[] => {
    if (!query.trim()) return cats;
    const q = query.toLowerCase();
    const matches: Category[] = [];
    for (const cat of cats) {
      const catName = cat.name[locale] || cat.name.en || cat.slug;
      const childMatches = cat.children
        ? filterCategories(cat.children, query)
        : [];
      if (catName.toLowerCase().includes(q) || childMatches.length > 0) {
        matches.push({
          ...cat,
          children: childMatches.length > 0 ? childMatches : cat.children,
        });
      }
    }
    return matches;
  };

  const filtered = filterCategories(categories, search);

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
          <Package className="h-8 w-8 text-slate-300" />
        </div>
        <p className="mt-4 text-sm font-medium text-slate-500">{t('empty')}</p>
        <p className="mt-1 text-xs text-slate-400">{t('emptyDescription')}</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100">
      {filtered.map((category) => (
        <CategoryTreeItem
          key={category.id}
          category={category}
          locale={locale}
          depth={0}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
