"use client";

import { Card, CardContent, CardHeader, CardTitle, Button, Separator } from "@zunapro/ui";
import { useTranslations } from "next-intl";
import type { PlanData, WizardState } from "../_lib/wizard-state";

interface StepPaymentProps {
  plan: PlanData | null;
  storeInfo: WizardState["storeInfo"];
  domain: WizardState["domain"];
  isSubmitting: boolean;
  error: string | null;
  onPay: () => void;
}

export function StepPayment({ plan, storeInfo, domain, isSubmitting, error, onPay }: StepPaymentProps) {
  const t = useTranslations("wizard");

  if (!plan || !storeInfo) return null;

  const domainDisplay = domain.domainType === "custom" && domain.customDomain
    ? domain.customDomain
    : `${storeInfo.slug}.zunapro.com`;

  return (
    <div>
      <h2 className="mb-2 text-2xl font-bold">{t("paymentTitle")}</h2>
      <p className="mb-6 text-muted-foreground">{t("paymentDescription")}</p>

      <div className="mx-auto max-w-lg">
        <Card>
          <CardHeader>
            <CardTitle>{t("orderSummary")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("plan")}</span>
              <span className="font-medium">{plan.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("storeName")}</span>
              <span className="font-medium">{storeInfo.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("domain")}</span>
              <span className="font-mono text-sm">{domainDisplay}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("sector")}</span>
              <span>{t(`sectors.${storeInfo.sector}`)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>{t("total")}</span>
              <span>{plan.price} {plan.currency}/{t("month")}</span>
            </div>

            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
            )}

            <Button className="w-full" size="lg" onClick={onPay} disabled={isSubmitting}>
              {isSubmitting ? t("processing") : t("payNow")}
            </Button>

            <p className="text-center text-xs text-muted-foreground">{t("paymentSecure")}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
