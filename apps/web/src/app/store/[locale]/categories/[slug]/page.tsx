import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { serverFetch } from '@/lib/server-store-api';
import { ProductCard } from '../../_components/product-card';
import { Pagination } from '../../products/_components/pagination';

interface Category {
  id: string;
  name: Record<string, string>;
  slug: string;
  image?: string | null;
  seoMeta?: Record<string, { title?: string; description?: string }> | null;
  children?: { id: string; name: Record<string, string>; slug: string; _count: { products: number } }[];
}

interface Product {
  id: string;
  name: Record<string, string>;
  slug: string;
  price: string;
  compareAtPrice?: string | null;
  images: string[];
  status: string;
}

interface CategoryResponse {
  category: Category;
  products: {
    data: Product[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  };
}

interface Props {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;

  try {
    const response = await serverFetch<CategoryResponse>(`/storefront/categories/${slug}?limit=1`);
    const cat = response.category;
    const name = cat.name[locale] ?? cat.name.en ?? slug;
    const seo = cat.seoMeta?.[locale];

    return {
      title: seo?.title ?? name,
      description: seo?.description ?? `Browse ${name} products`,
      openGraph: { title: seo?.title ?? name },
    };
  } catch {
    return { title: slug };
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { locale, slug } = await params;
  const sp = await searchParams;
  const page = sp.page ? parseInt(sp.page, 10) : 1;
  const t = await getTranslations({ locale, namespace: 'storefront' });

  let response: CategoryResponse;
  try {
    response = await serverFetch<CategoryResponse>(`/storefront/categories/${slug}?page=${page}&limit=12`);
  } catch {
    notFound();
  }

  const { category, products } = response;
  const categoryName = category.name[locale] ?? category.name.en ?? slug;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-[var(--color-secondary)]">
        <Link href={`/store/${locale}`} className="hover:text-[var(--color-primary)]">
          {t('header.home')}
        </Link>
        <span>/</span>
        <Link href={`/store/${locale}/products`} className="hover:text-[var(--color-primary)]">
          {t('products.title')}
        </Link>
        <span>/</span>
        <span className="text-[var(--color-foreground)]">{categoryName}</span>
      </nav>

      {/* Category header */}
      <div className="mb-8">
        <h1
          className="text-3xl font-bold text-[var(--color-foreground)]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {categoryName}
        </h1>
        <p className="mt-1 text-sm text-[var(--color-secondary)]">
          {products.meta.total} {t('products.items')}
        </p>
      </div>

      {/* Subcategories */}
      {category.children && category.children.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {category.children.map((child) => (
            <Link
              key={child.id}
              href={`/store/${locale}/categories/${child.slug}`}
              className="rounded-full border border-[var(--color-border)] px-4 py-1.5 text-sm font-medium text-[var(--color-foreground)] hover:bg-[var(--color-muted)]"
            >
              {child.name[locale] ?? child.name.en ?? child.slug}
              <span className="ml-1 text-xs text-[var(--color-secondary)]">({child._count.products})</span>
            </Link>
          ))}
        </div>
      )}

      {/* Products grid */}
      {products.data.length > 0 ? (
        <>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {products.data.map((product) => (
              <ProductCard key={product.id} product={product} locale={locale} />
            ))}
          </div>
          <Pagination
            currentPage={products.meta.page}
            totalPages={products.meta.totalPages}
            basePath={`/store/${locale}/categories/${slug}`}
          />
        </>
      ) : (
        <div className="py-20 text-center">
          <p className="text-lg text-[var(--color-secondary)]">{t('noProducts')}</p>
        </div>
      )}
    </div>
  );
}
