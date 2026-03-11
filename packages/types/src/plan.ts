export interface PlanFeatures {
  maxProducts: number;
  maxStorage: number;
  customDomain: boolean;
  apiAccess: boolean;
  prioritySupport: boolean;
}

export interface Plan {
  id: string;
  name: string;
  slug: string;
  price: number;
  currency: string;
  features: PlanFeatures;
  modulesSlugs: string[];
}
