import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { BlockRenderer } from './_components/blocks/block-renderer';
import { serverFetch } from '@/lib/server-store-api';
import type { PageContent } from '@zunapro/types';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'storefront' });

  return {
    title: t('seo.defaultTitle'),
    description: t('seo.defaultDescription'),
    openGraph: {
      title: t('seo.defaultTitle'),
      description: t('seo.defaultDescription'),
      type: 'website',
    },
  };
}

export default async function StorefrontHome({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'storefront' });

  // Try to load page-builder content for the homepage
  let pageContent: PageContent | null = null;
  try {
    const page = await serverFetch<{
      content: PageContent | null;
    }>('/storefront/pages/home');
    if (page.content && page.content.version === 1 && page.content.blocks?.length > 0) {
      pageContent = page.content;
    }
  } catch {
    // No page-builder homepage — show setup placeholder
  }

  if (pageContent) {
    return (
      <div>
        <BlockRenderer blocks={pageContent.blocks} locale={locale} />
      </div>
    );
  }

  // Store setup placeholder
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <div className="rounded-2xl bg-slate-50 p-8">
        <h1 className="text-2xl font-bold text-slate-700">{t('storeSetup')}</h1>
        <p className="mt-2 text-slate-500">{t('storeSetupDescription')}</p>
      </div>
    </div>
  );
}
