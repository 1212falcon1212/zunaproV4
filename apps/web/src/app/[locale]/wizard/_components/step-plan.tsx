"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@zunapro/ui";
import { useTranslations } from "next-intl";
import type { PlanData } from "../_lib/wizard-state";
import { fetchPlans } from "../_lib/api";

interface StepPlanProps {
  selectedPlanId: string;
  onSelect: (planId: string, plan: PlanData) => void;
}

export function StepPlan({ selectedPlanId, onSelect }: StepPlanProps) {
  const t = useTranslations("wizard");
  const [plan, setPlan] = useState<PlanData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans()
      .then((plans) => {
        // Auto-select the first (Starter) plan
        const selected = plans.find((p) => p.id === selectedPlanId) || plans[0];
        if (selected) {
          setPlan(selected);
          onSelect(selected.id, selected);
        }
      })
      .catch(() => {
        // Fallback: create a default starter plan entry
        const fallback: PlanData = {
          id: '00000000-0000-0000-0000-000000000001',
          name: 'Starter',
          slug: 'starter',
          price: 0,
          currency: 'TRY',
          moduleSlugs: ['ecommerce'],
          features: { maxProducts: 100, maxStorage: 1 },
        };
        setPlan(fallback);
        onSelect(fallback.id, fallback);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const features = (plan?.features ?? {}) as Record<string, unknown>;

  return (
    <div>
      <h2 className="mb-2 text-2xl font-bold">{t("planTitle")}</h2>
      <p className="mb-6 text-muted-foreground">{t("planDescription")}</p>

      <Card className="mx-auto max-w-md border-primary ring-2 ring-primary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{plan?.name ?? 'Starter'}</CardTitle>
            <Badge variant="default">{t("currentPlan")}</Badge>
          </div>
          <div className="mt-2">
            <span className="text-3xl font-bold">{plan?.price ?? 0}</span>
            <span className="text-muted-foreground"> {plan?.currency ?? 'TRY'}/{t("month")}</span>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
              {t("features.products", { count: (features.maxProducts as number) ?? 100 })}
            </li>
            <li className="flex items-center gap-2">
              <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
              {t("features.storage", { size: (features.maxStorage as number) ?? 1 })}
            </li>
            <li className="flex items-center gap-2">
              <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
              E-Commerce
            </li>
          </ul>
          <p className="mt-4 text-xs text-muted-foreground">
            {t("upgradeLater")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
