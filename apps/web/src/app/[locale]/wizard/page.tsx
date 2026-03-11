"use client";

import { useReducer, useCallback } from "react";
import { useTranslations } from "next-intl";
import { WizardShell } from "./_components/wizard-shell";
import { StepPlan } from "./_components/step-plan";
import { StepStoreInfo } from "./_components/step-store-info";
import { StepDomain } from "./_components/step-domain";
import { StepBranding } from "./_components/step-branding";
import { StepPayment } from "./_components/step-payment";
import { StepProvisioning } from "./_components/step-provisioning";
import { wizardReducer, initialState } from "./_lib/wizard-state";
import type { PlanData } from "./_lib/wizard-state";
import type { z } from "zod";
import type { storeInfoSchema } from "./_lib/wizard-state";
import { createTenant } from "./_lib/api";

export default function WizardPage() {
  const t = useTranslations("wizard");
  const [state, dispatch] = useReducer(wizardReducer, initialState);

  const canProceed = useCallback((): boolean => {
    switch (state.step) {
      case 0: return !!state.planId;
      case 1: return !!state.storeInfo;
      case 2: return true;
      case 3: return true;
      case 4: return !!state.storeInfo && !!state.planId;
      default: return false;
    }
  }, [state.step, state.planId, state.storeInfo]);

  const handleNext = useCallback(async () => {
    if (state.step === 1) {
      // Submit the store info form programmatically
      const form = document.getElementById("store-info-form") as HTMLFormElement;
      if (form) {
        form.requestSubmit();
        return; // onSubmit handler will call NEXT_STEP
      }
    }

    if (state.step === 4) {
      // Payment step: create tenant, then trigger provisioning
      dispatch({ type: "SET_SUBMITTING", isSubmitting: true });
      dispatch({ type: "SET_ERROR", error: null });
      try {
        const storeInfo = state.storeInfo!;
        const tenant = await createTenant({
          name: storeInfo.name,
          slug: storeInfo.slug,
          planId: state.planId,
          sector: storeInfo.sector,
          email: storeInfo.email,
          phone: storeInfo.phone,
          domain: state.domain.domainType === "custom" ? state.domain.customDomain : undefined,
          locales: storeInfo.locales,
          defaultLocale: storeInfo.defaultLocale,
          currencies: storeInfo.currencies,
          defaultCurrency: storeInfo.defaultCurrency,
          branding: {
            primaryColor: state.branding.primaryColor,
            secondaryColor: state.branding.secondaryColor,
            accentColor: state.branding.accentColor,
          },
        });
        dispatch({ type: "SET_TENANT_ID", tenantId: tenant.id });
        // For MVP: skip external payment, go directly to provisioning
        dispatch({ type: "NEXT_STEP" });
      } catch (e) {
        dispatch({ type: "SET_ERROR", error: e instanceof Error ? e.message : "An error occurred" });
      } finally {
        dispatch({ type: "SET_SUBMITTING", isSubmitting: false });
      }
      return;
    }

    dispatch({ type: "NEXT_STEP" });
  }, [state]);

  const handleBack = useCallback(() => {
    dispatch({ type: "PREV_STEP" });
  }, []);

  const handlePlanSelect = useCallback((planId: string, plan: PlanData) => {
    dispatch({ type: "SET_PLAN", planId, plan });
  }, []);

  const handleStoreInfoSubmit = useCallback((data: z.infer<typeof storeInfoSchema>) => {
    dispatch({ type: "SET_STORE_INFO", data });
    dispatch({ type: "NEXT_STEP" });
  }, []);

  const features = state.plan?.features as Record<string, unknown> | undefined;
  const customDomainAllowed = !!(features?.customDomain);

  return (
    <main className="min-h-screen bg-background">
      <WizardShell
        step={state.step}
        onNext={handleNext}
        onBack={handleBack}
        canProceed={canProceed()}
        isSubmitting={state.isSubmitting}
      >
        {state.step === 0 && (
          <StepPlan selectedPlanId={state.planId} onSelect={handlePlanSelect} />
        )}
        {state.step === 1 && (
          <StepStoreInfo defaultValues={state.storeInfo} onSubmit={handleStoreInfoSubmit} />
        )}
        {state.step === 2 && (
          <StepDomain
            slug={state.storeInfo?.slug || ""}
            domain={state.domain}
            customDomainAllowed={customDomainAllowed}
            onChange={(data) => dispatch({ type: "SET_DOMAIN", data })}
          />
        )}
        {state.step === 3 && (
          <StepBranding
            branding={state.branding}
            storeName={state.storeInfo?.name || ""}
            onChange={(data) => dispatch({ type: "SET_BRANDING", data })}
          />
        )}
        {state.step === 4 && (
          <StepPayment
            plan={state.plan}
            storeInfo={state.storeInfo}
            domain={state.domain}
            isSubmitting={state.isSubmitting}
            error={state.error}
            onPay={handleNext}
          />
        )}
        {state.step === 5 && state.tenantId && (
          <StepProvisioning
            tenantId={state.tenantId}
            tenantSlug={state.storeInfo?.slug || ""}
          />
        )}
      </WizardShell>
    </main>
  );
}
