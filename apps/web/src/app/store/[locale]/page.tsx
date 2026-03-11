import { useTranslations } from 'next-intl';

export default function StorefrontHome() {
  const t = useTranslations('storefront');

  return (
    <div className="min-h-screen">
      <header className="border-b px-6 py-4">
        <h1 className="text-xl font-bold">{t('welcome')}</h1>
      </header>
      <section className="px-6 py-12 text-center">
        <h2 className="text-3xl font-bold">{t('heroTitle')}</h2>
        <p className="mt-4 text-gray-600">{t('heroSubtitle')}</p>
      </section>
    </div>
  );
}
