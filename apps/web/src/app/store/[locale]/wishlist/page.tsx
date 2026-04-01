'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { storeApi } from '@/lib/store-api';
import { useWishlist } from '../_components/hooks/use-wishlist';
import { useCurrency } from '../_components/hooks/use-currency';

interface Product {
  id: string;
  name: Record<string, string>;
  slug: string;
  price: number;
  compareAtPrice?: number | null;
  images: string[];
}

export default function WishlistPage() {
  const { locale } = useParams<{ locale: string }>();
  const t = useTranslations('storefront');
  const { items: wishlistIds, remove } = useWishlist();
  const { formatPrice } = useCurrency();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (wishlistIds.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    // Fetch all products and filter by wishlist IDs
    storeApi.get<{ data: Product[] }>('/storefront/products', { limit: 100 })
      .then((res) => {
        const filtered = res.data.filter((p) => wishlistIds.includes(p.id));
        setProducts(filtered);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [wishlistIds]);

  if (loading) {
    return (
      <div className="mx-auto max-w-[1300px] px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('header.wishlist')}
        </h1>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-lg bg-[var(--color-muted)]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1300px] px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-[var(--color-foreground)]" style={{ fontFamily: 'var(--font-heading)' }}>
        {t('header.wishlist')}
      </h1>

      {products.length === 0 ? (
        <div className="flex flex-col items-center py-16">
          <svg className="mb-4 h-16 w-16 text-[var(--color-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
          <p className="mb-4 text-lg text-[var(--color-secondary)]">{t('emptyWishlist')}</p>
          <Link
            href={`/store/${locale}/products`}
            className="rounded-md bg-[var(--color-primary)] px-6 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            {t('header.allProducts')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <div key={product.id} className="group relative overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-background)]">
              <button
                onClick={() => remove(product.id)}
                className="absolute right-2 top-2 z-10 rounded-full bg-white/90 p-1.5 text-red-500 shadow-sm hover:bg-white"
                title="Remove"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
                </svg>
              </button>
              <Link href={`/store/${locale}/products/${product.slug}`}>
                <div className="aspect-square overflow-hidden bg-[var(--color-muted)]">
                  {product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name[locale] ?? product.name['en'] ?? product.slug}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <svg className="h-12 w-12 text-[var(--color-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M18 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium text-[var(--color-foreground)]">
                    {product.name[locale] ?? product.name['en'] ?? product.slug}
                  </h3>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-sm font-semibold text-[var(--color-primary)]">
                      {formatPrice(product.price)}
                    </span>
                    {product.compareAtPrice && (
                      <span className="text-xs text-[var(--color-secondary)] line-through">
                        {formatPrice(product.compareAtPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
