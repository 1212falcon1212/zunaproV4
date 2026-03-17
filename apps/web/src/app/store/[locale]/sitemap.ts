import type { MetadataRoute } from 'next';
import { serverFetch } from '@/lib/server-store-api';

interface Product {
  slug: string;
  updatedAt: string;
}

interface Category {
  slug: string;
}

interface ProductsResponse {
  data: Product[];
  meta: { total: number };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_STORE_URL || 'https://store.zunapro.com';
  const locales = ['en', 'tr', 'de', 'fr', 'es'];

  const entries: MetadataRoute.Sitemap = [];

  // Homepage for each locale
  for (const locale of locales) {
    entries.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    });
  }

  try {
    // Products
    const productsRes = await serverFetch<ProductsResponse>('/storefront/products?limit=1000');
    for (const product of productsRes.data) {
      for (const locale of locales) {
        entries.push({
          url: `${baseUrl}/${locale}/products/${product.slug}`,
          lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      }
    }

    // Categories
    const categories = await serverFetch<Category[]>('/storefront/categories');
    for (const category of categories) {
      for (const locale of locales) {
        entries.push({
          url: `${baseUrl}/${locale}/categories/${category.slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      }
    }
  } catch {
    // Return what we have if API is unavailable
  }

  return entries;
}
