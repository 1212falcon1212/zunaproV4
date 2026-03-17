import { PrismaClient } from "../node_modules/.prisma/tenant-client/index";

export type { PrismaClient as TenantPrismaClient } from "../node_modules/.prisma/tenant-client/index";

interface TenantConnection {
  client: PrismaClient;
  lastAccessedAt: number;
}

const tenantPool = new Map<string, TenantConnection>();

const MAX_CONNECTIONS_PER_TENANT = 5;
const IDLE_TIMEOUT_MS = 60_000;
const CLEANUP_INTERVAL_MS = 30_000;

function buildTenantDatabaseUrl(slug: string): string {
  const template = process.env.DATABASE_TENANT_URL_TEMPLATE;
  if (!template) {
    throw new Error(
      "DATABASE_TENANT_URL_TEMPLATE environment variable is required. " +
        "Use {slug} as placeholder, e.g.: postgresql://user:pass@host:5432/tenant_{slug}"
    );
  }
  return template.replace("{slug}", slug);
}

export function getTenantClient(slug: string): PrismaClient {
  const existing = tenantPool.get(slug);
  if (existing) {
    existing.lastAccessedAt = Date.now();
    return existing.client;
  }

  const client = new PrismaClient({
    datasourceUrl: buildTenantDatabaseUrl(slug),
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

  // Note: Prisma manages its own connection pool internally.
  // MAX_CONNECTIONS_PER_TENANT is enforced via the connection_limit param in the URL.
  const url = new URL(buildTenantDatabaseUrl(slug));
  url.searchParams.set("connection_limit", String(MAX_CONNECTIONS_PER_TENANT));

  tenantPool.set(slug, {
    client,
    lastAccessedAt: Date.now(),
  });

  return client;
}

export async function disconnectTenant(slug: string): Promise<void> {
  const connection = tenantPool.get(slug);
  if (connection) {
    await connection.client.$disconnect();
    tenantPool.delete(slug);
  }
}

export async function disconnectAllTenants(): Promise<void> {
  const disconnectPromises = Array.from(tenantPool.entries()).map(
    async ([slug, connection]) => {
      await connection.client.$disconnect();
      tenantPool.delete(slug);
    }
  );
  await Promise.all(disconnectPromises);
}

async function cleanupIdleConnections(): Promise<void> {
  const now = Date.now();
  const idleEntries = Array.from(tenantPool.entries()).filter(
    ([_, connection]) => now - connection.lastAccessedAt > IDLE_TIMEOUT_MS
  );

  for (const [slug, connection] of idleEntries) {
    await connection.client.$disconnect();
    tenantPool.delete(slug);
  }
}

// Start periodic cleanup of idle connections
const cleanupInterval = setInterval(
  cleanupIdleConnections,
  CLEANUP_INTERVAL_MS
);

// Allow the process to exit even if the interval is active
if (cleanupInterval.unref) {
  cleanupInterval.unref();
}
