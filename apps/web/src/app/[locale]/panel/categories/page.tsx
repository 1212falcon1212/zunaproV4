'use client';

import { use, useEffect, useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Button, Card, CardContent, Badge } from '@zunapro/ui';
import { panelApi } from '@/lib/panel-api';
import { CategoryForm } from './_components/category-form';
import { CategoryTree } from './_components/category-tree';
import {
  Plus,
  Search,
  Layers,
  FolderTree,
  GitBranch,
  Star,
  X,
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

function countAll(cats: Category[]): number {
  let count = cats.length;
  for (const cat of cats) {
    if (cat.children) count += countAll(cat.children);
  }
  return count;
}

function countParents(cats: Category[]): number {
  return cats.length;
}

function countSubs(cats: Category[]): number {
  let count = 0;
  for (const cat of cats) {
    if (cat.children) {
      count += cat.children.length;
      count += countSubs(cat.children);
    }
  }
  return count;
}

function countFeatured(cats: Category[]): number {
  let count = 0;
  for (const cat of cats) {
    if (cat.isFeatured) count++;
    if (cat.children) count += countFeatured(cat.children);
  }
  return count;
}

export default function CategoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const t = useTranslations('panel.categories');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [search, setSearch] = useState('');

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await panelApi.get<Category[]>('/categories');
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const stats = useMemo(() => ({
    total: countAll(categories),
    parents: countParents(categories),
    subs: countSubs(categories),
    featured: countFeatured(categories),
  }), [categories]);

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('deleteConfirm'))) return;
    try {
      await panelApi.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category');
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingCategory(null);
    fetchCategories();
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {t('title')}
          </h1>
          <p className="mt-1 text-sm text-slate-500">{t('subtitle')}</p>
        </div>
        <Button
          onClick={() => {
            setEditingCategory(null);
            setShowForm(true);
          }}
          className="bg-violet-600 shadow-sm hover:bg-violet-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          {t('addCategory')}
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="border-slate-200">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50">
              <Layers className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              <p className="text-xs text-slate-500">{t('totalCategories')}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50">
              <FolderTree className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.parents}</p>
              <p className="text-xs text-slate-500">{t('parentCategories')}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
              <GitBranch className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.subs}</p>
              <p className="text-xs text-slate-500">{t('subcategories')}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
              <Star className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.featured}</p>
              <p className="text-xs text-slate-500">{t('featuredCategories')}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="overflow-hidden border-slate-200">
        {/* Search Bar */}
        <div className="border-b border-slate-100 px-5 py-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mx-5 mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
          </div>
        ) : (
          <CardContent className="p-0">
            {categories.length === 0 && !search ? (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-20">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                  <Package className="h-10 w-10 text-slate-300" />
                </div>
                <h3 className="mt-5 text-base font-semibold text-slate-700">
                  {t('createFirst')}
                </h3>
                <p className="mt-1 max-w-sm text-center text-sm text-slate-400">
                  {t('emptyDescription')}
                </p>
                <Button
                  onClick={() => {
                    setEditingCategory(null);
                    setShowForm(true);
                  }}
                  className="mt-5 bg-violet-600 hover:bg-violet-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {t('addCategory')}
                </Button>
              </div>
            ) : (
              <CategoryTree
                categories={categories}
                locale={locale}
                search={search}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </CardContent>
        )}
      </Card>

      {/* Slide-over Panel */}
      {showForm && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[60] bg-black/30 transition-opacity"
            onClick={handleCloseForm}
          />
          {/* Panel */}
          <div className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-lg flex-col border-l border-slate-200 bg-white shadow-2xl">
            {/* Panel Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">
                {editingCategory ? t('editCategory') : t('addCategory')}
              </h2>
              <button
                type="button"
                onClick={handleCloseForm}
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {/* Panel Body */}
            <CategoryForm
              locale={locale}
              initialData={
                editingCategory
                  ? {
                      id: editingCategory.id,
                      name: editingCategory.name,
                      slug: editingCategory.slug,
                      parentId: editingCategory.parentId,
                      sortOrder: editingCategory.sortOrder,
                      image: editingCategory.image,
                      isFeatured: editingCategory.isFeatured,
                    }
                  : undefined
              }
              categories={categories}
              onSuccess={handleFormSuccess}
              onCancel={handleCloseForm}
            />
          </div>
        </>
      )}
    </div>
  );
}
