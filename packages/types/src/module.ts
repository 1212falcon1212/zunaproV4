export type ModuleSlug =
  | "products"
  | "orders"
  | "customers"
  | "seo-basic"
  | "settings"
  | "seo-advanced"
  | "reports"
  | "api-access";

export interface Module {
  id: string;
  name: string;
  slug: ModuleSlug;
  description: string;
}

export interface TenantModule {
  tenantId: string;
  moduleSlug: ModuleSlug;
  isActive: boolean;
}
