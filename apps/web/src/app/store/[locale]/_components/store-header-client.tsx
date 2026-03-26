'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { CartBadge } from './cart-badge';
import { getWishlistCount } from './hooks/use-wishlist';
import { getCompareCount } from './hooks/use-compare';
import { isCustomerAuthenticated } from '@/lib/store-api';

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

interface StoreHeaderClientProps {
  locale: string;
  logoUrl?: string;
  storeName?: string;
  categories?: Category[];
  menuItems?: MenuItem[];
  locales?: string[];
  currencies?: string[];
  defaultCurrency?: string;
}

const LOCALE_LABELS: Record<string, string> = {
  en: 'EN',
  tr: 'TR',
  de: 'DE',
  fr: 'FR',
  es: 'ES',
};

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: 'USD',
  EUR: 'EUR',
  TRY: 'TRY',
  GBP: 'GBP',
};

export function StoreHeaderClient({
  locale,
  storeName,
  categories = [],
  menuItems = [],
  locales = [],
  currencies = [],
  defaultCurrency = 'USD',
}: StoreHeaderClientProps) {
  const t = useTranslations('storefront');
  const router = useRouter();
  const pathname = usePathname();
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [compareCount, setCompareCount] = useState(0);
  const [currency, setCurrency] = useState(defaultCurrency);
  const categoriesRef = useRef<HTMLDivElement>(null);

  // Listen for wishlist/compare changes
  useEffect(() => {
    const updateCounts = () => {
      setWishlistCount(getWishlistCount());
      setCompareCount(getCompareCount());
    };
    updateCounts();
    window.addEventListener('wishlist-updated', updateCounts);
    window.addEventListener('compare-updated', updateCounts);
    return () => {
      window.removeEventListener('wishlist-updated', updateCounts);
      window.removeEventListener('compare-updated', updateCounts);
    };
  }, []);

  // Close categories dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (categoriesRef.current && !categoriesRef.current.contains(e.target as Node)) {
        setCategoriesOpen(false);
      }
    };
    if (categoriesOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [categoriesOpen]);

  const handleLocaleChange = (newLocale: string) => {
    const newPath = pathname.replace(`/store/${locale}`, `/store/${newLocale}`);
    router.push(newPath);
  };

  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency);
    if (typeof window !== 'undefined') {
      localStorage.setItem('zunapro_currency', newCurrency);
      window.dispatchEvent(new Event('currency-changed'));
    }
  };

  const accountHref = isCustomerAuthenticated()
    ? `/store/${locale}/account`
    : `/store/${locale}/auth/login`;

  return (
    <>
      {/* Desktop Navigation Bar */}
      <div className="hidden border-t border-[var(--color-border)] lg:block" style={{ backgroundColor: '#e6effd' }}>
        <div className="mx-auto flex h-12 max-w-[1300px] items-center px-4 sm:px-6 lg:px-8">
          {/* Left: Categories + Menu */}
          <div className="flex items-center gap-1">
            {/* Categories Dropdown */}
            <div ref={categoriesRef} className="relative">
              <button
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className="flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-4 py-1.5 text-sm font-medium text-white transition-colors hover:opacity-90"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                {t('categories')}
              </button>

              {categoriesOpen && categories.length > 0 && (
                <div className="absolute left-0 top-full z-50 mt-1 w-64 rounded-md border border-[var(--color-border)] bg-[var(--color-background)] py-2 shadow-lg">
                  {categories.map((cat) => (
                    <div key={cat.id} className="group relative">
                      <Link
                        href={`/store/${locale}/categories/${cat.slug}`}
                        onClick={() => setCategoriesOpen(false)}
                        className="flex items-center justify-between px-4 py-2 text-sm text-[var(--color-foreground)] hover:bg-[var(--color-muted)]"
                      >
                        <span>{cat.name[locale] ?? cat.name['en'] ?? cat.slug}</span>
                        {cat.children && cat.children.length > 0 && (
                          <svg className="h-4 w-4 text-[var(--color-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                      </Link>
                      {/* Submenu */}
                      {cat.children && cat.children.length > 0 && (
                        <div className="invisible absolute left-full top-0 z-50 ml-0 w-56 rounded-md border border-[var(--color-border)] bg-[var(--color-background)] py-2 shadow-lg group-hover:visible">
                          {cat.children.map((child) => (
                            <Link
                              key={child.id}
                              href={`/store/${locale}/categories/${child.slug}`}
                              onClick={() => setCategoriesOpen(false)}
                              className="block px-4 py-2 text-sm text-[var(--color-foreground)] hover:bg-[var(--color-muted)]"
                            >
                              {child.name[locale] ?? child.name['en'] ?? child.slug}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="border-t border-[var(--color-border)] mt-1 pt-1">
                    <Link
                      href={`/store/${locale}/categories`}
                      onClick={() => setCategoriesOpen(false)}
                      className="block px-4 py-2 text-sm font-medium text-[var(--color-primary)] hover:bg-[var(--color-muted)]"
                    >
                      {t('header.allProducts')}
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Menu Items */}
            <nav className="flex items-center">
              {menuItems.map((item) => (
                <div key={item.id} className="group/menu relative">
                  <Link
                    href={`/store/${locale}${item.href}`}
                    className="flex items-center gap-1 px-4 py-1.5 text-sm font-medium text-[var(--color-foreground)] transition-colors hover:text-[var(--color-primary)]"
                  >
                    {item.label[locale] ?? item.label['en'] ?? ''}
                    {item.children && item.children.length > 0 && (
                      <svg className="h-3 w-3 text-[var(--color-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </Link>
                  {item.children && item.children.length > 0 && (
                    <div className="invisible absolute left-0 top-full z-50 min-w-[200px] rounded-md border border-[var(--color-border)] bg-[var(--color-background)] py-2 shadow-lg group-hover/menu:visible">
                      {item.children.map((child) => (
                        <Link
                          key={child.id}
                          href={`/store/${locale}${child.href}`}
                          className="block px-4 py-2 text-sm text-[var(--color-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-primary)]"
                        >
                          {child.label[locale] ?? child.label['en'] ?? ''}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Right: Locale, Currency, Account, Compare, Wishlist, Cart */}
          <div className="ml-auto flex items-center gap-1">
            {/* Locale Selector */}
            {locales.length > 1 && (
              <div className="relative">
                <select
                  value={locale}
                  onChange={(e) => handleLocaleChange(e.target.value)}
                  className="cursor-pointer appearance-none border-none bg-transparent py-1 pl-2 pr-6 text-xs font-medium text-[var(--color-foreground)] focus:outline-none"
                >
                  {locales.map((l) => (
                    <option key={l} value={l}>{LOCALE_LABELS[l] ?? l.toUpperCase()}</option>
                  ))}
                </select>
                <svg className="pointer-events-none absolute right-1 top-1/2 h-3 w-3 -translate-y-1/2 text-[var(--color-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            )}

            {/* Currency Selector */}
            {currencies.length > 1 && (
              <div className="relative">
                <select
                  value={currency}
                  onChange={(e) => handleCurrencyChange(e.target.value)}
                  className="cursor-pointer appearance-none border-none bg-transparent py-1 pl-2 pr-6 text-xs font-medium text-[var(--color-foreground)] focus:outline-none"
                >
                  {currencies.map((c) => (
                    <option key={c} value={c}>{CURRENCY_SYMBOLS[c] ?? c}</option>
                  ))}
                </select>
                <svg className="pointer-events-none absolute right-1 top-1/2 h-3 w-3 -translate-y-1/2 text-[var(--color-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            )}

            <div className="mx-2 h-5 w-px bg-[var(--color-border)]" />

            {/* Account */}
            <Link
              href={accountHref}
              className="rounded-full p-2 text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-background)]"
              title={t('header.account')}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </Link>

            {/* Compare */}
            <Link
              href={`/store/${locale}/compare`}
              className="relative rounded-full p-2 text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-background)]"
              title={t('header.compare')}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
              </svg>
              {compareCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-primary)] text-[9px] font-bold text-white">
                  {compareCount}
                </span>
              )}
            </Link>

            {/* Wishlist */}
            <Link
              href={`/store/${locale}/wishlist`}
              className="relative rounded-full p-2 text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-background)]"
              title={t('header.wishlist')}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-primary)] text-[9px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href={`/store/${locale}/cart`}
              className="relative flex items-center gap-1.5 rounded-full p-2 text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-background)]"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121 0 2.09-.773 2.34-1.868l1.87-8.197H6.106l-.383-1.437A1.125 1.125 0 004.636 3H2.25M7.5 14.25L5.106 5.272M7.5 14.25H4.636M17.25 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM8.25 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              <CartBadge />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="flex items-center justify-between border-t border-[var(--color-border)] px-4 py-2.5 lg:hidden" style={{ backgroundColor: '#e6effd' }}>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-md p-1.5 text-[var(--color-foreground)] hover:bg-[var(--color-background)]"
            aria-label="Toggle menu"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          <span className="text-sm font-bold">{storeName ?? 'Store'}</span>
        </div>

        <div className="flex items-center gap-1">
          <Link href={accountHref} className="rounded-full p-2 text-[var(--color-foreground)]">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </Link>
          <Link href={`/store/${locale}/wishlist`} className="relative rounded-full p-2 text-[var(--color-foreground)]">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            {wishlistCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-primary)] text-[9px] font-bold text-white">{wishlistCount}</span>
            )}
          </Link>
          <Link href={`/store/${locale}/cart`} className="relative rounded-full p-2 text-[var(--color-foreground)]">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121 0 2.09-.773 2.34-1.868l1.87-8.197H6.106l-.383-1.437A1.125 1.125 0 004.636 3H2.25M7.5 14.25L5.106 5.272M7.5 14.25H4.636M17.25 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM8.25 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            <CartBadge />
          </Link>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-[var(--color-border)] bg-[var(--color-background)] p-4 shadow-lg lg:hidden">
          {/* Locale & Currency */}
          <div className="mb-3 flex gap-3 border-b border-[var(--color-border)] pb-3">
            {locales.length > 1 && (
              <select
                value={locale}
                onChange={(e) => handleLocaleChange(e.target.value)}
                className="rounded-md border border-[var(--color-border)] bg-[var(--color-background)] px-2 py-1 text-sm"
              >
                {locales.map((l) => (
                  <option key={l} value={l}>{LOCALE_LABELS[l] ?? l.toUpperCase()}</option>
                ))}
              </select>
            )}
            {currencies.length > 1 && (
              <select
                value={currency}
                onChange={(e) => handleCurrencyChange(e.target.value)}
                className="rounded-md border border-[var(--color-border)] bg-[var(--color-background)] px-2 py-1 text-sm"
              >
                {currencies.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            )}
          </div>

          {/* Categories */}
          {categories.length > 0 && (
            <div className="mb-3 border-b border-[var(--color-border)] pb-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-secondary)]">{t('categories')}</p>
              <nav className="flex flex-col gap-1">
                {categories.map((cat) => (
                  <div key={cat.id}>
                    <Link
                      href={`/store/${locale}/categories/${cat.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-[var(--color-muted)]"
                    >
                      {cat.name[locale] ?? cat.name['en'] ?? cat.slug}
                    </Link>
                    {cat.children?.map((child) => (
                      <Link
                        key={child.id}
                        href={`/store/${locale}/categories/${child.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block rounded-md py-1.5 pl-7 pr-3 text-sm text-[var(--color-secondary)] hover:bg-[var(--color-muted)]"
                      >
                        {child.name[locale] ?? child.name['en'] ?? child.slug}
                      </Link>
                    ))}
                  </div>
                ))}
              </nav>
            </div>
          )}

          {/* Menu Links */}
          <nav className="flex flex-col gap-1">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                href={`/store/${locale}${item.href}`}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium hover:bg-[var(--color-muted)]"
              >
                {item.label[locale] ?? item.label['en'] ?? ''}
              </Link>
            ))}
            <Link
              href={`/store/${locale}/compare`}
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-[var(--color-muted)]"
            >
              {t('header.compare')} {compareCount > 0 && `(${compareCount})`}
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
