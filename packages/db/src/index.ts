export { masterPrisma } from "./master-client";
export type { MasterPrismaClient } from "./master-client";

export {
  getTenantClient,
  disconnectTenant,
  disconnectAllTenants,
} from "./tenant-client";
export type { TenantPrismaClient } from "./tenant-client";
