'use client';

import { use, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { panelApi } from '@/lib/panel-api';
import { ProductForm } from '../_components/product-form';

interface Product {
  id: string;
  name: Record<string, string>;
  description: Record<string, string> | null;
  price: string | number;
  compareAtPrice: string | number | null;
  sku: string | null;
  stock: number;
  images: string[];
  variants: Record<string, unknown>[];
  categoryId: string | null;
  status: string;
  isFeatured?: boolean;
  seoMeta: Record<string, unknown> | null;
}

export default function EditProductPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = use(params);
  const t = useTranslations('panel.products');
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    panelApi
      .get<Product>(`/products/${id}`)
      .then((data) => setProduct(data))
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Failed to load product'),
      )
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        {error || 'Product not found'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-slate-500">
        <Link
          href={`/${locale}/panel`}
          className="transition-colors hover:text-slate-700"
        >
          {t('breadcrumb.panel')}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link
          href={`/${locale}/panel/products`}
          className="transition-colors hover:text-slate-700"
        >
          {t('title')}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-slate-800">{t('editProduct')}</span>
      </nav>

      {/* Header */}
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">
        {t('editProduct')}
      </h1>

      <ProductForm
        locale={locale}
        initialData={{
          id: product.id,
          name: product.name as Record<string, string> & { en: string; tr: string; de: string; fr: string; es: string },
          description: (product.description ?? {}) as Record<string, string> & { en: string; tr: string; de: string; fr: string; es: string },
          price: Number(product.price),
          compareAtPrice: product.compareAtPrice
            ? Number(product.compareAtPrice)
            : null,
          sku: product.sku,
          stock: product.stock,
          images: product.images,
          variants: product.variants,
          categoryId: product.categoryId,
          status: product.status as 'draft' | 'active' | 'archived',
          isFeatured: product.isFeatured ?? false,
          seoMeta: product.seoMeta ?? undefined,
        }}
      />
    </div>
  );
}
