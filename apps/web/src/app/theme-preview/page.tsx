import { notFound } from 'next/navigation';
import { BlockRenderer } from '../store/[locale]/_components/blocks/block-renderer';
import { ThemePreviewListener } from '../store/[locale]/_components/theme-preview-listener';
import { themeConfigToCssVars, getGoogleFontsUrl, mergeThemeConfig } from '@/lib/theme-utils';
import type { ThemeConfig, PageContent } from '@zunapro/types';
import '@/styles/globals.css';

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface ThemeBundleResponse {
  config: ThemeConfig;
  homePage: PageContent;
  header: PageContent;
  footer: PageContent;
}

interface Props {
  searchParams: Promise<{ themeId?: string; locale?: string }>;
}

async function fetchThemeBundle(themeId: string): Promise<ThemeBundleResponse | null> {
  try {
    const res = await fetch(`${API_URL}/storefront/theme-preview/${themeId}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function ThemePreviewPage({ searchParams }: Props) {
  const { themeId, locale: localeParam } = await searchParams;
  const locale = localeParam || 'en';

  if (!themeId) {
    notFound();
  }

  const bundle = await fetchThemeBundle(themeId);
  if (!bundle) {
    notFound();
  }

  const themeConfig = mergeThemeConfig(bundle.config);
  const cssVars = themeConfigToCssVars(themeConfig);
  const fontsUrl = getGoogleFontsUrl(themeConfig);

  const hasHeader = bundle.header?.version === 1 && bundle.header.blocks?.length > 0;
  const hasFooter = bundle.footer?.version === 1 && bundle.footer.blocks?.length > 0;
  const hasHomePage = bundle.homePage?.version === 1 && bundle.homePage.blocks?.length > 0;

  return (
    <html lang={locale} style={{ cssText: cssVars } as React.CSSProperties}>
      <head>
        {fontsUrl && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link rel="stylesheet" href={fontsUrl} />
          </>
        )}
      </head>
      <body
        className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]"
        style={{ fontFamily: 'var(--font-body)' }}
      >
        {hasHeader && (
          <header className="flex flex-wrap items-center gap-4 border-b border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 sm:px-6">
            <BlockRenderer blocks={bundle.header.blocks} locale={locale} />
          </header>
        )}

        <main>
          {hasHomePage ? (
            <BlockRenderer blocks={bundle.homePage.blocks} locale={locale} />
          ) : (
            <div className="flex min-h-[40vh] items-center justify-center text-gray-400">
              No homepage content
            </div>
          )}
        </main>

        {hasFooter && (
          <footer>
            <BlockRenderer blocks={bundle.footer.blocks} locale={locale} />
          </footer>
        )}

        <ThemePreviewListener />
      </body>
    </html>
  );
}
