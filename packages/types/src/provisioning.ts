export type ProvisioningJobName =
  | "CreateTenantDatabase"
  | "ConfigureTenant"
  | "SetupDomain"
  | "SeedInitialData"
  | "ProcessBranding"
  | "HealthCheck"
  | "FinalizeAndNotify";

export type ProvisioningJobStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "skipped";

export interface ProvisioningJob {
  tenantId: string;
  jobName: ProvisioningJobName;
  status: ProvisioningJobStatus;
  attempt: number;
  error?: string;
  startedAt?: Date;
  completedAt?: Date;
}

export interface ProgressEvent {
  jobName: ProvisioningJobName;
  status: "running" | "completed" | "failed";
  step: number;
  totalSteps: 7;
  message: string;
}
