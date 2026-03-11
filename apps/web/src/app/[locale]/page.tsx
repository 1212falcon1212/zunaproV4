import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function LandingPage() {
  const t = useTranslations('landing');
  const tc = useTranslations('common');

  return (
    <main className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b">
        <span className="text-xl font-bold">{tc('appName')}</span>
        <nav className="flex items-center gap-4">
          <span className="text-sm hover:underline cursor-pointer">{tc('pricing')}</span>
          <span className="text-sm hover:underline cursor-pointer">{tc('login')}</span>
          <span className="rounded-md bg-black px-4 py-2 text-sm text-white hover:bg-gray-800 cursor-pointer">
            {tc('signup')}
          </span>
        </nav>
      </header>

      <section className="flex flex-1 flex-col items-center justify-center gap-6 px-4 text-center">
        <h1 className="max-w-3xl text-5xl font-bold tracking-tight">
          {t('hero.title')}
        </h1>
        <p className="max-w-2xl text-lg text-gray-600">
          {t('hero.subtitle')}
        </p>
        <Link
          href="/wizard"
          className="rounded-md bg-black px-8 py-3 text-lg font-medium text-white hover:bg-gray-800"
        >
          {t('hero.cta')}
        </Link>
      </section>
    </main>
  );
}
