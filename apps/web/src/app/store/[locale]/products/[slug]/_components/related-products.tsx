import { getTranslations } from 'next-intl/server';
import { serverFetch } from '@/lib/server-store-api';
import { ProductCard } from '../../../_components/product-card';

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
}

interface RelatedProductsProps {
  categorySlug: string;
  currentProductId: string;
  locale: string;
}

export async function RelatedProducts({ categorySlug, currentProductId, locale }: RelatedProductsProps) {
  const t = await getTranslations('storefront');

  let products: Product[] = [];
  try {
    const response = await serverFetch<ProductsResponse>(
      `/storefront/products?category=${categorySlug}&limit=4`,
    );
    products = response.data.filter((p) => p.id !== currentProductId);
  } catch {
    products = [];
  }

  if (products.length === 0) return null;

  return (
    <section className="mt-16 border-t border-[var(--color-border)] pt-12">
      <h2
        className="text-2xl font-bold text-[var(--color-foreground)]"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {t('product.related')}
      </h2>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} locale={locale} />
        ))}
      </div>
    </section>
  );
}
