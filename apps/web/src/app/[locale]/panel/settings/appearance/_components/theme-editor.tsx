'use client';

import { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { panelApi } from '@/lib/panel-api';

interface ThemeConfig {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  border: string;
  fonts: { heading: string; body: string };
  borderRadius: string;
  layout: { headerStyle: string; productGridColumns: number; footerColumns: number };
  logoUrl: string;
  faviconUrl: string;
  customCss: string;
}

const DEFAULT_CONFIG: ThemeConfig = {
  primary: '#2563eb',
  secondary: '#64748b',
  accent: '#f59e0b',
  background: '#ffffff',
  foreground: '#0f172a',
  muted: '#f1f5f9',
  border: '#e2e8f0',
  fonts: { heading: 'Inter', body: 'Inter' },
  borderRadius: 'md',
  layout: { headerStyle: 'standard', productGridColumns: 4, footerColumns: 4 },
  logoUrl: '',
  faviconUrl: '',
  customCss: '',
};

const FONT_OPTIONS = [
  'Inter', 'Playfair Display', 'Space Grotesk', 'Lato', 'Roboto',
  'Open Sans', 'Montserrat', 'Poppins', 'Raleway', 'Merriweather',
];

interface ThemeEditorProps {
  onConfigChange: (config: Record<string, unknown>) => void;
}

export function ThemeEditor({ onConfigChange }: ThemeEditorProps) {
  const t = useTranslations('panel.settings.appearance');
  const [config, setConfig] = useState<ThemeConfig>(DEFAULT_CONFIG);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Load existing config
  useEffect(() => {
    panelApi.get<{ value: Partial<ThemeConfig> } | null>('/settings/theme')
      .then((result) => {
        if (result?.value) {
          setConfig({ ...DEFAULT_CONFIG, ...result.value });
        }
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const updateField = useCallback(
    <K extends keyof ThemeConfig>(key: K, value: ThemeConfig[K]) => {
      setConfig((prev) => {
        const next = { ...prev, [key]: value };
        onConfigChange(next as unknown as Record<string, unknown>);
        return next;
      });
    },
    [onConfigChange],
  );

  const handleSave = async () => {
    setSaving(true);
    try {
      await panelApi.patch('/settings/theme/config', config);
    } catch {
      // Error silently handled
    } finally {
      setSaving(false);
    }
  };

  if (!loaded) {
    return <div className="animate-pulse space-y-4"><div className="h-8 bg-slate-200 rounded" /><div className="h-8 bg-slate-200 rounded" /></div>;
  }

  return (
    <div className="space-y-8">
      {/* Colors */}
      <section>
        <h3 className="text-lg font-semibold">{t('colors')}</h3>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {(['primary', 'secondary', 'accent', 'background', 'foreground', 'muted', 'border'] as const).map((colorKey) => (
            <div key={colorKey}>
              <label className="mb-1 block text-sm font-medium capitalize text-slate-700">{colorKey}</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={config[colorKey]}
                  onChange={(e) => updateField(colorKey, e.target.value)}
                  className="h-9 w-12 cursor-pointer rounded border"
                />
                <input
                  type="text"
                  value={config[colorKey]}
                  onChange={(e) => updateField(colorKey, e.target.value)}
                  className="flex-1 rounded-md border px-2 py-1.5 text-sm"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Fonts */}
      <section>
        <h3 className="text-lg font-semibold">{t('fonts')}</h3>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">{t('headingFont')}</label>
            <select
              value={config.fonts.heading}
              onChange={(e) => updateField('fonts', { ...config.fonts, heading: e.target.value })}
              className="w-full rounded-md border px-3 py-2 text-sm"
            >
              {FONT_OPTIONS.map((font) => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">{t('bodyFont')}</label>
            <select
              value={config.fonts.body}
              onChange={(e) => updateField('fonts', { ...config.fonts, body: e.target.value })}
              className="w-full rounded-md border px-3 py-2 text-sm"
            >
              {FONT_OPTIONS.map((font) => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Layout */}
      <section>
        <h3 className="text-lg font-semibold">{t('layout')}</h3>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">{t('headerStyle')}</label>
            <select
              value={config.layout.headerStyle}
              onChange={(e) => updateField('layout', { ...config.layout, headerStyle: e.target.value })}
              className="w-full rounded-md border px-3 py-2 text-sm"
            >
              <option value="standard">Standard</option>
              <option value="centered">Centered</option>
              <option value="minimal">Minimal</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">{t('borderRadius')}</label>
            <select
              value={config.borderRadius}
              onChange={(e) => updateField('borderRadius', e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm"
            >
              <option value="none">None</option>
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
              <option value="xl">Extra Large</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">{t('gridColumns')}</label>
            <select
              value={config.layout.productGridColumns}
              onChange={(e) => updateField('layout', { ...config.layout, productGridColumns: Number(e.target.value) })}
              className="w-full rounded-md border px-3 py-2 text-sm"
            >
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
            </select>
          </div>
        </div>
      </section>

      {/* Save */}
      <div className="flex justify-end border-t pt-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
        >
          {saving ? t('saving') : t('save')}
        </button>
      </div>
    </div>
  );
}
