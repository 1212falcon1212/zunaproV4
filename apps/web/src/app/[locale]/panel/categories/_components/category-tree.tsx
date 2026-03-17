'use client';

import { useTranslations } from 'next-intl';
import { Button, Badge } from '@zunapro/ui';

interface Category {
  id: string;
  name: Record<string, string>;
  slug: string;
  parentId: string | null;
  sortOrder: number;
  productCount?: number;
  children?: Category[];
}

interface CategoryTreeProps {
  categories: Category[];
  locale: string;
  depth?: number;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

export function CategoryTree({
  categories,
  locale,
  depth = 0,
  onEdit,
  onDelete,
}: CategoryTreeProps) {
  const t = useTranslations('panel.categories');

  if (categories.length === 0 && depth === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
        <p className="text-sm text-gray-500">{t('empty')}</p>
      </div>
    );
  }

  return (
    <div className={depth > 0 ? 'ml-6 border-l pl-4' : ''}>
      {categories.map((category) => {
        const name =
          (category.name as Record<string, string>)[locale] ||
          (category.name as Record<string, string>).en ||
          category.slug;

        return (
          <div key={category.id} className="py-1">
            <div className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-900">
                  {name}
                </span>
                {category.productCount !== undefined && (
                  <Badge variant="secondary" className="text-xs">
                    {category.productCount} {t('products')}
                  </Badge>
                )}
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(category)}
                >
                  {t('edit')}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(category.id)}
                  className="text-destructive hover:text-destructive"
                >
                  {t('delete')}
                </Button>
              </div>
            </div>
            {category.children && category.children.length > 0 && (
              <CategoryTree
                categories={category.children}
                locale={locale}
                depth={depth + 1}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
