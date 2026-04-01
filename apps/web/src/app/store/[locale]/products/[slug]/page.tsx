import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { serverFetch } from '@/lib/server-store-api';
import { ProductDetailClient } from './_components/product-detail-client';
import { RelatedProducts } from './_components/related-products';
import { Breadcrumbs } from './_components/breadcrumbs';
import { buildProductJsonLd } from '@/lib/seo';
import type { ProductVariantDisplay } from './_components/variant-selector';

interface Product {
  id: string;
  name: Record<string, string>;
  slug: string;
  description?: Record<string, string> | null;
  price: string | number;
  compareAtPrice?: string | number | null;
  sku?: string | null;
  stock: number;
  images: string[];
  /** @deprecated Old variant format — kept for backwards compatibility */
  variants?: { name: string; sku?: string; price?: number; stock?: number }[];
  productVariants: ProductVariantDisplay[];
  category?: { id: string; name: Record<string, string>; slug: string } | null;
  seoMeta?: Record<string, { title?: string; description?: string }> | null;
}

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;

  try {
    const product = await serverFetch<Product>(`/storefront/products/${slug}`);
    const name = product.name[locale] ?? product.name.en ?? slug;
    const seo = product.seoMeta?.[locale];

    return {
      title: seo?.title ?? name,
      description: seo?.description ?? `Buy ${name} online`,
      openGraph: {
        title: seo?.title ?? name,
        description: seo?.description ?? `Buy ${name} online`,
        images: product.images?.[0] ? [{ url: product.images[0] }] : [],
        type: 'website',
      },
    };
  } catch {
    return { title: slug };
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'storefront' });

  let product: Product;
  try {
    product = await serverFetch<Product>(`/storefront/products/${slug}`);
  } catch {
    notFound();
  }

  const productName = product.name[locale] ?? product.name.en ?? slug;
  const categoryName = product.category
    ? (product.category.name[locale] ?? product.category.name.en ?? product.category.slug)
    : null;

  const jsonLd = buildProductJsonLd(product, locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs
          locale={locale}
          items={[
            { label: t('products.title'), href: `/store/${locale}/products` },
            ...(product.category
              ? [{ label: categoryName!, href: `/store/${locale}/categories/${product.category.slug}` }]
              : []),
            { label: productName },
          ]}
        />

        <ProductDetailClient
          product={{
            id: product.id,
            name: product.name,
            slug: product.slug,
            description: product.description,
            price: product.price,
            compareAtPrice: product.compareAtPrice,
            sku: product.sku,
            stock: product.stock,
            images: product.images,
            productVariants: product.productVariants ?? [],
          }}
          locale={locale}
        />

        {/* Related Products */}
        {product.category && (
          <RelatedProducts
            categorySlug={product.category.slug}
            currentProductId={product.id}
            locale={locale}
          />
        )}
      </div>
    </>
  );
}
