import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { serverFetch } from '@/lib/server-store-api';
import { ProductGrid } from './_components/product-grid';
import { ProductFilters } from './_components/product-filters';
import { Pagination } from './_components/pagination';

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
  meta: { total: number; page: number; limit: number; totalPages: number };
}

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'storefront' });

  return {
    title: t('products.title'),
    description: t('seo.defaultDescription'),
  };
}

export default async function ProductsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const sp = await searchParams;
  const t = await getTranslations({ locale, namespace: 'storefront' });

  const queryParams = new URLSearchParams();
  if (sp.page) queryParams.set('page', sp.page);
  if (sp.category) queryParams.set('category', sp.category);
  if (sp.minPrice) queryParams.set('minPrice', sp.minPrice);
  if (sp.maxPrice) queryParams.set('maxPrice', sp.maxPrice);
  if (sp.search) queryParams.set('search', sp.search);
  if (sp.sort) queryParams.set('sort', sp.sort);
  queryParams.set('limit', '12');

  let response: ProductsResponse;
  try {
    response = await serverFetch<ProductsResponse>(`/storefront/products?${queryParams.toString()}`);
  } catch {
    response = { data: [], meta: { total: 0, page: 1, limit: 12, totalPages: 0 } };
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1
          className="text-3xl font-bold text-[var(--color-foreground)]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {sp.search ? `${t('products.searchResults')}: "${sp.search}"` : t('products.title')}
        </h1>
        <p className="mt-1 text-sm text-[var(--color-secondary)]">
          {response.meta.total} {t('products.items')}
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar filters */}
        <aside className="w-full shrink-0 lg:w-64">
          <ProductFilters locale={locale} />
        </aside>

        {/* Product grid */}
        <div className="flex-1">
          <ProductGrid products={response.data} locale={locale} />
          <Pagination
            currentPage={response.meta.page}
            totalPages={response.meta.totalPages}
            basePath={`/store/${locale}/products`}
          />
        </div>
      </div>
    </div>
  );
}
