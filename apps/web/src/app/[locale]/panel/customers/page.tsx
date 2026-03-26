'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { panelApi } from '@/lib/panel-api';
import { CustomerTable } from './_components/customer-table';

interface CustomersResponse {
  data: Array<{
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    isGuest: boolean;
    locale: string;
    createdAt: string;
    _count: { orders: number };
  }>;
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export default function CustomersPage() {
  const t = useTranslations('panel.customers');
  const [customers, setCustomers] = useState<CustomersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [page, setPage] = useState(1);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string | number> = { page, limit: 20 };
      if (search) params.search = search;
      if (filterType === 'guest') params.isGuest = 'true';
      if (filterType === 'registered') params.isGuest = 'false';
      const data = await panelApi.get<CustomersResponse>('/customers', params);
      setCustomers(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load customers',
      );
    } finally {
      setLoading(false);
    }
  }, [page, search, filterType]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleDelete = async (id: string) => {
    if (!confirm('Bu müşteriyi silmek istediğinize emin misiniz?')) return;
    try {
      await panelApi.delete(`/customers/${id}`);
      fetchCustomers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Müşteri silinemedi');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        {customers && (
          <p className="text-sm text-gray-500">
            {t('subtitle', { count: customers.meta.total })}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          {['all', 'registered', 'guest'].map((type) => (
            <button
              key={type}
              onClick={() => {
                setFilterType(type);
                setPage(1);
              }}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                filterType === type
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t(`filter.${type}`)}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder={t('searchPlaceholder')}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      ) : customers ? (
        <CustomerTable
          customers={customers.data}
          meta={customers.meta}
          onPageChange={setPage}
          onDelete={handleDelete}
        />
      ) : null}
    </div>
  );
}
