import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const PLATFORM_DOMAINS = ['zunapro.com', 'www.zunapro.com'];
const PLATFORM_SUBDOMAINS = ['www', 'admin', 'api', 'mail'];
const LOCALES = routing.locales as readonly string[];
const DEFAULT_LOCALE = routing.defaultLocale;

const intlMiddleware = createMiddleware(routing);

/**
 * Determines if the request is for a tenant storefront or the platform.
 *
 * Platform: zunapro.com/[locale]/...  (landing, wizard, pricing)
 * Storefront: mobilyam.zunapro.com/[locale]/...  or  mobilyam.com/[locale]/...
 *
 * Tenant detection:
 *  1. Subdomain of zunapro.com (not www/admin/api/mail)
 *  2. Custom domain (any non-zunapro.com host)
 */
export default function middleware(request: NextRequest) {
  const hostname = request.headers.get('host')?.split(':')[0] || '';
  const { pathname } = request.nextUrl;

  // --- Detect tenant ---
  let tenantSlug: string | null = null;
  let isCustomDomain = false;

  if (hostname.endsWith('.zunapro.com')) {
    const subdomain = hostname.replace('.zunapro.com', '');
    if (!PLATFORM_SUBDOMAINS.includes(subdomain) && subdomain !== '') {
      tenantSlug = subdomain;
    }
  } else if (
    !PLATFORM_DOMAINS.includes(hostname) &&
    hostname !== 'localhost' &&
    hostname !== '127.0.0.1' &&
    !/^\d+\.\d+\.\d+\.\d+$/.test(hostname)
  ) {
    // Custom domain → treat as tenant
    tenantSlug = hostname; // Will be resolved to actual slug by API
    isCustomDomain = true;
  }

  // --- Path-based store preview: /_store/[slug]/[locale]/... ---
  if (!tenantSlug && pathname.startsWith('/_store/')) {
    const storeSegments = pathname.replace('/_store/', '').split('/').filter(Boolean);
    const slug = storeSegments[0];
    if (slug) {
      const storeLocale = LOCALES.includes(storeSegments[1] || '') ? storeSegments[1] : DEFAULT_LOCALE;
      const rest = LOCALES.includes(storeSegments[1] || '')
        ? '/' + storeSegments.slice(2).join('/')
        : '/' + storeSegments.slice(1).join('/');

      const url = request.nextUrl.clone();
      url.pathname = `/store/${storeLocale}${rest === '/' ? '' : rest}`;

      const response = NextResponse.rewrite(url);
      response.headers.set('x-tenant-slug', slug);
      response.headers.set('x-tenant-locale', storeLocale);
      response.headers.set('x-tenant-custom-domain', 'false');
      // Set cookie so subsequent /store/... navigations know the tenant
      response.cookies.set('__store_preview_slug', slug, { path: '/', maxAge: 60 * 60 * 24 });
      return response;
    }
  }

  // --- Local dev: handle direct /store/[locale]/... navigation ---
  // When user navigates via client-side links from a /_store preview session,
  // links point to /store/[locale]/... which would 404 without tenant context.
  if (
    !tenantSlug &&
    (hostname === 'localhost' || hostname === '127.0.0.1') &&
    pathname.startsWith('/store/')
  ) {
    const previewSlug = request.cookies.get('__store_preview_slug')?.value;
    if (previewSlug) {
      // Extract locale from /store/[locale]/...
      const storePathSegments = pathname.replace('/store/', '').split('/').filter(Boolean);
      const storeLocale = LOCALES.includes(storePathSegments[0] || '') ? storePathSegments[0] : DEFAULT_LOCALE;

      const response = NextResponse.next();
      response.headers.set('x-tenant-slug', previewSlug);
      response.headers.set('x-tenant-locale', storeLocale);
      response.headers.set('x-tenant-custom-domain', 'false');
      return response;
    }
  }

  // --- Platform routes (no tenant) ---
  if (!tenantSlug) {
    return intlMiddleware(request);
  }

  // --- Tenant storefront routes ---
  // Extract locale from URL path: /tr/products/... → locale=tr
  const pathSegments = pathname.split('/').filter(Boolean);
  const firstSegment = pathSegments[0] || '';
  const hasLocalePrefix = LOCALES.includes(firstSegment);
  const locale = hasLocalePrefix ? firstSegment : DEFAULT_LOCALE;

  // Build the internal rewrite path: /store/[locale]/...
  const restOfPath = hasLocalePrefix
    ? '/' + pathSegments.slice(1).join('/')
    : pathname;

  const url = request.nextUrl.clone();
  url.pathname = `/store/${locale}${restOfPath === '/' ? '' : restOfPath}`;

  const response = NextResponse.rewrite(url);

  // Set tenant info as headers for server components to read
  response.headers.set('x-tenant-slug', tenantSlug);
  response.headers.set('x-tenant-locale', locale);
  response.headers.set(
    'x-tenant-custom-domain',
    isCustomDomain ? 'true' : 'false',
  );

  // Add hreflang link headers for SEO
  const origin = `${request.nextUrl.protocol}//${request.headers.get('host')}`;
  const pathWithoutLocale = hasLocalePrefix
    ? '/' + pathSegments.slice(1).join('/')
    : pathname;

  const hreflangLinks = LOCALES.map(
    (loc) => `<${origin}/${loc}${pathWithoutLocale}>; rel="alternate"; hreflang="${loc}"`,
  ).join(', ');
  response.headers.set('Link', hreflangLinks);

  return response;
}

export const config = {
  matcher: [
    // Platform locale routes
    '/',
    '/(en|tr|de|fr|es)/:path*',
    // Store preview path
    '/_store/:path*',
    // Storefront routes (catch-all for tenant subdomains/custom domains)
    '/((?!_next|api|favicon.ico|theme-preview|.*\\..*).*)',
  ],
};
