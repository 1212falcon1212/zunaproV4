import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { serverFetch, getTenantSlug } from '@/lib/server-store-api';
import { themeConfigToCssVars, getGoogleFontsUrl, mergeThemeConfig } from '@/lib/theme-utils';
import { StoreHeader } from './_components/store-header';
import { StoreFooter } from './_components/store-footer';
import { ThemePreviewListener } from './_components/theme-preview-listener';
import { TenantProvider } from './_components/tenant-context';
import type { ThemeConfig } from '@zunapro/types';
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
  const tenantSlug = await getTenantSlug();

  let themeConfig: ThemeConfig;
  try {
    const raw = await serverFetch<ThemeConfig>('/storefront/settings/theme');
    themeConfig = mergeThemeConfig(raw);
  } catch {
    themeConfig = mergeThemeConfig(null);
  }

  let storeInfo: Record<string, unknown> = {};
  let categories: unknown[] = [];
  let menuItems: unknown[] = [];
  let footerMenuItems: unknown[] = [];
  try {
    const [storeInfoData, categoriesData, menuData, footerMenuData] = await Promise.all([
      serverFetch<Record<string, unknown>>('/storefront/settings/store-info').catch(() => ({})),
      serverFetch<unknown[]>('/storefront/categories').catch(() => []),
      serverFetch<{ items: unknown[] }>('/storefront/menus/header').catch(() => null),
      serverFetch<{ items: unknown[] }>('/storefront/menus/footer').catch(() => null),
    ]);
    storeInfo = storeInfoData;
    categories = categoriesData;
    menuItems = menuData?.items ?? [];
    footerMenuItems = footerMenuData?.items ?? [];
  } catch {
    // Fall back to defaults
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
        <TenantProvider slug={tenantSlug}>
        <NextIntlClientProvider messages={messages}>
          <StoreHeader
            locale={locale}
            logoUrl={themeConfig.logoUrl}
            storeName="Store"
            storeInfo={storeInfo}
            categories={categories as never[]}
            menuItems={menuItems as never[]}
          />
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>
          <StoreFooter
            locale={locale}
            storeName="Store"
            storeInfo={storeInfo as never}
            categories={categories as never[]}
            footerMenuItems={footerMenuItems as never[]}
          />
          <ThemePreviewListener />
        </NextIntlClientProvider>
        </TenantProvider>
      </body>
    </html>
  );
}
