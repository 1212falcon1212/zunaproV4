'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Button,
  Card,
  Input,
  Label,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@zunapro/ui';
import { panelApi } from '@/lib/panel-api';
import { ChevronRight, Save, Loader2, Globe, Building2, Phone, Mail, MapPin, Clock } from 'lucide-react';

const AVAILABLE_LOCALES = [
  { code: 'tr', label: 'Türkçe' },
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
];

const AVAILABLE_CURRENCIES = [
  { code: 'TRY', label: '₺ Türk Lirası' },
  { code: 'USD', label: '$ US Dollar' },
  { code: 'EUR', label: '€ Euro' },
  { code: 'GBP', label: '£ British Pound' },
];

const TIMEZONES = [
  'Europe/Istanbul',
  'Europe/Berlin',
  'Europe/London',
  'Europe/Paris',
  'America/New_York',
  'America/Los_Angeles',
  'Asia/Dubai',
];

interface SiteConfig {
  name: string;
  slug: string;
  domain: string;
  locales: string[];
  defaultLocale: string;
  currencies: string[];
  defaultCurrency: string;
  timezone: string;
}

interface StoreInfo {
  store_name: Record<string, string>;
  store_phone: string;
  store_email: string;
  store_address: string;
  whatsapp: string;
  social_links: {
    facebook: string;
    instagram: string;
    twitter: string;
    youtube: string;
  };
}

export default function SiteSettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Site config
  const [config, setConfig] = useState<SiteConfig>({
    name: '', slug: '', domain: '',
    locales: ['tr', 'en'], defaultLocale: 'tr',
    currencies: ['TRY'], defaultCurrency: 'TRY',
    timezone: 'Europe/Istanbul',
  });

  // Store info (contact)
  const [storeInfo, setStoreInfo] = useState<StoreInfo>({
    store_name: { tr: '', en: '' },
    store_phone: '', store_email: '', store_address: '', whatsapp: '',
    social_links: { facebook: '', instagram: '', twitter: '', youtube: '' },
  });

  useEffect(() => {
    Promise.all([
      panelApi.get<SiteConfig>('/settings/site-config').catch(() => null),
      panelApi.get<Record<string, unknown>>('/storefront/settings/store-info').catch(() => null),
    ]).then(([siteConfig, info]) => {
      if (siteConfig) setConfig(siteConfig);
      if (info) {
        setStoreInfo({
          store_name: (info.store_name as Record<string, string>) ?? { tr: '', en: '' },
          store_phone: (info.store_phone as string) ?? '',
          store_email: (info.store_email as string) ?? '',
          store_address: (info.store_address as string) ?? '',
          whatsapp: (info.whatsapp as string) ?? '',
          social_links: (info.social_links as StoreInfo['social_links']) ?? { facebook: '', instagram: '', twitter: '', youtube: '' },
        });
      }
    }).finally(() => setLoading(false));
  }, []);

  const handleSaveConfig = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await panelApi.put('/settings/site-config', {
        name: config.name,
        domain: config.domain,
        locales: config.locales,
        defaultLocale: config.defaultLocale,
        currencies: config.currencies,
        defaultCurrency: config.defaultCurrency,
        timezone: config.timezone,
      });
      setSuccess('Site ayarları kaydedildi.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kaydetme başarısız');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveContact = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await panelApi.put('/settings/store_info', {
        value: storeInfo,
        group: 'store',
      });
      setSuccess('İletişim bilgileri kaydedildi.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kaydetme başarısız');
    } finally {
      setSaving(false);
    }
  };

  const toggleLocale = (code: string) => {
    setConfig((prev) => {
      const has = prev.locales.includes(code);
      const locales = has ? prev.locales.filter((l) => l !== code) : [...prev.locales, code];
      if (locales.length === 0) return prev;
      const defaultLocale = locales.includes(prev.defaultLocale) ? prev.defaultLocale : locales[0];
      return { ...prev, locales, defaultLocale };
    });
  };

  const toggleCurrency = (code: string) => {
    setConfig((prev) => {
      const has = prev.currencies.includes(code);
      const currencies = has ? prev.currencies.filter((c) => c !== code) : [...prev.currencies, code];
      if (currencies.length === 0) return prev;
      const defaultCurrency = currencies.includes(prev.defaultCurrency) ? prev.defaultCurrency : currencies[0];
      return { ...prev, currencies, defaultCurrency };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-slate-500">
        <Link href={`/${locale}/panel`} className="transition-colors hover:text-slate-700">Panel</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-slate-800">Site Ayarları</span>
      </nav>

      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Site Ayarları</h1>

      {/* Messages */}
      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
      )}
      {success && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div>
      )}

      <Tabs defaultValue="general">
        <TabsList className="mb-6 h-10 w-full justify-start rounded-lg bg-slate-100 p-1">
          <TabsTrigger value="general" className="rounded-md px-4 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Genel
          </TabsTrigger>
          <TabsTrigger value="languages" className="rounded-md px-4 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Dil & Para Birimi
          </TabsTrigger>
          <TabsTrigger value="contact" className="rounded-md px-4 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm">
            İletişim Bilgileri
          </TabsTrigger>
          <TabsTrigger value="social" className="rounded-md px-4 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Sosyal Medya
          </TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-6">
          <Card className="overflow-hidden border border-slate-200 shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4">
              <h2 className="text-sm font-semibold text-slate-800">Mağaza Bilgileri</h2>
            </div>
            <div className="space-y-4 p-6">
              <div>
                <Label className="text-xs font-medium text-slate-500">Mağaza Adı</Label>
                <Input
                  value={config.name}
                  onChange={(e) => setConfig((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Mağaza adı"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label className="text-xs font-medium text-slate-500">Slug (URL)</Label>
                <Input value={config.slug} disabled className="mt-1.5 bg-slate-50 text-slate-400" />
                <p className="mt-1 text-xs text-slate-400">Slug değiştirilemez</p>
              </div>
              <div>
                <Label className="text-xs font-medium text-slate-500">Özel Domain</Label>
                <Input
                  value={config.domain}
                  onChange={(e) => setConfig((p) => ({ ...p, domain: e.target.value }))}
                  placeholder="www.example.com"
                  className="mt-1.5"
                />
                <p className="mt-1 text-xs text-slate-400">Özel domain bağlamak için DNS ayarlarını yapmanız gerekir</p>
              </div>
              <div>
                <Label className="text-xs font-medium text-slate-500">Saat Dilimi</Label>
                <select
                  value={config.timezone}
                  onChange={(e) => setConfig((p) => ({ ...p, timezone: e.target.value }))}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
                >
                  {TIMEZONES.map((tz) => (
                    <option key={tz} value={tz}>{tz}</option>
                  ))}
                </select>
              </div>
            </div>
          </Card>
          <Button onClick={handleSaveConfig} disabled={saving} className="bg-violet-600 hover:bg-violet-700">
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Kaydet
          </Button>
        </TabsContent>

        {/* Languages Tab */}
        <TabsContent value="languages" className="space-y-6">
          <Card className="overflow-hidden border border-slate-200 shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4">
              <h2 className="text-sm font-semibold text-slate-800">Desteklenen Diller</h2>
            </div>
            <div className="p-6">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {AVAILABLE_LOCALES.map((loc) => {
                  const active = config.locales.includes(loc.code);
                  const isDefault = config.defaultLocale === loc.code;
                  return (
                    <button
                      key={loc.code}
                      type="button"
                      onClick={() => toggleLocale(loc.code)}
                      className={`flex items-center justify-between rounded-lg border p-3 transition-all ${
                        active
                          ? 'border-violet-300 bg-violet-50'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Globe className={`h-4 w-4 ${active ? 'text-violet-600' : 'text-slate-400'}`} />
                        <span className={`text-sm font-medium ${active ? 'text-violet-700' : 'text-slate-600'}`}>
                          {loc.label}
                        </span>
                        <span className="text-xs text-slate-400 uppercase">{loc.code}</span>
                      </div>
                      {isDefault && (
                        <span className="rounded-full bg-violet-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                          Varsayılan
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              {config.locales.length > 1 && (
                <div className="mt-4">
                  <Label className="text-xs font-medium text-slate-500">Varsayılan Dil</Label>
                  <select
                    value={config.defaultLocale}
                    onChange={(e) => setConfig((p) => ({ ...p, defaultLocale: e.target.value }))}
                    className="mt-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
                  >
                    {config.locales.map((l) => (
                      <option key={l} value={l}>{AVAILABLE_LOCALES.find((al) => al.code === l)?.label ?? l}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </Card>

          <Card className="overflow-hidden border border-slate-200 shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4">
              <h2 className="text-sm font-semibold text-slate-800">Para Birimleri</h2>
            </div>
            <div className="p-6">
              <div className="grid gap-3 sm:grid-cols-2">
                {AVAILABLE_CURRENCIES.map((cur) => {
                  const active = config.currencies.includes(cur.code);
                  const isDefault = config.defaultCurrency === cur.code;
                  return (
                    <button
                      key={cur.code}
                      type="button"
                      onClick={() => toggleCurrency(cur.code)}
                      className={`flex items-center justify-between rounded-lg border p-3 transition-all ${
                        active
                          ? 'border-emerald-300 bg-emerald-50'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <span className={`text-sm font-medium ${active ? 'text-emerald-700' : 'text-slate-600'}`}>
                        {cur.label}
                      </span>
                      {isDefault && (
                        <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                          Varsayılan
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              {config.currencies.length > 1 && (
                <div className="mt-4">
                  <Label className="text-xs font-medium text-slate-500">Varsayılan Para Birimi</Label>
                  <select
                    value={config.defaultCurrency}
                    onChange={(e) => setConfig((p) => ({ ...p, defaultCurrency: e.target.value }))}
                    className="mt-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
                  >
                    {config.currencies.map((c) => (
                      <option key={c} value={c}>{AVAILABLE_CURRENCIES.find((ac) => ac.code === c)?.label ?? c}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </Card>
          <Button onClick={handleSaveConfig} disabled={saving} className="bg-violet-600 hover:bg-violet-700">
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Kaydet
          </Button>
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact" className="space-y-6">
          <Card className="overflow-hidden border border-slate-200 shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4">
              <h2 className="text-sm font-semibold text-slate-800">İletişim Bilgileri</h2>
            </div>
            <div className="space-y-4 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-xs font-medium text-slate-500">Mağaza Adı (TR)</Label>
                  <Input
                    value={storeInfo.store_name.tr ?? ''}
                    onChange={(e) => setStoreInfo((p) => ({
                      ...p,
                      store_name: { ...p.store_name, tr: e.target.value },
                    }))}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium text-slate-500">Mağaza Adı (EN)</Label>
                  <Input
                    value={storeInfo.store_name.en ?? ''}
                    onChange={(e) => setStoreInfo((p) => ({
                      ...p,
                      store_name: { ...p.store_name, en: e.target.value },
                    }))}
                    className="mt-1.5"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-xs font-medium text-slate-500">
                    <Phone className="mr-1 inline h-3.5 w-3.5" /> Telefon
                  </Label>
                  <Input
                    value={storeInfo.store_phone}
                    onChange={(e) => setStoreInfo((p) => ({ ...p, store_phone: e.target.value }))}
                    placeholder="+90 212 000 0000"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium text-slate-500">
                    <Mail className="mr-1 inline h-3.5 w-3.5" /> E-posta
                  </Label>
                  <Input
                    value={storeInfo.store_email}
                    onChange={(e) => setStoreInfo((p) => ({ ...p, store_email: e.target.value }))}
                    placeholder="info@example.com"
                    className="mt-1.5"
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs font-medium text-slate-500">WhatsApp</Label>
                <Input
                  value={storeInfo.whatsapp}
                  onChange={(e) => setStoreInfo((p) => ({ ...p, whatsapp: e.target.value }))}
                  placeholder="+905551234567"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label className="text-xs font-medium text-slate-500">
                  <MapPin className="mr-1 inline h-3.5 w-3.5" /> Adres
                </Label>
                <textarea
                  value={storeInfo.store_address}
                  onChange={(e) => setStoreInfo((p) => ({ ...p, store_address: e.target.value }))}
                  rows={3}
                  placeholder="Tam adres"
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
                />
              </div>
            </div>
          </Card>
          <Button onClick={handleSaveContact} disabled={saving} className="bg-violet-600 hover:bg-violet-700">
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Kaydet
          </Button>
        </TabsContent>

        {/* Social Tab */}
        <TabsContent value="social" className="space-y-6">
          <Card className="overflow-hidden border border-slate-200 shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4">
              <h2 className="text-sm font-semibold text-slate-800">Sosyal Medya Hesapları</h2>
            </div>
            <div className="space-y-4 p-6">
              {[
                { key: 'facebook' as const, label: 'Facebook', placeholder: 'https://facebook.com/...' },
                { key: 'instagram' as const, label: 'Instagram', placeholder: 'https://instagram.com/...' },
                { key: 'twitter' as const, label: 'X (Twitter)', placeholder: 'https://x.com/...' },
                { key: 'youtube' as const, label: 'YouTube', placeholder: 'https://youtube.com/...' },
              ].map((social) => (
                <div key={social.key}>
                  <Label className="text-xs font-medium text-slate-500">{social.label}</Label>
                  <Input
                    value={storeInfo.social_links[social.key] ?? ''}
                    onChange={(e) =>
                      setStoreInfo((p) => ({
                        ...p,
                        social_links: { ...p.social_links, [social.key]: e.target.value },
                      }))
                    }
                    placeholder={social.placeholder}
                    className="mt-1.5"
                  />
                </div>
              ))}
            </div>
          </Card>
          <Button onClick={handleSaveContact} disabled={saving} className="bg-violet-600 hover:bg-violet-700">
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Kaydet
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
