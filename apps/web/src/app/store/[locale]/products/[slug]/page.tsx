import { useTranslations } from 'next-intl';

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const t = useTranslations('storefront');

  return (
    <div className="min-h-screen px-6 py-12">
      <p className="text-gray-500">{t('productDetail')}</p>
    </div>
  );
}
