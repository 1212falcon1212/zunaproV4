'use client';

import { use, useEffect, useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button, Card, CardContent } from '@zunapro/ui';
import { panelApi } from '@/lib/panel-api';
import { ProductTable } from './_components/product-table';
import { ProductFilters } from './_components/product-filters';

interface Product {
  id: string;
  name: Record<string, string>;
  slug: string;
  price: string | number;
  compareAtPrice?: string | number | null;
  stock: number;
  status: string;
  images: string[];
  category: { id: string; name: Record<string, string>; slug: string } | null;
}

interface PaginatedResponse {
  data: Product[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export default function ProductListPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const t = useTranslations('panel.products');
  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const stats = useMemo(() => {
    const active = products.filter((p) => p.status === 'active').length;
    const draft = products.filter((p) => p.status === 'draft').length;
    const archived = products.filter((p) => p.status === 'archived').length;
    return { total: meta.total, active, draft, archived };
  }, [products, meta.total]);

  const fetchProducts = useCallback(
    async (page = 1) => {
      setLoading(true);
      setError('');
      try {
        const params: Record<string, string | number | undefined> = {
          page,
          limit: 20,
        };
        if (status !== 'all') params.status = status;
        if (search) params.search = search;

        const res = await panelApi.get<PaginatedResponse>('/products', params);
        setProducts(res.data);
        setMeta(res.meta);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    },
    [status, search],
  );

  useEffect(() => {
    const debounce = setTimeout(() => fetchProducts(1), search ? 300 : 0);
    return () => clearTimeout(debounce);
  }, [fetchProducts, search]);

  const handleDelete = async (id: string) => {
    if (!confirm(t('deleteConfirm'))) return;
    try {
      await panelApi.delete(`/products/${id}`);
      fetchProducts(meta.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
    }
  };

  const handleBulkDelete = async (ids: string[]) => {
    if (ids.length === 0) return;
    const ok = confirm(`${ids.length} urunu silmek istediginize emin misiniz?`);
    if (!ok) return;
    setLoading(true);
    setError('');
    let deleted = 0;
    for (const id of ids) {
      try {
        await panelApi.delete(`/products/${id}`);
        deleted++;
      } catch {
        // continue with others
      }
    }
    setLoading(false);
    if (deleted > 0) fetchProducts(meta.page);
    if (deleted < ids.length) {
      setError(`${ids.length - deleted} urun silinemedi`);
    }
  };

  const statCards = [
    {
      label: t('stats.total'),
      value: stats.total,
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      label: t('stats.active'),
      value: stats.active,
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
    },
    {
      label: t('stats.draft'),
      value: stats.draft,
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
    },
    {
      label: t('stats.archived'),
      value: stats.archived,
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      ),
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {t('title')}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('subtitle', { count: meta.total })}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/${locale}/panel/products/import`}>
            <Button variant="outline" className="gap-2">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              {t('import.title')}
            </Button>
          </Link>
          <Link href={`/${locale}/panel/products/new`}>
            <Button className="gap-2">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {t('addProduct')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className="border">
            <CardContent className="flex items-center gap-4 p-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bgColor} ${stat.textColor}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <ProductFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
      />

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Product Table inside Card */}
      <Card className="border">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : (
            <ProductTable
              products={products}
              locale={locale}
              onDelete={handleDelete}
              onBulkDelete={handleBulkDelete}
            />
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={meta.page <= 1}
            onClick={() => fetchProducts(meta.page - 1)}
          >
            {t('prev')}
          </Button>
          <span className="text-sm text-muted-foreground">
            {meta.page} / {meta.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={meta.page >= meta.totalPages}
            onClick={() => fetchProducts(meta.page + 1)}
          >
            {t('next')}
          </Button>
        </div>
      )}
    </div>
  );
}
