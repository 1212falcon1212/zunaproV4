import { SearchBar } from './search-bar';
import { StoreHeaderClient } from './store-header-client';
import Link from 'next/link';

interface HeaderMessage {
  icon: string;
  title: Record<string, string>;
  subtitle: Record<string, string>;
}

interface Category {
  id: string;
  name: Record<string, string>;
  slug: string;
  children?: Category[];
  _count?: { products: number };
}

interface MenuItem {
  id: string;
  label: Record<string, string>;
  href: string;
  children?: MenuItem[];
}

interface StoreInfo {
  store_name?: Record<string, string>;
  store_phone?: string;
  store_email?: string;
  locales?: string[];
  default_locale?: string;
  currencies?: string[];
  default_currency?: string;
  header_messages?: HeaderMessage[];
}

interface StoreHeaderProps {
  locale: string;
  logoUrl?: string;
  storeName?: string;
  storeInfo?: StoreInfo;
  categories?: Category[];
  menuItems?: MenuItem[];
}

function HeaderMessageIcon({ icon }: { icon: string }) {
  if (icon === 'support') {
    return (
      <svg className="h-8 w-8 text-[var(--color-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
      </svg>
    );
  }
  if (icon === 'shipping') {
    return (
      <svg className="h-8 w-8 text-[var(--color-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    );
  }
  return (
    <svg className="h-8 w-8 text-[var(--color-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </svg>
  );
}

export function StoreHeader({ locale, logoUrl, storeName, storeInfo, categories = [], menuItems = [] }: StoreHeaderProps) {
  const displayName = storeInfo?.store_name?.[locale] ?? storeInfo?.store_name?.['en'] ?? storeName ?? 'Store';
  const messages = storeInfo?.header_messages ?? [];

  return (
    <header className="border-b border-[var(--color-border)] bg-[var(--color-background)]">
      {/* Top Header Bar - WoodMart style */}
      <div className="mx-auto flex h-[72px] max-w-[1300px] items-center gap-6 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href={`/store/${locale}`} className="mr-4 flex shrink-0 items-center gap-2">
          {logoUrl ? (
            <img src={logoUrl} alt={displayName} className="h-8 w-auto" />
          ) : (
            <span className="text-2xl font-bold tracking-tight text-[var(--color-foreground)]" style={{ fontFamily: 'var(--font-heading)' }}>
              {displayName}
            </span>
          )}
        </Link>

        {/* Search Bar - desktop */}
        <div className="hidden flex-1 lg:block">
          <SearchBar locale={locale} variant="header" />
        </div>

        {/* Header Messages - desktop */}
        <div className="hidden items-center gap-6 lg:flex">
          {messages.map((msg, idx) => {
            const title = msg.title[locale] ?? msg.title['en'] ?? '';
            const subtitle = msg.subtitle[locale] ?? msg.subtitle['en'] ?? '';
            return (
              <div key={idx} className="flex items-center gap-3">
                <HeaderMessageIcon icon={msg.icon} />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold leading-tight text-[var(--color-foreground)]">{title}</span>
                  <span className="text-sm leading-tight text-[var(--color-primary)]">{subtitle}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Bar */}
      <StoreHeaderClient
        locale={locale}
        logoUrl={logoUrl}
        storeName={displayName}
        categories={categories}
        menuItems={menuItems}
        locales={storeInfo?.locales ?? []}
        currencies={storeInfo?.currencies ?? []}
        defaultCurrency={storeInfo?.default_currency ?? 'USD'}
      />

      {/* Mobile Search */}
      <div className="mx-auto max-w-[1300px] px-4 pb-3 sm:px-6 lg:hidden lg:px-8">
        <SearchBar locale={locale} />
      </div>
    </header>
  );
}
