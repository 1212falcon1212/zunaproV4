"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, Badge, Button } from "@zunapro/ui";
import { useTranslations } from "next-intl";
import type { PlanData } from "../_lib/wizard-state";
import { fetchPlans } from "../_lib/api";

interface StepPlanProps {
  selectedPlanId: string;
  onSelect: (planId: string, plan: PlanData) => void;
}

export function StepPlan({ selectedPlanId, onSelect }: StepPlanProps) {
  const t = useTranslations("wizard");
  const [plans, setPlans] = useState<PlanData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPlans()
      .then(setPlans)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return <div className="py-10 text-center text-destructive">{error}</div>;
  }

  return (
    <div>
      <h2 className="mb-2 text-2xl font-bold">{t("planTitle")}</h2>
      <p className="mb-6 text-muted-foreground">{t("planDescription")}</p>
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const isSelected = plan.id === selectedPlanId;
          const features = plan.features as Record<string, unknown>;
          return (
            <Card
              key={plan.id}
              className={`cursor-pointer transition-all ${isSelected ? "border-primary ring-2 ring-primary" : "hover:border-primary/50"}`}
              onClick={() => onSelect(plan.id, plan)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{plan.name}</CardTitle>
                  {plan.slug === "profesyonel" && <Badge>{t("popular")}</Badge>}
                </div>
                <div className="mt-2">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground"> {plan.currency}/{t("month")}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>{t("features.products", { count: features.maxProducts as number })}</li>
                  <li>{t("features.storage", { size: features.maxStorage as number })}</li>
                  {features.customDomain && <li>{t("features.customDomain")}</li>}
                  {features.apiAccess && <li>{t("features.apiAccess")}</li>}
                  {features.prioritySupport && <li>{t("features.prioritySupport")}</li>}
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant={isSelected ? "default" : "outline"} className="w-full">
                  {isSelected ? t("selected") : t("select")}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
