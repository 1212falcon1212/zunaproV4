import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { serverFetch } from '@/lib/server-store-api';
import { ProductGallery } from './_components/product-gallery';
import { ProductInfo } from './_components/product-info';
import { AddToCartForm } from './_components/add-to-cart-form';
import { RelatedProducts } from './_components/related-products';
import { Breadcrumbs } from './_components/breadcrumbs';
import { ShareButton } from './_components/share-button';
import { buildProductJsonLd } from '@/lib/seo';

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
  variants: { name: string; sku?: string; price?: number; stock?: number }[];
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

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Gallery */}
          <ProductGallery images={product.images} productName={productName} />

          {/* Product info + cart form */}
          <div>
            <ProductInfo product={product} locale={locale} />
            <AddToCartForm
              productId={product.id}
              variants={product.variants ?? []}
              stock={product.stock}
            />

            {/* Share */}
            <div className="mt-6 flex items-center gap-2 border-t border-[var(--color-border)] pt-6">
              <span className="text-sm text-[var(--color-secondary)]">{t('product.share')}:</span>
              <ShareButton />
            </div>
          </div>
        </div>

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
