import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, Badge, Separator } from "@zunapro/ui";
import { fetchTenant } from "@/lib/api";

export default async function TenantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let tenant: Record<string, unknown>;
  try {
    tenant = await fetchTenant(id);
  } catch {
    notFound();
  }

  const config = (tenant.config ?? {}) as Record<string, unknown>;
  const theme = (config.theme ?? {}) as Record<string, string>;
  const plan = (tenant.plan ?? {}) as Record<string, unknown>;
  const modules = (tenant.tenantModules ?? []) as Array<Record<string, unknown>>;

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <h1 className="text-3xl font-bold">{tenant.name as string}</h1>
        <Badge>{tenant.status as string}</Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>General</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Slug</span>
              <span className="font-mono">{tenant.slug as string}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Domain</span>
              <span className="font-mono">{(tenant.domain as string) || `${tenant.slug}.zunapro.com`}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Plan</span>
              <span>{plan.name as string}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sector</span>
              <span>{(config.sector as string) || "-"}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created</span>
              <span>{new Date(tenant.createdAt as string).toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Theme</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            {Object.entries(theme).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-muted-foreground">{key}</span>
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded border" style={{ backgroundColor: value }} />
                  <span className="font-mono text-xs">{value}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader><CardTitle>Active Modules ({modules.length})</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {modules.map((tm) => {
                const mod = tm.module as Record<string, string> | undefined;
                return (
                  <Badge key={tm.id as string} variant="secondary">
                    {mod?.name ?? (tm.moduleSlug as string)}
                  </Badge>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
