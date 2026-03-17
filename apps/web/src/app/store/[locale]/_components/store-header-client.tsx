'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { CartBadge } from './cart-badge';

interface StoreHeaderClientProps {
  locale: string;
  logoUrl?: string;
  storeName?: string;
}

export function StoreHeaderClient({ locale, logoUrl, storeName }: StoreHeaderClientProps) {
  const t = useTranslations('storefront');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="rounded-md p-2 text-[var(--color-foreground)] hover:bg-[var(--color-muted)] lg:hidden"
        aria-label="Toggle menu"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {mobileMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Logo */}
      <Link href={`/store/${locale}`} className="flex items-center gap-2">
        {logoUrl ? (
          <img src={logoUrl} alt={storeName ?? 'Store'} className="h-8 w-auto" />
        ) : (
          <span className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
            {storeName ?? 'Store'}
          </span>
        )}
      </Link>

      {/* Desktop nav */}
      <nav className="hidden items-center gap-6 lg:flex">
        <Link
          href={`/store/${locale}`}
          className="text-sm font-medium text-[var(--color-foreground)] hover:text-[var(--color-primary)]"
        >
          {t('welcome')}
        </Link>
        <Link
          href={`/store/${locale}/products`}
          className="text-sm font-medium text-[var(--color-foreground)] hover:text-[var(--color-primary)]"
        >
          {t('header.allProducts')}
        </Link>
        <Link
          href={`/store/${locale}/categories`}
          className="text-sm font-medium text-[var(--color-foreground)] hover:text-[var(--color-primary)]"
        >
          {t('categories')}
        </Link>
      </nav>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        <Link
          href={`/store/${locale}/cart`}
          className="relative flex items-center gap-1 rounded-md p-2 text-[var(--color-foreground)] hover:bg-[var(--color-muted)]"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
          <CartBadge />
        </Link>

        <Link
          href={`/store/${locale}/account`}
          className="rounded-md p-2 text-[var(--color-foreground)] hover:bg-[var(--color-muted)]"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </Link>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="absolute left-0 top-full w-full border-b bg-[var(--color-background)] p-4 shadow-lg lg:hidden">
          <nav className="flex flex-col gap-3">
            <Link
              href={`/store/${locale}`}
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-[var(--color-muted)]"
            >
              {t('welcome')}
            </Link>
            <Link
              href={`/store/${locale}/products`}
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-[var(--color-muted)]"
            >
              {t('header.allProducts')}
            </Link>
            <Link
              href={`/store/${locale}/categories`}
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-[var(--color-muted)]"
            >
              {t('categories')}
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
