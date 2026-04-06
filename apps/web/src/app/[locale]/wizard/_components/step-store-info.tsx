// @ts-nocheck — zod v4 + @hookform/resolvers version mismatch
"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, Label, Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@zunapro/ui";
import { useTranslations } from "next-intl";
import { storeInfoSchema } from "../_lib/wizard-state";
import { checkSlug } from "../_lib/api";

type StoreInfoData = z.infer<typeof storeInfoSchema>;

const SECTORS = ["genel", "mobilya", "teknoloji", "giyim", "gida", "kozmetik"] as const;
const LOCALES = [
  { code: "tr", name: "Turkce" },
  { code: "en", name: "English" },
  { code: "de", name: "Deutsch" },
  { code: "fr", name: "Francais" },
  { code: "es", name: "Espanol" },
];
const CURRENCIES = [
  { code: "TRY", name: "TRY" },
  { code: "EUR", name: "EUR" },
  { code: "USD", name: "USD" },
  { code: "GBP", name: "GBP" },
];

interface StepStoreInfoProps {
  defaultValues: StoreInfoData | null;
  onSubmit: (data: StoreInfoData) => void;
}

export function StepStoreInfo({ defaultValues, onSubmit }: StepStoreInfoProps) {
  const t = useTranslations("wizard");
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [slugChecking, setSlugChecking] = useState(false);

  const form = useForm<StoreInfoData>({
    resolver: zodResolver(storeInfoSchema),
    defaultValues: defaultValues ?? {
      name: "",
      slug: "",
      sector: "genel",
      email: "",
      phone: "",
      locales: ["tr", "en"],
      defaultLocale: "tr",
      currencies: ["TRY"],
      defaultCurrency: "TRY",
    },
  });

  const { register, setValue, watch, formState: { errors } } = form;
  const slugValue = watch("slug");
  const nameValue = watch("name");

  // Auto-generate slug from name
  useEffect(() => {
    if (!defaultValues?.slug) {
      const slug = nameValue
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 50);
      setValue("slug", slug);
    }
  }, [nameValue, setValue, defaultValues?.slug]);

  // Debounced slug availability check
  const checkSlugAvailability = useCallback(async (slug: string) => {
    if (slug.length < 3) {
      setSlugAvailable(null);
      return;
    }
    setSlugChecking(true);
    try {
      const result = await checkSlug(slug);
      setSlugAvailable(result.available);
    } catch {
      setSlugAvailable(null);
    } finally {
      setSlugChecking(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (slugValue && slugValue.length >= 3) {
        checkSlugAvailability(slugValue);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [slugValue, checkSlugAvailability]);

  const handleLocaleToggle = (code: string) => {
    const current = form.getValues("locales");
    if (current.includes(code)) {
      if (current.length > 1) {
        const updated = current.filter((l) => l !== code);
        setValue("locales", updated);
        if (form.getValues("defaultLocale") === code) {
          setValue("defaultLocale", updated[0]);
        }
      }
    } else {
      setValue("locales", [...current, code]);
    }
  };

  const handleCurrencyToggle = (code: string) => {
    const current = form.getValues("currencies");
    if (current.includes(code)) {
      if (current.length > 1) {
        const updated = current.filter((c) => c !== code);
        setValue("currencies", updated);
        if (form.getValues("defaultCurrency") === code) {
          setValue("defaultCurrency", updated[0]);
        }
      }
    } else {
      setValue("currencies", [...current, code]);
    }
  };

  return (
    <form id="store-info-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="mb-2 text-2xl font-bold">{t("storeInfoTitle")}</h2>
      <p className="mb-6 text-muted-foreground">{t("storeInfoDescription")}</p>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">{t("storeName")}</Label>
          <Input id="name" {...register("name")} placeholder={t("storeNamePlaceholder")} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">{t("storeSlug")}</Label>
          <div className="flex items-center gap-2">
            <Input id="slug" {...register("slug")} placeholder="my-store" />
            <span className="text-sm text-muted-foreground">.zunapro.com</span>
          </div>
          {slugChecking && <p className="text-sm text-muted-foreground">{t("checking")}</p>}
          {slugAvailable === true && <p className="text-sm text-green-600">{t("slugAvailable")}</p>}
          {slugAvailable === false && <p className="text-sm text-destructive">{t("slugTaken")}</p>}
          {errors.slug && <p className="text-sm text-destructive">{errors.slug.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>{t("sector")}</Label>
          <Select value={watch("sector")} onValueChange={(v) => setValue("sector", v as StoreInfoData["sector"])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {SECTORS.map((s) => (
                <SelectItem key={s} value={s}>{t(`sectors.${s}`)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">{t("email")}</Label>
          <Input id="email" type="email" {...register("email")} placeholder="info@example.com" />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">{t("phone")}</Label>
          <Input id="phone" {...register("phone")} placeholder="+90 5XX XXX XX XX" />
        </div>
      </div>

      <div className="space-y-2">
        <Label>{t("languages")}</Label>
        <div className="flex flex-wrap gap-2">
          {LOCALES.map((loc) => {
            const selected = watch("locales").includes(loc.code);
            return (
              <Button key={loc.code} type="button" variant={selected ? "default" : "outline"} size="sm" onClick={() => handleLocaleToggle(loc.code)}>
                {loc.name}
              </Button>
            );
          })}
        </div>
        <div className="mt-2">
          <Label>{t("defaultLanguage")}</Label>
          <Select value={watch("defaultLocale")} onValueChange={(v) => setValue("defaultLocale", v)}>
            <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              {watch("locales").map((code) => {
                const loc = LOCALES.find((l) => l.code === code);
                return <SelectItem key={code} value={code}>{loc?.name ?? code}</SelectItem>;
              })}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>{t("currencies")}</Label>
        <div className="flex flex-wrap gap-2">
          {CURRENCIES.map((cur) => {
            const selected = watch("currencies").includes(cur.code);
            return (
              <Button key={cur.code} type="button" variant={selected ? "default" : "outline"} size="sm" onClick={() => handleCurrencyToggle(cur.code)}>
                {cur.name}
              </Button>
            );
          })}
        </div>
        <div className="mt-2">
          <Label>{t("defaultCurrency")}</Label>
          <Select value={watch("defaultCurrency")} onValueChange={(v) => setValue("defaultCurrency", v)}>
            <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              {watch("currencies").map((code) => {
                const cur = CURRENCIES.find((c) => c.code === code);
                return <SelectItem key={code} value={code}>{cur?.name ?? code}</SelectItem>;
              })}
            </SelectContent>
          </Select>
        </div>
      </div>
    </form>
  );
}
