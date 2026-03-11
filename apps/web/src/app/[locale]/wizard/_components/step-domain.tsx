"use client";

import { Card, CardContent, CardHeader, CardTitle, Input, Label } from "@zunapro/ui";
import { useTranslations } from "next-intl";
import type { WizardState } from "../_lib/wizard-state";

interface StepDomainProps {
  slug: string;
  domain: WizardState["domain"];
  customDomainAllowed: boolean;
  onChange: (data: WizardState["domain"]) => void;
}

export function StepDomain({ slug, domain, customDomainAllowed, onChange }: StepDomainProps) {
  const t = useTranslations("wizard");

  return (
    <div>
      <h2 className="mb-2 text-2xl font-bold">{t("domainTitle")}</h2>
      <p className="mb-6 text-muted-foreground">{t("domainDescription")}</p>

      <div className="grid gap-4 md:grid-cols-2">
        <Card
          className={`cursor-pointer transition-all ${domain.domainType === "subdomain" ? "border-primary ring-2 ring-primary" : "hover:border-primary/50"}`}
          onClick={() => onChange({ domainType: "subdomain", customDomain: "" })}
        >
          <CardHeader>
            <CardTitle className="text-lg">{t("subdomainOption")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2 text-sm text-muted-foreground">{t("subdomainDescription")}</p>
            <div className="rounded-md bg-muted px-3 py-2 font-mono text-sm">
              {slug || "your-store"}.zunapro.com
            </div>
          </CardContent>
        </Card>

        <Card
          className={`transition-all ${!customDomainAllowed ? "cursor-not-allowed opacity-50" : domain.domainType === "custom" ? "cursor-pointer border-primary ring-2 ring-primary" : "cursor-pointer hover:border-primary/50"}`}
          onClick={() => {
            if (customDomainAllowed) {
              onChange({ domainType: "custom", customDomain: domain.customDomain || "" });
            }
          }}
        >
          <CardHeader>
            <CardTitle className="text-lg">
              {t("customDomainOption")}
              {!customDomainAllowed && (
                <span className="ml-2 text-xs font-normal text-muted-foreground">{t("upgradeRequired")}</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2 text-sm text-muted-foreground">{t("customDomainDescription")}</p>
            {domain.domainType === "custom" && customDomainAllowed && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="customDomain">{t("yourDomain")}</Label>
                  <Input
                    id="customDomain"
                    placeholder="www.example.com"
                    value={domain.customDomain || ""}
                    onChange={(e) => onChange({ ...domain, customDomain: e.target.value })}
                  />
                </div>
                <div className="rounded-md bg-muted p-3 text-xs">
                  <p className="mb-1 font-semibold">{t("dnsInstructions")}</p>
                  <code>CNAME → {slug}.zunapro.com</code>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
