'use client';

import { useReducer, useCallback, useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { cn } from '@zunapro/ui';
import { getAccessToken, setTokens } from '@/lib/auth';
import {
  Store,
  CreditCard,
  Palette,
  Rocket,
  Check,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Sparkles,
} from 'lucide-react';

/* ── Types ─────────────────────────────────────────────────── */

interface PlanData {
  id: string;
  name: string;
  slug: string;
  price: number;
  currency: string;
  features: Record<string, unknown>;
  moduleSlugs: string[];
}

type Step = 0 | 1 | 2 | 3;

interface OnboardingState {
  step: Step;
  storeName: string;
  storeSlug: string;
  sector: string;
  email: string;
  phone: string;
  locales: string[];
  defaultLocale: string;
  currencies: string[];
  defaultCurrency: string;
  planId: string;
  plan: PlanData | null;
  customDomain: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  slugStatus: 'idle' | 'checking' | 'available' | 'taken';
  isSubmitting: boolean;
  error: string | null;
  tenantId: string | null;
  provisioningDone: boolean;
}

type Action =
  | { type: 'SET_FIELD'; field: string; value: unknown }
  | { type: 'SET_PLAN'; planId: string; plan: PlanData }
  | { type: 'SET_SUBMITTING'; value: boolean }
  | { type: 'SET_ERROR'; error: string | null }
  | { type: 'SET_TENANT_ID'; tenantId: string }
  | { type: 'SET_PROVISIONING_DONE' }
  | { type: 'NEXT' }
  | { type: 'PREV' };

const initialState: OnboardingState = {
  step: 0,
  storeName: '',
  storeSlug: '',
  sector: 'genel',
  email: '',
  phone: '',
  locales: ['en'],
  defaultLocale: 'en',
  currencies: ['EUR'],
  defaultCurrency: 'EUR',
  planId: '',
  plan: null,
  customDomain: '',
  primaryColor: '#6366f1',
  secondaryColor: '#475569',
  accentColor: '#f59e0b',
  slugStatus: 'idle',
  isSubmitting: false,
  error: null,
  tenantId: null,
  provisioningDone: false,
};

function reducer(state: OnboardingState, action: Action): OnboardingState {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SET_PLAN':
      return { ...state, planId: action.planId, plan: action.plan };
    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.value };
    case 'SET_ERROR':
      return { ...state, error: action.error };
    case 'SET_TENANT_ID':
      return { ...state, tenantId: action.tenantId };
    case 'SET_PROVISIONING_DONE':
      return { ...state, provisioningDone: true };
    case 'NEXT':
      return { ...state, step: Math.min(state.step + 1, 3) as Step, error: null };
    case 'PREV':
      return { ...state, step: Math.max(state.step - 1, 0) as Step, error: null };
    default:
      return state;
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const STEPS = [
  { icon: Store, labelKey: 'onboarding.steps.storeInfo' },
  { icon: CreditCard, labelKey: 'onboarding.steps.plan' },
  { icon: Palette, labelKey: 'onboarding.steps.branding' },
  { icon: Rocket, labelKey: 'onboarding.steps.launch' },
];

const SECTORS = ['genel', 'mobilya', 'teknoloji', 'giyim', 'gida', 'kozmetik'];
const LOCALES = ['en', 'tr', 'de', 'fr', 'es'];
const CURRENCIES = ['EUR', 'USD', 'TRY', 'GBP'];

/* ── Step Components ──────────────────────────────────────── */

function StepStoreInfo({
  state,
  dispatch,
  t,
}: {
  state: OnboardingState;
  dispatch: React.Dispatch<Action>;
  t: ReturnType<typeof useTranslations>;
}) {
  const set = (field: string, value: unknown) => dispatch({ type: 'SET_FIELD', field, value });
  const slugTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const checkSlug = useCallback((slug: string) => {
    if (slugTimerRef.current) clearTimeout(slugTimerRef.current);
    if (!slug || slug.length < 2) {
      set('slugStatus', 'idle');
      return;
    }
    set('slugStatus', 'checking');
    slugTimerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`${API_URL}/tenants/check-slug/${slug}`);
        const data = await res.json();
        set('slugStatus', data.available ? 'available' : 'taken');
      } catch {
        set('slugStatus', 'idle');
      }
    }, 500);
  }, []);

  const handleNameChange = (name: string) => {
    set('storeName', name);
    const slug = name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
    set('storeSlug', slug);
    checkSlug(slug);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900">{t('onboarding.storeInfoTitle')}</h2>
        <p className="mt-1 text-sm text-slate-500">{t('onboarding.storeInfoDesc')}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">{t('onboarding.storeName')}</label>
          <input
            type="text"
            value={state.storeName}
            onChange={(e) => handleNameChange(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-500/20"
            placeholder="My Store"
          />
          {state.slugStatus === 'checking' && (
            <p className="flex items-center gap-1.5 text-xs text-slate-400">
              <Loader2 className="h-3 w-3 animate-spin" />
              {t('onboarding.slugChecking')}
            </p>
          )}
          {state.slugStatus === 'available' && (
            <p className="flex items-center gap-1.5 text-xs text-emerald-600">
              <Check className="h-3 w-3" />
              {t('onboarding.slugAvailable')}
            </p>
          )}
          {state.slugStatus === 'taken' && (
            <p className="text-xs text-rose-600">
              {t('onboarding.slugTaken')}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">{t('onboarding.domainLabel')}</label>
          <input
            type="text"
            value={state.customDomain}
            onChange={(e) => set('customDomain', e.target.value.toLowerCase().replace(/[^a-z0-9.-]/g, ''))}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-500/20"
            placeholder="www.yourstore.com"
          />
          <p className="text-xs text-slate-400">{t('onboarding.domainHint')}</p>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">{t('onboarding.sector')}</label>
          <select
            value={state.sector}
            onChange={(e) => set('sector', e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-violet-500 focus:bg-white"
          >
            {SECTORS.map((s) => (
              <option key={s} value={s}>{t(`onboarding.sectors.${s}`)}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">{t('onboarding.email')}</label>
          <input
            type="email"
            value={state.email}
            onChange={(e) => set('email', e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-500/20"
            placeholder="store@example.com"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">{t('onboarding.defaultLanguage')}</label>
          <select
            value={state.defaultLocale}
            onChange={(e) => {
              set('defaultLocale', e.target.value);
              if (!state.locales.includes(e.target.value)) {
                set('locales', [...state.locales, e.target.value]);
              }
            }}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-violet-500 focus:bg-white"
          >
            {LOCALES.map((l) => (
              <option key={l} value={l}>{l.toUpperCase()}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">{t('onboarding.defaultCurrency')}</label>
          <select
            value={state.defaultCurrency}
            onChange={(e) => {
              set('defaultCurrency', e.target.value);
              if (!state.currencies.includes(e.target.value)) {
                set('currencies', [...state.currencies, e.target.value]);
              }
            }}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-violet-500 focus:bg-white"
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

const MODULE_LABELS: Record<string, string> = {
  products: 'Ürün Yönetimi',
  orders: 'Sipariş Yönetimi',
  customers: 'Müşteri Yönetimi',
  'seo-basic': 'Temel SEO',
  'seo-advanced': 'Gelişmiş SEO',
  settings: 'Mağaza Ayarları',
  shipping: 'Kargo Yönetimi',
  payments: 'Ödeme Sistemleri',
  'variants-stock': 'Varyant & Stok',
  coupons: 'Kupon & İndirim',
  'bulk-import': 'Toplu İçe Aktarma',
  'email-marketing': 'E-posta Pazarlama',
  reports: 'Raporlar',
  einvoice: 'E-Fatura',
  'income-expense': 'Gelir-Gider',
  accounting: 'Muhasebe',
  'marketplace-trendyol': 'Trendyol',
  'marketplace-hepsiburada': 'Hepsiburada',
  'marketplace-n11': 'N11',
  'marketplace-amazon': 'Amazon',
  'api-access': 'API Erişimi',
};

const VISIBLE_FEATURES = 5;

function StepPlan({
  state,
  dispatch,
  t,
}: {
  state: OnboardingState;
  dispatch: React.Dispatch<Action>;
  t: ReturnType<typeof useTranslations>;
}) {
  const [plans, setPlans] = useState<PlanData[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/plans`)
      .then((r) => r.json())
      .then(setPlans)
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900">{t('onboarding.planTitle')}</h2>
        <p className="mt-1 text-sm text-slate-500">{t('onboarding.planDesc')}</p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        {plans.map((plan) => {
          const isSelected = state.planId === plan.id;
          const slugs = plan.moduleSlugs || [];
          const visible = slugs.slice(0, VISIBLE_FEATURES);
          const remaining = slugs.length - VISIBLE_FEATURES;
          return (
            <button
              key={plan.id}
              onClick={() => dispatch({ type: 'SET_PLAN', planId: plan.id, plan })}
              className={cn(
                'flex flex-col rounded-2xl border-2 p-5 text-left transition-all',
                isSelected
                  ? 'border-violet-500 bg-violet-50/50 shadow-md shadow-violet-500/10'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-sm',
              )}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                {isSelected && (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500">
                    <Check className="h-3.5 w-3.5 text-white" />
                  </div>
                )}
              </div>
              <p className="mt-1 text-2xl font-bold text-violet-600">
                {plan.currency === 'TRY' ? '₺' : '€'}{plan.price}
                <span className="text-sm font-normal text-slate-400">/mo</span>
              </p>
              <div className="mt-3 space-y-1.5">
                {visible.map((mod) => (
                  <div key={mod} className="flex items-center gap-2 text-sm text-slate-600">
                    <Check className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                    <span>{MODULE_LABELS[mod] || mod}</span>
                  </div>
                ))}
                {remaining > 0 && (
                  <p className="text-xs font-medium text-violet-500 pl-5.5">
                    +{remaining} {t('onboarding.moreFeatures')}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepBranding({
  state,
  dispatch,
  t,
}: {
  state: OnboardingState;
  dispatch: React.Dispatch<Action>;
  t: ReturnType<typeof useTranslations>;
}) {
  const set = (field: string, value: unknown) => dispatch({ type: 'SET_FIELD', field, value });

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900">{t('onboarding.brandingTitle')}</h2>
        <p className="mt-1 text-sm text-slate-500">{t('onboarding.brandingDesc')}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { key: 'primaryColor', label: t('onboarding.primaryColor') },
          { key: 'secondaryColor', label: t('onboarding.secondaryColor') },
          { key: 'accentColor', label: t('onboarding.accentColor') },
        ].map((color) => (
          <div key={color.key} className="space-y-2">
            <label className="text-sm font-medium text-slate-700">{color.label}</label>
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <input
                type="color"
                value={state[color.key as keyof OnboardingState] as string}
                onChange={(e) => set(color.key, e.target.value)}
                className="h-8 w-8 cursor-pointer rounded-lg border-0"
              />
              <span className="text-sm text-slate-600 uppercase">
                {state[color.key as keyof OnboardingState] as string}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Preview */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <p className="mb-3 text-sm font-medium text-slate-500">{t('onboarding.preview')}</p>
        <div className="flex flex-wrap items-center gap-3">
          <button
            className="rounded-xl px-6 py-2.5 text-sm font-semibold text-white"
            style={{ backgroundColor: state.primaryColor }}
          >
            {t('onboarding.shopNow')}
          </button>
          <button
            className="rounded-xl border-2 px-6 py-2.5 text-sm font-semibold"
            style={{ borderColor: state.secondaryColor, color: state.secondaryColor }}
          >
            {t('onboarding.learnMore')}
          </button>
          <span
            className="rounded-full px-3 py-1 text-xs font-bold text-white"
            style={{ backgroundColor: state.accentColor }}
          >
            SALE
          </span>
        </div>
      </div>
    </div>
  );
}

function StepLaunch({
  state,
  t,
}: {
  state: OnboardingState;
  t: ReturnType<typeof useTranslations>;
}) {
  if (state.provisioningDone) {
    const previewUrl = `/_store/${state.storeSlug}/en`;
    return (
      <div className="flex flex-col items-center py-8 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
          <Check className="h-10 w-10 text-emerald-600" />
        </div>
        <h2 className="mt-6 text-2xl font-bold text-slate-900">{t('onboarding.storeReady')}</h2>
        <p className="mt-2 max-w-md text-sm text-slate-500">{t('onboarding.storeReadyDesc')}</p>
        <a
          href={previewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-violet-500/20 transition-all hover:shadow-lg"
        >
          <Store className="h-4 w-4" />
          {t('onboarding.viewStorePreview')}
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-8 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-violet-100">
        <Rocket className="h-10 w-10 text-violet-600" />
      </div>
      <h2 className="mt-6 text-2xl font-bold text-slate-900">{t('onboarding.launchTitle')}</h2>
      <p className="mt-2 max-w-md text-sm text-slate-500">{t('onboarding.launchDesc')}</p>

      <div className="mt-8 w-full max-w-sm space-y-3 text-left">
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
          <Check className="h-4 w-4 text-emerald-500" />
          <span className="text-sm text-slate-700">{state.storeName || 'Your Store'}</span>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
          <Check className="h-4 w-4 text-emerald-500" />
          <span className="text-sm text-slate-700">{state.plan?.name || 'Plan'}</span>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
          <Check className="h-4 w-4 text-emerald-500" />
          <span className="text-sm text-slate-700">
            {state.customDomain || 'No domain'}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ───────────────────────────────────────── */

export function PanelOnboarding() {
  const t = useTranslations('panel');
  const router = useRouter();
  const pathname = usePathname();
  const [state, dispatch] = useReducer(reducer, initialState);

  const canProceed = useCallback((): boolean => {
    switch (state.step) {
      case 0:
        return !!(state.storeName && state.storeSlug && state.customDomain && state.email && state.slugStatus !== 'taken' && state.slugStatus !== 'checking');
      case 1:
        return !!state.planId;
      case 2:
        return true;
      case 3:
        return true;
      default:
        return false;
    }
  }, [state]);

  const handleNext = useCallback(async () => {
    if (state.step < 3) {
      dispatch({ type: 'NEXT' });
      return;
    }

    // Step 3: Launch — create tenant and trigger provisioning
    dispatch({ type: 'SET_SUBMITTING', value: true });
    dispatch({ type: 'SET_ERROR', error: null });

    try {
      const token = getAccessToken();
      const res = await fetch(`${API_URL}/tenants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name: state.storeName,
          slug: state.storeSlug,
          planId: state.planId,
          sector: state.sector,
          email: state.email,
          phone: state.phone || undefined,
          domain: state.customDomain,
          locales: state.locales,
          defaultLocale: state.defaultLocale,
          currencies: state.currencies,
          defaultCurrency: state.defaultCurrency,
          branding: {
            primaryColor: state.primaryColor,
            secondaryColor: state.secondaryColor,
            accentColor: state.accentColor,
          },
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Failed to create store' }));
        throw new Error(err.message);
      }

      const tenant = await res.json();
      dispatch({ type: 'SET_TENANT_ID', tenantId: tenant.id });
      dispatch({ type: 'SET_PROVISIONING_DONE' });

      // Save new tokens with the new tenant context
      if (tenant.accessToken && tenant.refreshToken) {
        setTokens(tenant.accessToken, tenant.refreshToken);
      }

      // Reload to show dashboard with new tenant
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      dispatch({ type: 'SET_ERROR', error: err instanceof Error ? err.message : 'An error occurred' });
    } finally {
      dispatch({ type: 'SET_SUBMITTING', value: false });
    }
  }, [state]);

  return (
    <div className="mx-auto max-w-3xl">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500">
          <Sparkles className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">{t('onboarding.title')}</h1>
        <p className="mt-1 text-sm text-slate-500">{t('onboarding.subtitle')}</p>
      </div>

      {/* Step indicators */}
      <div className="mb-8 flex items-center justify-center gap-1">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const isActive = i === state.step;
          const isDone = i < state.step;
          return (
            <div key={i} className="flex items-center">
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-xl transition-all',
                  isDone
                    ? 'bg-emerald-100 text-emerald-600'
                    : isActive
                      ? 'bg-violet-100 text-violet-600 shadow-md shadow-violet-500/10'
                      : 'bg-slate-100 text-slate-400',
                )}
              >
                {isDone ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
              </div>
              {i < STEPS.length - 1 && (
                <div className={cn('mx-1 h-0.5 w-6 rounded-full', isDone ? 'bg-emerald-300' : 'bg-slate-200')} />
              )}
            </div>
          );
        })}
      </div>

      {/* Step content */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {state.step === 0 && <StepStoreInfo state={state} dispatch={dispatch} t={t} />}
        {state.step === 1 && <StepPlan state={state} dispatch={dispatch} t={t} />}
        {state.step === 2 && <StepBranding state={state} dispatch={dispatch} t={t} />}
        {state.step === 3 && <StepLaunch state={state} t={t} />}

        {state.error && (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {state.error}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
          <button
            onClick={() => dispatch({ type: 'PREV' })}
            disabled={state.step === 0}
            className={cn(
              'flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition',
              state.step === 0
                ? 'invisible'
                : 'text-slate-600 hover:bg-slate-100',
            )}
          >
            <ArrowLeft className="h-4 w-4" />
            {t('onboarding.back')}
          </button>

          {!state.provisioningDone && (
            <button
              onClick={handleNext}
              disabled={!canProceed() || state.isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-500/20 transition-all hover:shadow-lg disabled:opacity-50"
            >
              {state.isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : state.step === 3 ? (
                <>
                  <Rocket className="h-4 w-4" />
                  {t('onboarding.launch')}
                </>
              ) : (
                <>
                  {t('onboarding.next')}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
