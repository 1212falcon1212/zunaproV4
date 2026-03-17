import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { serverFetch } from '@/lib/server-store-api';
import { themeConfigToCssVars, getGoogleFontsUrl, mergeThemeConfig } from '@/lib/theme-utils';
import { StoreHeader } from './_components/store-header';
import { StoreFooter } from './_components/store-footer';
import { ThemePreviewListener } from './_components/theme-preview-listener';
import { BlockRenderer } from './_components/blocks/block-renderer';
import type { ThemeConfig, PageContent } from '@zunapro/types';
import '@/styles/globals.css';

export default async function StoreLocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const messages = await getMessages();

  let themeConfig: ThemeConfig;
  try {
    const raw = await serverFetch<ThemeConfig>('/storefront/settings/theme');
    themeConfig = mergeThemeConfig(raw);
  } catch {
    themeConfig = mergeThemeConfig(null);
  }

  // Load custom header/footer from GlobalSection
  let customHeader: PageContent | null = null;
  let customFooter: PageContent | null = null;
  try {
    const [headerData, footerData] = await Promise.all([
      serverFetch<PageContent>('/storefront/global-sections/header').catch(() => null),
      serverFetch<PageContent>('/storefront/global-sections/footer').catch(() => null),
    ]);
    if (headerData?.version === 1 && headerData.blocks?.length > 0) {
      customHeader = headerData;
    }
    if (footerData?.version === 1 && footerData.blocks?.length > 0) {
      customFooter = footerData;
    }
  } catch {
    // Fall back to default header/footer
  }

  const cssVars = themeConfigToCssVars(themeConfig);
  const fontsUrl = getGoogleFontsUrl(themeConfig);

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
        {themeConfig.faviconUrl && <link rel="icon" href={themeConfig.faviconUrl} />}
        {themeConfig.customCss && <style dangerouslySetInnerHTML={{ __html: themeConfig.customCss }} />}
      </head>
      <body
        className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]"
        style={{ fontFamily: 'var(--font-body)' }}
      >
        <NextIntlClientProvider messages={messages}>
          {customHeader ? (
            <header className="flex flex-wrap items-center gap-4 border-b border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 sm:px-6">
              <BlockRenderer blocks={customHeader.blocks} locale={locale} />
            </header>
          ) : (
            <StoreHeader
              locale={locale}
              logoUrl={themeConfig.logoUrl}
              storeName="Store"
            />
          )}
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>
          {customFooter ? (
            <footer>
              <BlockRenderer blocks={customFooter.blocks} locale={locale} />
            </footer>
          ) : (
            <StoreFooter locale={locale} storeName="Store" />
          )}
          <ThemePreviewListener />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
