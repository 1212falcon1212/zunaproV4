import { getTranslations } from 'next-intl/server';
import { serverFetch } from '@/lib/server-store-api';
import { ProductCard } from './product-card';

interface Product {
  id: string;
  name: Record<string, string>;
  slug: string;
  price: string;
  compareAtPrice?: string | null;
  images: string[];
  status: string;
}

interface ProductsResponse {
  data: Product[];
  meta: { total: number };
}

interface FeaturedProductsProps {
  locale: string;
}

export async function FeaturedProducts({ locale }: FeaturedProductsProps) {
  const t = await getTranslations('storefront');

  let products: Product[] = [];
  try {
    const response = await serverFetch<ProductsResponse>('/storefront/products?limit=8&sort=newest');
    products = response.data;
  } catch {
    products = [];
  }

  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h2
        className="text-2xl font-bold text-[var(--color-foreground)] sm:text-3xl"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {t('products.featured')}
      </h2>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} locale={locale} />
        ))}
      </div>
    </section>
  );
}
