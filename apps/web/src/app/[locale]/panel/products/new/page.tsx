'use client';

import { use } from 'react';
import { useTranslations } from 'next-intl';
import { ProductForm } from '../_components/product-form';

export default function NewProductPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const t = useTranslations('panel.products');

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">{t('addProduct')}</h1>
      <ProductForm locale={locale} />
    </div>
  );
}
