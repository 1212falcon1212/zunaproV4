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

function PhoneIcon() {
  return (
    <svg className="h-10 w-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg className="h-10 w-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="h-10 w-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg className="h-10 w-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  );
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
    <footer className="border-t border-[var(--color-border)]">
      {/* Contact Info Bar - Referans sitedeki gibi 4 kutu */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-[1300px] px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0"><PhoneIcon /></div>
              <div>
                <p className="text-xs text-gray-500 font-medium">7/24 Bizi Arayın</p>
                <p className="text-base font-bold text-gray-900">0850 885 19 19</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0"><EmailIcon /></div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Teklif Alın</p>
                <p className="text-base font-bold text-gray-900">{storeInfo?.store_email || 'info@ecomarts.com'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0"><ClockIcon /></div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Çalışma Saatleri</p>
                <p className="text-base font-bold text-gray-900">Pzt - Cum: 09:00 - 18:00</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0"><LocationIcon /></div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Konum</p>
                <p className="text-base font-bold text-gray-900">İstanbul, Türkiye</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-[#0a1128] text-gray-400">
        <div className="mx-auto max-w-[1300px] px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Column 1: Brand + Social */}
            <div>
              <img src="/assets/logo.svg" alt={displayName} className="h-8 w-auto brightness-0 invert" />
              <p className="mt-3 text-sm leading-relaxed">
                Müşterilerimize en kaliteli ürünleri en uygun fiyatlarla sunmayı hedefliyoruz. Güvenli alışveriş deneyimi için buradayız.
              </p>
              <div className="mt-5 flex items-center gap-3">
                {socialLinks.facebook && (
                  <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-gray-400 transition-colors hover:bg-red-500 hover:text-white" aria-label="Facebook">
                    <FacebookIcon />
                  </a>
                )}
                {socialLinks.twitter && (
                  <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-gray-400 transition-colors hover:bg-red-500 hover:text-white" aria-label="Twitter">
                    <TwitterIcon />
                  </a>
                )}
                {socialLinks.instagram && (
                  <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-gray-400 transition-colors hover:bg-red-500 hover:text-white" aria-label="Instagram">
                    <InstagramIcon />
                  </a>
                )}
                {socialLinks.youtube && (
                  <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-gray-400 transition-colors hover:bg-red-500 hover:text-white" aria-label="YouTube">
                    <YoutubeIcon />
                  </a>
                )}
              </div>
            </div>

            {/* Column 2: Müşteri Desteği */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
                Müşteri Desteği
              </h4>
              <ul className="mt-4 space-y-2.5">
                {quickLinks.length > 0 ? (
                  quickLinks.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={`/store/${locale}${(item.href || item.url || '/').startsWith('/') ? (item.href || item.url || '/') : `/${item.href || item.url || ''}`}`}
                        className="text-sm transition-colors hover:text-white flex items-center gap-2"
                      >
                        <svg className="h-3 w-3 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                        {getLocalizedText(item.label, locale)}
                      </Link>
                    </li>
                  ))
                ) : (
                  <>
                    <li><Link href={`/store/${locale}/products`} className="text-sm transition-colors hover:text-white flex items-center gap-2"><svg className="h-3 w-3 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>Mağaza</Link></li>
                    <li><Link href={`/store/${locale}/pages/contact`} className="text-sm transition-colors hover:text-white flex items-center gap-2"><svg className="h-3 w-3 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>İletişim</Link></li>
                    <li><Link href={`/store/${locale}/pages/returns`} className="text-sm transition-colors hover:text-white flex items-center gap-2"><svg className="h-3 w-3 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>İade Politikası</Link></li>
                  </>
                )}
              </ul>
            </div>

            {/* Column 3: Hızlı Bağlantılar */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
                Hızlı Bağlantılar
              </h4>
              <ul className="mt-4 space-y-2.5">
                {serviceLinks.length > 0 ? (
                  serviceLinks.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={`/store/${locale}${(item.href || item.url || '/').startsWith('/') ? (item.href || item.url || '/') : `/${item.href || item.url || ''}`}`}
                        className="text-sm transition-colors hover:text-white flex items-center gap-2"
                      >
                        <svg className="h-3 w-3 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                        {getLocalizedText(item.label, locale)}
                      </Link>
                    </li>
                  ))
                ) : (
                  <>
                    <li><Link href={`/store/${locale}/pages/about`} className="text-sm transition-colors hover:text-white flex items-center gap-2"><svg className="h-3 w-3 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>Hakkımızda</Link></li>
                    <li><Link href={`/store/${locale}/pages/faq`} className="text-sm transition-colors hover:text-white flex items-center gap-2"><svg className="h-3 w-3 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>SSS</Link></li>
                    <li><Link href={`/store/${locale}/blog`} className="text-sm transition-colors hover:text-white flex items-center gap-2"><svg className="h-3 w-3 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>Blog</Link></li>
                  </>
                )}
              </ul>
            </div>

            {/* Column 4: Bülten */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
                Bülten
              </h4>
              <p className="mt-4 text-sm leading-relaxed">
                Haftalık bültenimize abone olarak en son güncellemelerden haberdar olun.
              </p>
              <div className="mt-4 flex">
                <input
                  type="email"
                  placeholder="E-posta adresiniz"
                  className="flex-1 rounded-l-lg border-0 bg-white/10 px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <button className="rounded-r-lg bg-red-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-600">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10">
          <div className="mx-auto max-w-[1300px] px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <p className="text-sm text-gray-500">
                &copy; {new Date().getFullYear()} {displayName}. Tüm hakları saklıdır.
              </p>
              {/* Ödeme Yöntemleri */}
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-12 items-center justify-center rounded bg-white/10 px-1">
                  <span className="text-[10px] font-bold text-blue-400">VISA</span>
                </div>
                <div className="flex h-8 w-12 items-center justify-center rounded bg-white/10 px-1">
                  <span className="text-[10px] font-bold text-red-400">MC</span>
                </div>
                <div className="flex h-8 w-12 items-center justify-center rounded bg-white/10 px-1">
                  <span className="text-[10px] font-bold text-blue-300">AMEX</span>
                </div>
                <div className="flex h-8 w-12 items-center justify-center rounded bg-white/10 px-1">
                  <span className="text-[10px] font-bold text-yellow-400">PP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
