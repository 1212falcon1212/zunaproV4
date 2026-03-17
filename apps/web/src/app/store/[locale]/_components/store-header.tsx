import { SearchBar } from './search-bar';
import { StoreHeaderClient } from './store-header-client';
import { LocaleSwitcher } from './locale-switcher';

interface StoreHeaderProps {
  locale: string;
  logoUrl?: string;
  storeName?: string;
}

export function StoreHeader({ locale, logoUrl, storeName }: StoreHeaderProps) {
  return (
    <header className="relative border-b border-[var(--color-border)] bg-[var(--color-background)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <StoreHeaderClient locale={locale} logoUrl={logoUrl} storeName={storeName} />
      </div>
      <div className="mx-auto max-w-7xl px-4 pb-3 sm:px-6 lg:hidden lg:px-8">
        <SearchBar locale={locale} />
      </div>
      <div className="mx-auto hidden max-w-7xl items-center gap-4 px-4 pb-3 sm:px-6 lg:flex lg:px-8">
        <SearchBar locale={locale} />
        <LocaleSwitcher locale={locale} />
      </div>
    </header>
  );
}
