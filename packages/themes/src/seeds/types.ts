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
  isFeatured?: boolean;
  seoMeta?: Record<string, string>;
}

export interface SeedCategory {
  name: Record<string, string>;
  slug: string;
  image?: string;
  sortOrder: number;
  isFeatured?: boolean;
  parentSlug?: string;
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

export type SeedSettingValue = string | number | boolean | string[] | Record<string, unknown>;

export interface SeedSetting {
  key: string;
  value: SeedSettingValue;
  group: string;
}

export interface SeedMenu {
  name: Record<string, string>;
  slug: string;
  location: string;
  isActive?: boolean;
  items: {
    id: string;
    label: Record<string, string>;
    type: 'page' | 'category' | 'product' | 'custom';
    href: string;
    target?: '_blank' | '_self';
    children?: {
      id: string;
      label: Record<string, string>;
      type: 'page' | 'category' | 'product' | 'custom';
      href: string;
    }[];
  }[];
}

export interface SeedBlogPost {
  title: Record<string, string>;
  slug: string;
  excerpt: Record<string, string>;
  content: Record<string, string>;
  featuredImage?: string;
  author?: string;
  category?: string;
  tags?: string[];
  status: 'published';
  publishedAt: string;
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
  menus?: SeedMenu[];
  blogPosts?: SeedBlogPost[];
}
