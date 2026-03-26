'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { storeApi } from '@/lib/store-api';
import { ProductCard } from '../_components/product-card';

interface Product {
  id: string;
  name: Record<string, string>;
  slug: string;
  price: string | number;
  compareAtPrice?: string | number | null;
  sku?: string | null;
  stock?: number;
  images: string[];
  status: string;
  isFeatured?: boolean;
  category?: { name: Record<string, string>; slug: string } | null;
}

export default function FeaturedProductsPage() {
  const { locale } = useParams<{ locale: string }>();
  const t = useTranslations('storefront');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    storeApi.get<Product[]>('/storefront/products/featured', { limit: 50 })
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-[1300px] px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('header.allProducts')}
        </h1>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-80 animate-pulse rounded-lg bg-[var(--color-muted)]" />
          ))}
        </div>
      </div>
    );
  }

  const title = locale === 'tr' ? 'One Cikan Urunler' : locale === 'de' ? 'Empfohlene Produkte' : locale === 'fr' ? 'Produits en vedette' : locale === 'es' ? 'Productos destacados' : 'Featured Products';

  return (
    <div className="mx-auto max-w-[1300px] px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-[var(--color-foreground)]" style={{ fontFamily: 'var(--font-heading)' }}>
        {title}
      </h1>

      {products.length === 0 ? (
        <p className="text-[var(--color-secondary)]">{t('empty')}</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
