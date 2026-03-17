'use client';

import { use, useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Badge, Button } from '@zunapro/ui';
import { getUserFromToken, getAccessToken } from '@/lib/auth';
import {
  FileText,
  Plus,
  Eye,
  EyeOff,
  ExternalLink,
  Pencil,
  Globe,
  Clock,
  LayoutTemplate,
  Copy,
  Trash2,
  Loader2,
  PanelTop,
  PanelBottom,
} from 'lucide-react';
import Link from 'next/link';

const PLATFORM_TENANT_ID = '00000000-0000-0000-0000-000000000000';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface PageItem {
  id: string;
  title: Record<string, string>;
  slug: string;
  isPublished: boolean;
  template: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

function formatDate(dateStr: string, locale: string): string {
  return new Date(dateStr).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function PagesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const t = useTranslations('panel.pages');
  const [pages, setPages] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [storeBaseUrl, setStoreBaseUrl] = useState('');
  const [tenantSlug, setTenantSlug] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const user = getUserFromToken();
      if (!user || user.tenantId === PLATFORM_TENANT_ID) {
        setLoading(false);
        return;
      }

      const token = getAccessToken();

      try {
        const tenantRes = await fetch(`${API_URL}/tenants/${user.tenantId}`);
        const tenant = await tenantRes.json();
        if (tenant.slug) setTenantSlug(tenant.slug);
        if (tenant.domain) {
          setStoreBaseUrl(tenant.domain);
        } else if (tenant.slug) {
          setStoreBaseUrl(`${tenant.slug}.zunapro.com`);
        }

        const pagesRes = await fetch(`${API_URL}/pages`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-tenant-slug': tenant.slug,
          },
        });

        if (pagesRes.ok) {
          const data = await pagesRes.json();
          setPages(data.data || []);
        }
      } catch {
        // Failed to load
      }
      setLoading(false);
    };

    loadData();
  }, []);

  const createPage = async () => {
    setCreating(true);
    const token = getAccessToken();
    try {
      const res = await fetch(`${API_URL}/pages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'x-tenant-slug': tenantSlug,
        },
        body: JSON.stringify({
          title: { en: 'New Page', tr: 'Yeni Sayfa', de: 'Neue Seite', fr: 'Nouvelle Page', es: 'Nueva Pagina' },
        }),
      });
      if (res.ok) {
        const page = await res.json();
        setPages((prev) => [...prev, page]);
        window.location.href = `/${locale}/panel/pages/${page.id}/edit`;
      }
    } catch {
      // Failed
    }
    setCreating(false);
  };

  const togglePublish = async (page: PageItem) => {
    const token = getAccessToken();
    const res = await fetch(`${API_URL}/pages/${page.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'x-tenant-slug': tenantSlug,
      },
      body: JSON.stringify({ isPublished: !page.isPublished }),
    });

    if (res.ok) {
      setPages((prev) =>
        prev.map((p) =>
          p.id === page.id ? { ...p, isPublished: !p.isPublished } : p,
        ),
      );
    }
  };

  const duplicatePage = async (pageId: string) => {
    const token = getAccessToken();
    const res = await fetch(`${API_URL}/pages/${pageId}/duplicate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'x-tenant-slug': tenantSlug,
      },
    });

    if (res.ok) {
      const newPage = await res.json();
      setPages((prev) => [...prev, newPage]);
    }
  };

  const deletePage = async (pageId: string) => {
    const token = getAccessToken();
    const res = await fetch(`${API_URL}/pages/${pageId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'x-tenant-slug': tenantSlug,
      },
    });

    if (res.ok) {
      setPages((prev) => prev.filter((p) => p.id !== pageId));
    }
  };

  const getPageName = (page: PageItem) =>
    page.title[locale] ?? page.title.en ?? page.slug;

  const getPagePreviewUrl = (pageSlug: string) => {
    if (
      typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1')
    ) {
      return `/_store/${tenantSlug}/${locale}${pageSlug === 'home' ? '' : `/pages/${pageSlug}`}`;
    }
    return storeBaseUrl
      ? `https://${storeBaseUrl}${pageSlug === 'home' ? '' : `/pages/${pageSlug}`}`
      : null;
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
          <p className="mt-1 text-sm text-gray-500">{t('subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/${locale}/panel/pages/header`}>
            <Button variant="outline" className="gap-2">
              <PanelTop className="h-4 w-4" />
              {t('editHeader')}
            </Button>
          </Link>
          <Link href={`/${locale}/panel/pages/footer`}>
            <Button variant="outline" className="gap-2">
              <PanelBottom className="h-4 w-4" />
              {t('editFooter')}
            </Button>
          </Link>
          <Button onClick={createPage} disabled={creating} className="gap-2">
            {creating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {t('createPage')}
          </Button>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                {t('pageName')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                {t('slug')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                {t('status')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                {t('lastModified')}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                {t('actions')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {pages.map((page) => (
              <tr
                key={page.id}
                className="transition-colors hover:bg-gray-50"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium text-gray-900">
                      {getPageName(page)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-sm text-gray-500">
                    <Globe className="h-3.5 w-3.5 shrink-0" />
                    <span className="font-mono text-xs">/{page.slug}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge
                    className={
                      page.isPublished
                        ? 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100'
                        : 'border-gray-200 bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }
                  >
                    {page.isPublished ? (
                      <Eye className="mr-1 h-3 w-3" />
                    ) : (
                      <EyeOff className="mr-1 h-3 w-3" />
                    )}
                    {page.isPublished ? t('published') : t('draft')}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-sm text-gray-500">
                    <Clock className="h-3.5 w-3.5" />
                    {formatDate(page.updatedAt, locale)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1">
                    {getPagePreviewUrl(page.slug) && (
                      <a
                        href={getPagePreviewUrl(page.slug)!}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="ghost" size="sm" title={t('viewPage')}>
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </a>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePublish(page)}
                      title={page.isPublished ? t('draft') : t('published')}
                    >
                      {page.isPublished ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => duplicatePage(page.id)}
                      title="Duplicate"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Link href={`/${locale}/panel/pages/${page.id}/edit`}>
                      <Button variant="outline" size="sm" className="gap-1.5">
                        <LayoutTemplate className="h-3.5 w-3.5" />
                        {t('edit')}
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deletePage(page.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {pages.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                  <FileText className="mx-auto mb-3 h-8 w-8" />
                  <p>{t('noPages')}</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-3 md:hidden">
        {pages.map((page) => (
          <div
            key={page.id}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {getPageName(page)}
                  </p>
                  <div className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                    <Globe className="h-3 w-3" />
                    <span className="font-mono">/{page.slug}</span>
                  </div>
                </div>
              </div>
              <Badge
                className={
                  page.isPublished
                    ? 'border-green-200 bg-green-50 text-green-700'
                    : 'border-gray-200 bg-gray-100 text-gray-600'
                }
              >
                {page.isPublished ? t('published') : t('draft')}
              </Badge>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                {formatDate(page.updatedAt, locale)}
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => togglePublish(page)}
                >
                  {page.isPublished ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
                <Link href={`/${locale}/panel/pages/${page.id}/edit`}>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <LayoutTemplate className="h-3.5 w-3.5" />
                    {t('edit')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
