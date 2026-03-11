export { masterPrisma } from "./master-client.js";
export type { MasterPrismaClient } from "./master-client.js";

export {
  getTenantClient,
  disconnectTenant,
  disconnectAllTenants,
} from "./tenant-client.js";
export type { TenantPrismaClient } from "./tenant-client.js";
