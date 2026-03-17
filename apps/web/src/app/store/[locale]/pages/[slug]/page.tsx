import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { serverFetch } from '@/lib/server-store-api';
import { BlockRenderer } from '../../_components/blocks/block-renderer';
import type { PageContent } from '@zunapro/types';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

interface PageData {
  id: string;
  title: Record<string, string>;
  slug: string;
  content: PageContent | null;
  seoMeta?: Record<string, Record<string, string>> | null;
  template: string;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;

  try {
    const page = await serverFetch<PageData>(`/storefront/pages/${slug}`);
    const seo = page.seoMeta?.[locale] ?? page.seoMeta?.en;
    const title =
      (seo as Record<string, string> | undefined)?.title ??
      page.title[locale] ??
      page.title.en ??
      slug;
    const description =
      (seo as Record<string, string> | undefined)?.description ?? '';

    return {
      title,
      description,
      openGraph: { title, description, type: 'website' },
    };
  } catch {
    return { title: slug };
  }
}

export default async function StorefrontPage({ params }: Props) {
  const { locale, slug } = await params;

  let page: PageData;
  try {
    page = await serverFetch<PageData>(`/storefront/pages/${slug}`);
  } catch {
    notFound();
  }

  const content = page.content;

  // Page-builder block tree rendering
  if (content && content.version === 1 && content.blocks?.length > 0) {
    return (
      <div className="py-8">
        <BlockRenderer blocks={content.blocks} locale={locale} />
      </div>
    );
  }

  // Legacy flat HTML content fallback
  const htmlContent =
    (content as unknown as Record<string, string>)?.[locale] ??
    (content as unknown as Record<string, string>)?.en ??
    '';

  if (htmlContent) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h1
          className="mb-8 text-3xl font-bold text-[var(--color-foreground)]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {page.title[locale] ?? page.title.en ?? slug}
        </h1>
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1
        className="text-3xl font-bold text-[var(--color-foreground)]"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {page.title[locale] ?? page.title.en ?? slug}
      </h1>
    </div>
  );
}
