export type PaymentProvider = "stripe" | "paytr";

export type PaymentStatus =
  | "pending"
  | "active"
  | "failed"
  | "cancelled"
  | "refunded";

export interface Payment {
  id: string;
  tenantId: string;
  planId: string;
  provider: PaymentProvider;
  status: PaymentStatus;
  amount: number;
  currency: string;
  externalId?: string;
  createdAt: Date;
}
