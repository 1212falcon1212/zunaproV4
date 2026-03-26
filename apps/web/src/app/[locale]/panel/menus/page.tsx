'use client';

import { use, useEffect, useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@zunapro/ui';
import { panelApi } from '@/lib/panel-api';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  X,
  GripVertical,
  Check,
  Loader2,
} from 'lucide-react';

type MenuLocation = 'header' | 'top-header' | 'footer' | 'mobile';
type MenuItemType = 'page' | 'category' | 'custom';

interface MenuItem {
  id: string;
  label: Record<string, string>;
  type: MenuItemType;
  href: string;
  sortOrder: number;
  children?: MenuItem[];
}

interface MenuData {
  id: string;
  name: Record<string, string>;
  location: MenuLocation;
  isActive: boolean;
  items: MenuItem[];
  createdAt: string;
  updatedAt: string;
}

interface MenuFormData {
  id?: string;
  name: Record<string, string>;
  location: MenuLocation;
  isActive: boolean;
  items: MenuItem[];
}

const LOCATIONS: MenuLocation[] = ['header', 'top-header', 'footer', 'mobile'];
const ITEM_TYPES: MenuItemType[] = ['page', 'category', 'custom'];

function generateTempId(): string {
  return `temp_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export default function MenusPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const t = useTranslations('panel.menus');

  const [menus, setMenus] = useState<MenuData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<MenuFormData>({
    name: { en: '' },
    location: 'header',
    isActive: true,
    items: [],
  });

  // New item form state
  const [newItemLabel, setNewItemLabel] = useState('');
  const [newItemType, setNewItemType] = useState<MenuItemType>('custom');
  const [newItemHref, setNewItemHref] = useState('');

  const fetchMenus = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await panelApi.get<MenuData[]>('/menus');
      setMenus(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load menus');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  const filteredMenus = useMemo(() => {
    if (!search.trim()) return menus;
    const q = search.toLowerCase();
    return menus.filter((menu) => {
      const name = menu.name[locale] || menu.name.en || '';
      return name.toLowerCase().includes(q) || menu.location.toLowerCase().includes(q);
    });
  }, [menus, search, locale]);

  const openCreateForm = () => {
    setFormData({
      name: { en: '' },
      location: 'header',
      isActive: true,
      items: [],
    });
    setNewItemLabel('');
    setNewItemType('custom');
    setNewItemHref('');
    setShowForm(true);
  };

  const openEditForm = (menu: MenuData) => {
    setFormData({
      id: menu.id,
      name: { ...menu.name },
      location: menu.location,
      isActive: menu.isActive,
      items: menu.items.map((item) => ({ ...item, label: { ...item.label } })),
    });
    setNewItemLabel('');
    setNewItemType('custom');
    setNewItemHref('');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setFormData({
      name: { en: '' },
      location: 'header',
      isActive: true,
      items: [],
    });
  };

  const handleSave = async () => {
    if (!formData.name.en?.trim()) {
      setError('Menu name (EN) is required');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const payload = {
        name: formData.name,
        location: formData.location,
        isActive: formData.isActive,
        items: formData.items.map((item, idx) => ({
          id: item.id.startsWith('temp_') ? undefined : item.id,
          label: item.label,
          type: item.type,
          href: item.href,
          sortOrder: idx,
        })),
      };

      if (formData.id) {
        await panelApi.patch(`/menus/${formData.id}`, payload);
      } else {
        await panelApi.post('/menus', payload);
      }
      closeForm();
      fetchMenus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save menu');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('deleteConfirm'))) return;
    setError('');
    try {
      await panelApi.delete(`/menus/${id}`);
      fetchMenus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete menu');
    }
  };

  const addItem = () => {
    if (!newItemLabel.trim() || !newItemHref.trim()) return;

    const newItem: MenuItem = {
      id: generateTempId(),
      label: { en: newItemLabel },
      type: newItemType,
      href: newItemHref,
      sortOrder: formData.items.length,
    };

    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
    setNewItemLabel('');
    setNewItemHref('');
    setNewItemType('custom');
  };

  const removeItem = (itemId: string) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== itemId),
    }));
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...formData.items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  const getMenuName = (menu: MenuData): string => {
    return menu.name[locale] || menu.name.en || '(Untitled)';
  };

  const getItemCount = (menu: MenuData): number => {
    return menu.items?.length || 0;
  };

  return (
    <div className="space-y-6">
      {/* Form */}
      {showForm && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-800">
              {formData.id ? t('editMenu') : t('createMenu')}
            </p>
            <button
              onClick={closeForm}
              className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                {t('name')} (EN) *
              </label>
              <input
                value={formData.name.en || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    name: { ...prev.name, en: e.target.value },
                  }))
                }
                placeholder={t('namePlaceholder')}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 placeholder:text-slate-400"
              />
            </div>

            {/* Location */}
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                {t('location')}
              </label>
              <select
                value={formData.location}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    location: e.target.value as MenuLocation,
                  }))
                }
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {t(`locations.${loc}`)}
                  </option>
                ))}
              </select>
            </div>

            {/* Active toggle */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, isActive: !prev.isActive }))
                }
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  formData.isActive ? 'bg-violet-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    formData.isActive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className="text-sm text-slate-600">
                {formData.isActive ? t('active') : t('inactive')}
              </span>
            </div>

            {/* Menu Items */}
            <div>
              <label className="mb-2 block text-xs font-medium text-slate-600">
                {t('items')}
              </label>

              {formData.items.length === 0 ? (
                <p className="rounded-lg bg-slate-50 px-3 py-4 text-center text-sm text-slate-400">
                  {t('noItems')}
                </p>
              ) : (
                <div className="space-y-1.5">
                  {formData.items.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
                    >
                      <GripVertical className="h-4 w-4 shrink-0 text-slate-300" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-700">
                          {item.label[locale] || item.label.en}
                        </p>
                        <p className="truncate text-xs text-slate-400">
                          {item.type} &middot; {item.href}
                        </p>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <button
                          onClick={() => moveItem(index, 'up')}
                          disabled={index === 0}
                          className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent"
                        >
                          <ChevronUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => moveItem(index, 'down')}
                          disabled={index === formData.items.length - 1}
                          className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent"
                        >
                          <ChevronDown className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="rounded p-1 text-slate-400 hover:bg-rose-100 hover:text-rose-600"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add item form */}
              <div className="mt-3 rounded-lg border border-dashed border-slate-300 bg-white p-3">
                <p className="mb-2 text-xs font-medium text-slate-500">
                  {t('addItem')}
                </p>
                <div className="grid gap-2 sm:grid-cols-[1fr_auto_1fr_auto]">
                  <input
                    value={newItemLabel}
                    onChange={(e) => setNewItemLabel(e.target.value)}
                    placeholder={t('itemLabelPlaceholder')}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-violet-400 placeholder:text-slate-400"
                  />
                  <select
                    value={newItemType}
                    onChange={(e) => setNewItemType(e.target.value as MenuItemType)}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-violet-400"
                  >
                    {ITEM_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {t(`itemTypes.${type}`)}
                      </option>
                    ))}
                  </select>
                  <input
                    value={newItemHref}
                    onChange={(e) => setNewItemHref(e.target.value)}
                    placeholder={t('itemHrefPlaceholder')}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-violet-400 placeholder:text-slate-400"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addItem();
                      }
                    }}
                  />
                  <button
                    onClick={addItem}
                    disabled={!newItemLabel.trim() || !newItemHref.trim()}
                    className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 disabled:opacity-40 disabled:hover:bg-slate-100"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Form actions */}
            <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                onClick={closeForm}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                {t('cancel')}
              </button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="h-[38px] rounded-lg bg-violet-600 px-4 text-white shadow-[0_8px_18px_rgba(124,58,237,0.35)] hover:bg-violet-700 disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                    {t('saving')}
                  </>
                ) : (
                  <>
                    <Check className="mr-1.5 h-4 w-4" />
                    {t('save')}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Menu list */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Header */}
        <div className="border-b border-slate-100 p-5">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-slate-800">{t('title')}</h1>
              <p className="text-sm text-slate-500">{t('description')}</p>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>
            <Button
              onClick={openCreateForm}
              className="h-[42px] rounded-lg bg-violet-600 px-4 text-white shadow-[0_8px_18px_rgba(124,58,237,0.35)] hover:bg-violet-700"
            >
              <Plus className="mr-1 h-4 w-4" />
              {t('createMenu')}
            </Button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mx-5 mt-4 flex items-center justify-between rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
            <span>{error}</span>
            <button onClick={() => setError('')} className="ml-2 text-rose-400 hover:text-rose-600">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/40 text-left">
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                      {t('name')}
                    </th>
                    <th className="px-2 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                      {t('location')}
                    </th>
                    <th className="px-2 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600 text-center">
                      {t('items')}
                    </th>
                    <th className="px-2 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600 text-center">
                      Status
                    </th>
                    <th className="w-28 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMenus.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-12 text-center text-sm text-slate-400">
                        {t('empty')}
                      </td>
                    </tr>
                  ) : (
                    filteredMenus.map((menu) => {
                      const itemCount = getItemCount(menu);
                      return (
                        <tr key={menu.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                          <td className="px-5 py-3">
                            <p className="text-sm font-semibold text-slate-800">
                              {getMenuName(menu)}
                            </p>
                          </td>
                          <td className="px-2 py-3">
                            <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                              {t(`locations.${menu.location}`)}
                            </span>
                          </td>
                          <td className="px-2 py-3 text-center text-sm text-slate-600">
                            {t('itemCount', { count: itemCount })}
                          </td>
                          <td className="px-2 py-3 text-center">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                menu.isActive
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              {menu.isActive ? t('active') : t('inactive')}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openEditForm(menu)}
                                className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                                title={t('editMenu')}
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(menu.id)}
                                className="rounded-md p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4 text-sm text-slate-500">
              <p>
                {filteredMenus.length} {filteredMenus.length === 1 ? 'menu' : 'menus'}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
