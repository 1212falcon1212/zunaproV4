import { z } from "zod";

// --- Zod Schemas ---

export const storeInfoSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(3).max(50).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Lowercase letters, numbers, and hyphens only"),
  sector: z.enum(["genel", "mobilya", "teknoloji", "giyim", "gida", "kozmetik"]),
  email: z.string().email(),
  phone: z.string().optional(),
  locales: z.array(z.string()).min(1),
  defaultLocale: z.string(),
  currencies: z.array(z.string()).min(1),
  defaultCurrency: z.string(),
});

export const domainSchema = z.object({
  domainType: z.enum(["subdomain", "custom"]),
  customDomain: z.string().optional(),
});

export const brandingSchema = z.object({
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  secondaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  logoFile: z.instanceof(File).nullable(),
});

// --- State Types ---

export type WizardStep = 0 | 1 | 2 | 3 | 4 | 5;

export interface PlanData {
  id: string;
  name: string;
  slug: string;
  price: number;
  currency: string;
  features: Record<string, unknown>;
  moduleSlugs: string[];
}

export interface WizardState {
  step: WizardStep;
  planId: string;
  plan: PlanData | null;
  storeInfo: z.infer<typeof storeInfoSchema> | null;
  domain: z.infer<typeof domainSchema>;
  branding: z.infer<typeof brandingSchema>;
  tenantId: string | null;
  isSubmitting: boolean;
  error: string | null;
}

export const initialState: WizardState = {
  step: 0,
  planId: "",
  plan: null,
  storeInfo: null,
  domain: { domainType: "subdomain", customDomain: "" },
  branding: {
    primaryColor: "#2563eb",
    secondaryColor: "#475569",
    accentColor: "#f59e0b",
    logoFile: null,
  },
  tenantId: null,
  isSubmitting: false,
  error: null,
};

// --- Actions ---

export type WizardAction =
  | { type: "SET_STEP"; step: WizardStep }
  | { type: "SET_PLAN"; planId: string; plan: PlanData }
  | { type: "SET_STORE_INFO"; data: z.infer<typeof storeInfoSchema> }
  | { type: "SET_DOMAIN"; data: z.infer<typeof domainSchema> }
  | { type: "SET_BRANDING"; data: z.infer<typeof brandingSchema> }
  | { type: "SET_TENANT_ID"; tenantId: string }
  | { type: "SET_SUBMITTING"; isSubmitting: boolean }
  | { type: "SET_ERROR"; error: string | null }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" };

export function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, step: action.step, error: null };
    case "SET_PLAN":
      return { ...state, planId: action.planId, plan: action.plan };
    case "SET_STORE_INFO":
      return { ...state, storeInfo: action.data };
    case "SET_DOMAIN":
      return { ...state, domain: action.data };
    case "SET_BRANDING":
      return { ...state, branding: action.data };
    case "SET_TENANT_ID":
      return { ...state, tenantId: action.tenantId };
    case "SET_SUBMITTING":
      return { ...state, isSubmitting: action.isSubmitting };
    case "SET_ERROR":
      return { ...state, error: action.error };
    case "NEXT_STEP":
      return { ...state, step: Math.min(state.step + 1, 5) as WizardStep, error: null };
    case "PREV_STEP":
      return { ...state, step: Math.max(state.step - 1, 0) as WizardStep, error: null };
    default:
      return state;
  }
}
