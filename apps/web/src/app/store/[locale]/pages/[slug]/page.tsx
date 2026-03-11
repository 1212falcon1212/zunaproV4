import { useTranslations } from 'next-intl';

export default function ContentPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const t = useTranslations('storefront');

  return (
    <div className="min-h-screen px-6 py-12">
      <p className="text-gray-500">{t('staticPage')}</p>
    </div>
  );
}
