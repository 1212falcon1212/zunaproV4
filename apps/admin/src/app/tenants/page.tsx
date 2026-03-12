import Link from "next/link";
import { Badge } from "@zunapro/ui";
import { fetchTenants } from "@/lib/api";

const STATUS_COLORS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  active: "default",
  pending: "secondary",
  provisioning: "secondary",
  suspended: "destructive",
  provisioning_failed: "destructive",
  payment_overdue: "destructive",
};

export default async function TenantsPage() {
  let data = { data: [] as Record<string, unknown>[], meta: { total: 0, page: 1, totalPages: 1 } };

  try {
    data = await fetchTenants(1, 50);
  } catch {
    // Render empty state
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tenants</h1>
        <span className="text-sm text-muted-foreground">{data.meta.total} total</span>
      </div>

      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Slug</th>
              <th className="px-4 py-3 text-left font-medium">Plan</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Domain</th>
              <th className="px-4 py-3 text-left font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {data.data.map((tenant) => (
              <tr key={tenant.id as string} className="border-b hover:bg-muted/30">
                <td className="px-4 py-3">
                  <Link href={`/tenants/${tenant.id}`} className="font-medium hover:underline">
                    {tenant.name as string}
                  </Link>
                </td>
                <td className="px-4 py-3 font-mono text-xs">{tenant.slug as string}</td>
                <td className="px-4 py-3">
                  {(tenant.plan as Record<string, string>)?.name ?? "-"}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={STATUS_COLORS[tenant.status as string] ?? "outline"}>
                    {tenant.status as string}
                  </Badge>
                </td>
                <td className="px-4 py-3 font-mono text-xs">
                  {(tenant.domain as string) || `${tenant.slug}.zunapro.com`}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(tenant.createdAt as string).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {data.data.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  No tenants yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
