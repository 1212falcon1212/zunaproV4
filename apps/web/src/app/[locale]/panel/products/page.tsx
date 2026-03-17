'use client';

import { use, useEffect, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button } from '@zunapro/ui';
import { panelApi } from '@/lib/panel-api';
import { ProductTable } from './_components/product-table';
import { ProductFilters } from './_components/product-filters';

interface Product {
  id: string;
  name: Record<string, string>;
  slug: string;
  price: string | number;
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {t('subtitle', { count: meta.total })}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/${locale}/panel/products/import`}>
            <Button variant="outline">{t('import.title')}</Button>
          </Link>
          <Link href={`/${locale}/panel/products/new`}>
            <Button>{t('addProduct')}</Button>
          </Link>
        </div>
      </div>

      <ProductFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
      />

      {error && (
        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <ProductTable
          products={products}
          locale={locale}
          onDelete={handleDelete}
        />
      )}

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
          <span className="text-sm text-gray-500">
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
