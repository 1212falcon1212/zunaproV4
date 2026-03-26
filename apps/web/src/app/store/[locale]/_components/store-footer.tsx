import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

interface SocialLinks {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
}

interface StoreInfo {
  store_name?: string | Record<string, string>;
  store_email?: string;
  store_phone?: string;
  social_links?: SocialLinks;
}

interface Category {
  id: string;
  name: string | Record<string, string>;
  slug: string;
  parentId?: string | null;
}

interface MenuItem {
  id: string;
  label: string | Record<string, string>;
  url?: string;
  href?: string;
  position?: number;
}

interface StoreFooterProps {
  locale: string;
  storeName?: string;
  storeInfo: StoreInfo;
  categories: Category[];
  footerMenuItems: MenuItem[];
}

function getLocalizedText(
  value: string | Record<string, string> | undefined,
  locale: string,
  fallback: string = '',
): string {
  if (!value) return fallback;
  if (typeof value === 'string') return value;
  return value[locale] ?? value['en'] ?? fallback;
}

function FacebookIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export async function StoreFooter({
  locale,
  storeName,
  storeInfo,
  categories,
  footerMenuItems,
}: StoreFooterProps) {
  const t = await getTranslations('storefront');

  const displayName = getLocalizedText(storeInfo?.store_name, locale) || storeName || 'Store';

  const socialLinks: SocialLinks = storeInfo?.social_links ?? {
    facebook: 'https://facebook.com',
    twitter: 'https://twitter.com',
    instagram: 'https://instagram.com',
    youtube: 'https://youtube.com',
  };

  const parentCategories = (categories ?? [])
    .filter((c) => !c.parentId)
    .slice(0, 8);

  const halfIndex = Math.ceil((footerMenuItems ?? []).length / 2);
  const quickLinks = (footerMenuItems ?? []).slice(0, halfIndex);
  const serviceLinks = (footerMenuItems ?? []).slice(halfIndex);

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-foreground)] text-gray-400">
      <div className="mx-auto max-w-[1300px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand + Social */}
          <div>
            <h3
              className="text-xl font-bold text-white"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {displayName}
            </h3>
            <p className="mt-3 text-sm leading-relaxed">
              {t('footer.description')}
            </p>
            {storeInfo?.store_email && (
              <p className="mt-3 text-sm">
                {storeInfo.store_email}
              </p>
            )}
            {storeInfo?.store_phone && (
              <p className="mt-1 text-sm">
                {storeInfo.store_phone}
              </p>
            )}
            <p className="mt-5 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-300">
              {t('footer.followUs')}
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.facebook && (
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 transition-colors hover:text-white"
                  aria-label="Facebook"
                >
                  <FacebookIcon />
                </a>
              )}
              {socialLinks.twitter && (
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 transition-colors hover:text-white"
                  aria-label="Twitter"
                >
                  <TwitterIcon />
                </a>
              )}
              {socialLinks.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 transition-colors hover:text-white"
                  aria-label="Instagram"
                >
                  <InstagramIcon />
                </a>
              )}
              {socialLinks.youtube && (
                <a
                  href={socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 transition-colors hover:text-white"
                  aria-label="YouTube"
                >
                  <YoutubeIcon />
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Categories */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
              {t('categories')}
            </h4>
            <ul className="mt-4 space-y-2">
              {parentCategories.length > 0 ? (
                parentCategories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/store/${locale}/products?category=${cat.slug}`}
                      className="text-sm transition-colors hover:text-white"
                    >
                      {getLocalizedText(cat.name, locale, cat.slug)}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li>
                    <Link href={`/store/${locale}/products`} className="text-sm transition-colors hover:text-white">
                      {t('header.allProducts')}
                    </Link>
                  </li>
                  <li>
                    <Link href={`/store/${locale}/categories`} className="text-sm transition-colors hover:text-white">
                      {t('categories')}
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
              {t('footer.quickLinks')}
            </h4>
            <ul className="mt-4 space-y-2">
              {quickLinks.length > 0 ? (
                quickLinks.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/store/${locale}${(item.href || item.url || '/').startsWith('/') ? (item.href || item.url || '/') : `/${item.href || item.url || ''}`}`}
                      className="text-sm transition-colors hover:text-white"
                    >
                      {getLocalizedText(item.label, locale)}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li>
                    <Link href={`/store/${locale}/products`} className="text-sm transition-colors hover:text-white">
                      {t('header.allProducts')}
                    </Link>
                  </li>
                  <li>
                    <Link href={`/store/${locale}/pages/contact`} className="text-sm transition-colors hover:text-white">
                      {t('footer.contact')}
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Column 4: Customer Service */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
              {t('footer.customerService')}
            </h4>
            <ul className="mt-4 space-y-2">
              {serviceLinks.length > 0 ? (
                serviceLinks.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/store/${locale}${(item.href || item.url || '/').startsWith('/') ? (item.href || item.url || '/') : `/${item.href || item.url || ''}`}`}
                      className="text-sm transition-colors hover:text-white"
                    >
                      {getLocalizedText(item.label, locale)}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li>
                    <Link href={`/store/${locale}/pages/faq`} className="text-sm transition-colors hover:text-white">
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link href={`/store/${locale}/pages/shipping-policy`} className="text-sm transition-colors hover:text-white">
                      {t('footer.shippingPolicy')}
                    </Link>
                  </li>
                  <li>
                    <Link href={`/store/${locale}/pages/returns`} className="text-sm transition-colors hover:text-white">
                      {t('footer.returns')}
                    </Link>
                  </li>
                  <li>
                    <Link href={`/store/${locale}/pages/privacy`} className="text-sm transition-colors hover:text-white">
                      {t('footer.privacy')}
                    </Link>
                  </li>
                  <li>
                    <Link href={`/store/${locale}/pages/terms`} className="text-sm transition-colors hover:text-white">
                      {t('footer.terms')}
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-gray-700 pt-8 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} {displayName}. {t('footer.allRightsReserved')}
          </p>
        </div>
      </div>
    </footer>
  );
}
