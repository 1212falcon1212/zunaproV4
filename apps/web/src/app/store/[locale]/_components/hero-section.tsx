import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

interface HeroSectionProps {
  locale: string;
}

export async function HeroSection({ locale }: HeroSectionProps) {
  const t = await getTranslations('storefront');

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)]">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="max-w-2xl">
          <h1
            className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {t('heroTitle')}
          </h1>
          <p className="mt-6 text-lg text-white/80">
            {t('heroSubtitle')}
          </p>
          <div className="mt-8 flex gap-4">
            <Link
              href={`/store/${locale}/products`}
              className="inline-flex items-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-[var(--color-primary)] shadow-sm hover:bg-gray-50"
            >
              {t('hero.shopNow')}
            </Link>
            <Link
              href={`/store/${locale}/categories`}
              className="inline-flex items-center rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              {t('hero.browseCategories')}
            </Link>
          </div>
        </div>
      </div>
      {/* Decorative gradient overlay */}
      <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-white/5" />
      <div className="absolute -bottom-10 -left-10 h-64 w-64 rounded-full bg-white/5" />
    </section>
  );
}
