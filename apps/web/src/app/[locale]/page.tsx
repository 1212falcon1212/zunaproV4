'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowRight,
  Store,
  ShieldCheck,
  Zap,
  Globe,
  BarChart3,
  ChevronRight,
} from 'lucide-react';

export default function LandingPage() {
  const t = useTranslations('landing');
  const tc = useTranslations('common');
  const params = useParams();
  const locale = params.locale as string;

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href={`/${locale}`} className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500">
              <span className="text-sm font-bold text-white">Z</span>
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              {tc('appName')}
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link href={`/${locale}#features`} className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
              {t('nav.features')}
            </Link>
            <Link href={`/${locale}#pricing`} className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
              {tc('pricing')}
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href={`/${locale}/auth/login`}
              className="rounded-xl px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              {tc('login')}
            </Link>
            <Link
              href={`/${locale}/auth/register`}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-violet-500/20 transition-all hover:shadow-lg hover:shadow-violet-500/30"
            >
              {tc('signup')}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-40 right-0 h-[600px] w-[600px] rounded-full bg-violet-100/50 blur-3xl" />
          <div className="absolute -bottom-20 left-0 h-[400px] w-[400px] rounded-full bg-blue-100/50 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-6 pb-24 pt-20 text-center lg:pt-32">
          {/* Badge */}
          <div className="mx-auto mb-8 flex w-fit items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5">
            <Zap className="h-3.5 w-3.5 text-violet-600" />
            <span className="text-xs font-semibold text-violet-700">{t('hero.badge')}</span>
          </div>

          <h1 className="mx-auto max-w-4xl text-5xl font-bold leading-tight tracking-tight text-slate-900 lg:text-6xl">
            {t('hero.title')}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
            {t('hero.subtitle')}
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href={`/${locale}/auth/register`}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-violet-500/25 transition-all hover:shadow-2xl hover:shadow-violet-500/30"
            >
              {t('hero.cta')}
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href={`/${locale}#features`}
              className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-8 py-4 text-base font-medium text-slate-700 transition hover:bg-slate-50"
            >
              {tc('learnMore')}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-slate-100 bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900">{t('features.title')}</h2>
            <p className="mt-3 text-lg text-slate-500">{t('features.subtitle')}</p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: <Store className="h-6 w-6" />, key: 'ecommerce' },
              { icon: <Globe className="h-6 w-6" />, key: 'marketplace' },
              { icon: <BarChart3 className="h-6 w-6" />, key: 'finance' },
              { icon: <ShieldCheck className="h-6 w-6" />, key: 'export' },
            ].map((feature) => (
              <div key={feature.key} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 text-white">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {t(`features.${feature.key}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {t(`features.${feature.key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900">{t('cta.title')}</h2>
          <p className="mt-4 text-lg text-slate-500">{t('cta.subtitle')}</p>
          <Link
            href={`/${locale}/auth/register`}
            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-violet-500/25 transition-all hover:shadow-2xl hover:shadow-violet-500/30"
          >
            {t('hero.cta')}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-slate-50 py-8">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-slate-500">
          &copy; 2026 ZunaPro. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
