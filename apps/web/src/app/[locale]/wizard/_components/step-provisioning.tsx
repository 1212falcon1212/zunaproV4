"use client";

import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { Card, CardContent, Progress, Button } from "@zunapro/ui";
import { useTranslations } from "next-intl";

interface ProgressEvent {
  jobName: string;
  status: "running" | "completed" | "failed";
  step: number;
  totalSteps: number;
  message: string;
  type?: string;
  panelUrl?: string;
  storefrontUrl?: string;
  domain?: string;
}

interface StepProvisioningProps {
  tenantId: string;
  tenantSlug: string;
}

const JOB_LABELS: Record<string, string> = {
  CreateTenantDatabase: "Creating database",
  ConfigureTenant: "Configuring tenant",
  SetupDomain: "Setting up domain",
  SeedInitialData: "Seeding data",
  ProcessBranding: "Processing branding",
  HealthCheck: "Health check",
  FinalizeAndNotify: "Finalizing",
};

export function StepProvisioning({ tenantId, tenantSlug }: StepProvisioningProps) {
  const t = useTranslations("wizard");
  const [events, setEvents] = useState<ProgressEvent[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(7);
  const [isComplete, setIsComplete] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [panelUrl, setPanelUrl] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    const socket = io(apiUrl, { transports: ["websocket"] });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("subscribe_provisioning", tenantId);
    });

    socket.on("provisioning_progress", (data: ProgressEvent) => {
      setEvents((prev) => [...prev, data]);
      setCurrentStep(data.step);
      setTotalSteps(data.totalSteps);

      if (data.type === "provisioning_complete") {
        setIsComplete(true);
        setPanelUrl(data.panelUrl || `https://${tenantSlug}.zunapro.com/panel`);
      }

      if (data.status === "failed") {
        setIsFailed(true);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [tenantId, tenantSlug]);

  const progressPercent = isComplete ? 100 : Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="mx-auto max-w-lg">
      <h2 className="mb-2 text-center text-2xl font-bold">
        {isComplete ? t("setupComplete") : isFailed ? t("setupFailed") : t("settingUp")}
      </h2>
      <p className="mb-8 text-center text-muted-foreground">
        {isComplete ? t("setupCompleteDescription") : isFailed ? t("setupFailedDescription") : t("settingUpDescription")}
      </p>

      <Card>
        <CardContent className="space-y-6 p-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{t("progress")}</span>
              <span>{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} />
          </div>

          <div className="space-y-2">
            {Object.entries(JOB_LABELS).map(([jobName, label]) => {
              const jobEvents = events.filter((e) => e.jobName === jobName);
              const lastEvent = jobEvents[jobEvents.length - 1];
              const status = lastEvent?.status;

              return (
                <div key={jobName} className="flex items-center justify-between rounded-md px-3 py-2 text-sm">
                  <span className={status === "completed" ? "text-green-600" : status === "running" ? "font-medium" : status === "failed" ? "text-destructive" : "text-muted-foreground"}>
                    {label}
                  </span>
                  <span>
                    {status === "completed" && "\u2713"}
                    {status === "running" && (
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    )}
                    {status === "failed" && "\u2717"}
                  </span>
                </div>
              );
            })}
          </div>

          {isComplete && panelUrl && (
            <div className="space-y-3 pt-4">
              <Button className="w-full" size="lg" asChild>
                <a href={panelUrl}>{t("goToPanel")}</a>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href={`https://${tenantSlug}.zunapro.com`}>{t("viewStorefront")}</a>
              </Button>
            </div>
          )}

          {isFailed && (
            <div className="rounded-md bg-destructive/10 p-3 text-center text-sm text-destructive">
              {t("setupFailedRetry")}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
