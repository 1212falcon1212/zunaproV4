'use client';

import { use } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ImportWizard } from './_components/import-wizard';

export default function ProductImportPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const t = useTranslations('panel.products.import');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
          <p className="mt-1 text-sm text-gray-500">{t('description')}</p>
        </div>
        <Link href={`/${locale}/panel/products`}>
          <span className="text-sm text-gray-500 hover:text-gray-700">
            {t('back')}
          </span>
        </Link>
      </div>

      <ImportWizard locale={locale} />
    </div>
  );
}
