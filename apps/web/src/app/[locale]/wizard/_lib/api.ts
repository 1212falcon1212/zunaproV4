import type { PlanData } from "./wizard-state";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function fetchPlans(): Promise<PlanData[]> {
  const res = await fetch(`${API_URL}/plans`);
  if (!res.ok) throw new Error("Failed to fetch plans");
  return res.json();
}

export async function checkSlug(slug: string): Promise<{ available: boolean; slug: string }> {
  const res = await fetch(`${API_URL}/tenants/check-slug/${encodeURIComponent(slug)}`);
  if (!res.ok) throw new Error("Failed to check slug");
  return res.json();
}

export async function createTenant(data: {
  name: string;
  slug: string;
  planId: string;
  sector: string;
  email: string;
  phone?: string;
  domain?: string;
  locales: string[];
  defaultLocale: string;
  currencies: string[];
  defaultCurrency: string;
  branding: { primaryColor: string; secondaryColor: string; accentColor: string };
}): Promise<{ id: string; slug: string }> {
  const res = await fetch(`${API_URL}/tenants`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Failed to create tenant" }));
    throw new Error(err.message);
  }
  return res.json();
}

export async function createCheckout(data: {
  planId: string;
  tenantSlug: string;
  tenantId: string;
  email: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<{ checkoutUrl: string }> {
  const res = await fetch(`${API_URL}/payments/create-checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create checkout");
  return res.json();
}
