const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function fetchDashboardStats(): Promise<{
  totalTenants: number;
  activeTenants: number;
  provisioningTenants: number;
  failedTenants: number;
  totalPlans: number;
}> {
  const [tenantsRes, plansRes] = await Promise.all([
    fetch(`${API_URL}/tenants?limit=1`, { cache: "no-store" }),
    fetch(`${API_URL}/plans`, { cache: "no-store" }),
  ]);

  const tenantsData = tenantsRes.ok ? await tenantsRes.json() : { meta: { total: 0 }, data: [] };
  const plansData = plansRes.ok ? await plansRes.json() : [];

  return {
    totalTenants: tenantsData.meta?.total ?? 0,
    activeTenants: 0,
    provisioningTenants: 0,
    failedTenants: 0,
    totalPlans: Array.isArray(plansData) ? plansData.length : 0,
  };
}

export async function fetchTenants(page = 1, limit = 20) {
  const res = await fetch(`${API_URL}/tenants?page=${page}&limit=${limit}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch tenants");
  return res.json();
}

export async function fetchTenant(id: string) {
  const res = await fetch(`${API_URL}/tenants/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch tenant");
  return res.json();
}

export async function fetchPlans() {
  const res = await fetch(`${API_URL}/plans`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch plans");
  return res.json();
}
