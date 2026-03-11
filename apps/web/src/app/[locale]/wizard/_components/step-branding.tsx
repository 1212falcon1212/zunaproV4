"use client";

import { useRef } from "react";
import { Input, Label, Button, Card, CardContent } from "@zunapro/ui";
import { useTranslations } from "next-intl";
import type { WizardState } from "../_lib/wizard-state";

interface StepBrandingProps {
  branding: WizardState["branding"];
  storeName: string;
  onChange: (data: WizardState["branding"]) => void;
}

export function StepBranding({ branding, storeName, onChange }: StepBrandingProps) {
  const t = useTranslations("wizard");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    onChange({ ...branding, logoFile: file });
  };

  return (
    <div>
      <h2 className="mb-2 text-2xl font-bold">{t("brandingTitle")}</h2>
      <p className="mb-6 text-muted-foreground">{t("brandingDescription")}</p>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{t("primaryColor")}</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={branding.primaryColor}
                onChange={(e) => onChange({ ...branding, primaryColor: e.target.value })}
                className="h-10 w-14 cursor-pointer rounded border"
              />
              <Input
                value={branding.primaryColor}
                onChange={(e) => onChange({ ...branding, primaryColor: e.target.value })}
                className="w-28 font-mono text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t("secondaryColor")}</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={branding.secondaryColor}
                onChange={(e) => onChange({ ...branding, secondaryColor: e.target.value })}
                className="h-10 w-14 cursor-pointer rounded border"
              />
              <Input
                value={branding.secondaryColor}
                onChange={(e) => onChange({ ...branding, secondaryColor: e.target.value })}
                className="w-28 font-mono text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t("accentColor")}</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={branding.accentColor}
                onChange={(e) => onChange({ ...branding, accentColor: e.target.value })}
                className="h-10 w-14 cursor-pointer rounded border"
              />
              <Input
                value={branding.accentColor}
                onChange={(e) => onChange({ ...branding, accentColor: e.target.value })}
                className="w-28 font-mono text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t("logo")}</Label>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
              {branding.logoFile ? branding.logoFile.name : t("uploadLogo")}
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <p className="mb-3 text-sm font-medium text-muted-foreground">{t("preview")}</p>
            <div className="overflow-hidden rounded-lg border">
              <div className="flex items-center justify-between px-4 py-3" style={{ backgroundColor: branding.primaryColor }}>
                <span className="font-bold text-white">{storeName || "My Store"}</span>
                <div className="flex gap-2">
                  <div className="h-2 w-8 rounded bg-white/40" />
                  <div className="h-2 w-8 rounded bg-white/40" />
                  <div className="h-2 w-8 rounded bg-white/40" />
                </div>
              </div>
              <div className="space-y-3 bg-white p-4">
                <div className="h-3 w-3/4 rounded" style={{ backgroundColor: branding.secondaryColor, opacity: 0.3 }} />
                <div className="h-3 w-1/2 rounded" style={{ backgroundColor: branding.secondaryColor, opacity: 0.2 }} />
                <button
                  className="rounded px-4 py-1.5 text-sm font-medium text-white"
                  style={{ backgroundColor: branding.accentColor }}
                  type="button"
                >
                  {t("sampleButton")}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
