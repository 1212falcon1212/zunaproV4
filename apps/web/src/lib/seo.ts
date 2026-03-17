interface ProductForSeo {
  name: Record<string, string>;
  description?: Record<string, string> | null;
  price: string | number;
  images: string[];
  sku?: string | null;
  stock: number;
  category?: { name: Record<string, string> } | null;
}

interface CategoryForSeo {
  name: Record<string, string>;
  seoMeta?: Record<string, { title?: string; description?: string }> | null;
}

export function buildProductJsonLd(product: ProductForSeo, locale: string) {
  const name = product.name[locale] ?? product.name.en ?? '';
  const description = product.description?.[locale] ?? product.description?.en ?? '';

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image: product.images,
    sku: product.sku ?? undefined,
    category: product.category
      ? (product.category.name[locale] ?? product.category.name.en)
      : undefined,
    offers: {
      '@type': 'Offer',
      price: Number(product.price),
      priceCurrency: 'USD',
      availability: product.stock > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
  };
}

export function buildCategoryJsonLd(category: CategoryForSeo, locale: string) {
  const name = category.name[locale] ?? category.name.en ?? '';
  const seo = category.seoMeta?.[locale];

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: seo?.title ?? name,
    description: seo?.description ?? `Browse ${name} products`,
  };
}

export function buildBreadcrumbJsonLd(
  items: { name: string; url?: string }[],
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      ...(item.url ? { item: item.url } : {}),
    })),
  };
}

export function generateProductMetadata(
  product: ProductForSeo,
  locale: string,
  seoMeta?: Record<string, { title?: string; description?: string }> | null,
) {
  const name = product.name[locale] ?? product.name.en ?? '';
  const seo = seoMeta?.[locale];

  return {
    title: seo?.title ?? name,
    description: seo?.description ?? `Buy ${name} online`,
    openGraph: {
      title: seo?.title ?? name,
      description: seo?.description ?? `Buy ${name} online`,
      images: product.images?.[0] ? [{ url: product.images[0] }] : [],
      type: 'website' as const,
    },
  };
}

export function generateCategoryMetadata(
  category: CategoryForSeo,
  locale: string,
) {
  const name = category.name[locale] ?? category.name.en ?? '';
  const seo = category.seoMeta?.[locale];

  return {
    title: seo?.title ?? name,
    description: seo?.description ?? `Browse ${name} products`,
    openGraph: {
      title: seo?.title ?? name,
      description: seo?.description ?? `Browse ${name} products`,
    },
  };
}
