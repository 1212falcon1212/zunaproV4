'use client';

import { use, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
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
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
        {error || 'Product not found'}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">{t('editProduct')}</h1>
      <ProductForm
        locale={locale}
        initialData={{
          id: product.id,
          name: product.name,
          description: product.description ?? {},
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
          seoMeta: product.seoMeta ?? undefined,
        }}
      />
    </div>
  );
}
