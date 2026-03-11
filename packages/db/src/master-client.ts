import { PrismaClient } from "../../node_modules/.prisma/master-client/index.js";

const globalForPrisma = globalThis as unknown as {
  masterPrisma: PrismaClient | undefined;
};

export const masterPrisma =
  globalForPrisma.masterPrisma ??
  new PrismaClient({
    datasourceUrl: process.env.DATABASE_MASTER_URL,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.masterPrisma = masterPrisma;
}

export type { PrismaClient as MasterPrismaClient } from "../../node_modules/.prisma/master-client/index.js";
