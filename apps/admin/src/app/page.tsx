import { Card, CardContent, CardHeader, CardTitle } from "@zunapro/ui";
import { fetchDashboardStats } from "@/lib/api";

export default async function DashboardPage() {
  let stats = {
    totalTenants: 0,
    activeTenants: 0,
    provisioningTenants: 0,
    failedTenants: 0,
    totalPlans: 0,
  };

  try {
    stats = await fetchDashboardStats();
  } catch {
    // Dashboard should still render even if API is down
  }

  const cards = [
    { title: "Total Tenants", value: stats.totalTenants },
    { title: "Active", value: stats.activeTenants },
    { title: "Provisioning", value: stats.provisioningTenants },
    { title: "Failed", value: stats.failedTenants },
    { title: "Plans", value: stats.totalPlans },
  ];

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
