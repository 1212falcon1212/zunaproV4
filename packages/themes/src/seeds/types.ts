import type { PageContent } from '@zunapro/types';

export interface SeedProduct {
  name: Record<string, string>;
  description: Record<string, string>;
  slug: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  stock: number;
  images: string[];
  categorySlug: string;
  status: 'active';
  seoMeta?: Record<string, string>;
}

export interface SeedCategory {
  name: Record<string, string>;
  slug: string;
  image?: string;
  sortOrder: number;
}

export interface SeedPage {
  title: Record<string, string>;
  slug: string;
  content: PageContent;
  isPublished: true;
  seoMeta: Record<string, string>;
}

export interface SeedCustomer {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  locale: string;
  addresses: {
    firstName: string;
    lastName: string;
    address1: string;
    city: string;
    postalCode: string;
    country: string;
    phone?: string;
  }[];
}

export interface SeedOrder {
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered';
  paymentStatus: 'pending' | 'paid';
  paymentMethod: string;
  locale: string;
  currency: string;
  customerIndex: number;
  productSlugs: string[];
  quantities: number[];
}

export type SeedSettingValue = string | number | boolean | string[] | Record<string, string>;

export interface SeedSetting {
  key: string;
  value: SeedSettingValue;
  group: string;
}

export interface SectorSeedData {
  categories: SeedCategory[];
  products: SeedProduct[];
  pages: SeedPage[];
  header: PageContent;
  footer: PageContent;
  settings: SeedSetting[];
  customers?: SeedCustomer[];
  orders?: SeedOrder[];
}
