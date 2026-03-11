// apps/web/src/app/[locale]/wizard/_components/wizard-shell.tsx
"use client";

import { Button } from "@zunapro/ui";
import { useTranslations } from "next-intl";
import type { WizardStep } from "../_lib/wizard-state";

const STEP_KEYS = ["package", "storeInfo", "domain", "visual", "payment", "setup"] as const;

interface WizardShellProps {
  step: WizardStep;
  onNext: () => void;
  onBack: () => void;
  canProceed: boolean;
  isSubmitting: boolean;
  children: React.ReactNode;
}

export function WizardShell({ step, onNext, onBack, canProceed, isSubmitting, children }: WizardShellProps) {
  const t = useTranslations("wizard");

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      {/* Step indicator */}
      <nav className="mb-8">
        <ol className="flex items-center">
          {STEP_KEYS.map((key, i) => {
            const isActive = i === step;
            const isCompleted = i < step;
            return (
              <li key={key} className="flex flex-1 items-center">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                      isCompleted
                        ? "bg-green-600 text-white"
                        : isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? "\u2713" : i + 1}
                  </div>
                  <span className={`text-xs ${isActive ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                    {t(`steps.${key}`)}
                  </span>
                </div>
                {i < STEP_KEYS.length - 1 && (
                  <div className={`mx-2 h-0.5 flex-1 ${i < step ? "bg-green-600" : "bg-muted"}`} />
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Step content */}
      <div className="min-h-[400px]">{children}</div>

      {/* Navigation buttons */}
      {step < 5 && (
        <div className="mt-8 flex justify-between">
          <Button variant="outline" onClick={onBack} disabled={step === 0 || isSubmitting}>
            {t("back")}
          </Button>
          <Button onClick={onNext} disabled={!canProceed || isSubmitting}>
            {isSubmitting ? t("processing") : step === 4 ? t("pay") : t("next")}
          </Button>
        </div>
      )}
    </div>
  );
}
