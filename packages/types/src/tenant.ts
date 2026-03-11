export type TenantStatus =
  | "pending"
  | "provisioning"
  | "active"
  | "suspended"
  | "payment_overdue"
  | "provisioning_failed";

export interface ThemeConfig {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  logoUrl?: string;
  faviconUrl?: string;
}

export interface TenantConfig {
  sector: string;
  theme: ThemeConfig;
  locales: string[];
  defaultLocale: string;
  currencies: string[];
  defaultCurrency: string;
  timezone: string;
}

export interface Tenant {
  id: string;
  slug: string;
  name: string;
  status: TenantStatus;
  planId: string;
  config: TenantConfig;
  domain?: string;
  createdAt: Date;
  updatedAt: Date;
}
