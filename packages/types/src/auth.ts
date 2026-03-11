export type UserRole = "owner" | "admin" | "editor" | "viewer" | "accountant";

export interface JwtPayload {
  userId: string;
  tenantId: string;
  planId: string;
  role: UserRole;
  activeModules: string[];
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}
