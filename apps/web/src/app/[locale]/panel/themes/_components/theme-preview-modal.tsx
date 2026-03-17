'use client';

import { useCallback, useEffect, useState } from 'react';
import { getAccessToken } from '@/lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface ThemeManifest {
  id: string;
  name: string;
  description: string;
  sector: string;
  category?: 'sector' | 'universal';
  colorPalette?: string[];
  config: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground?: string;
    muted?: string;
    border?: string;
    fonts?: { heading: string; body: string };
    borderRadius?: string;
    layout?: {
      headerStyle?: string;
      productGridColumns?: number;
      footerColumns?: number;
    };
  };
}

interface ThemePreviewModalProps {
  theme: ThemeManifest;
  isActive: boolean;
  onClose: () => void;
  onApplied: (themeId: string) => void;
  tenantSlug: string;
}

type ModalStatus = 'idle' | 'applying' | 'confirming' | 'success' | 'error';

export function ThemePreviewModal({ theme, isActive, onClose, onApplied, tenantSlug }: ThemePreviewModalProps) {
  const [status, setStatus] = useState<ModalStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [applyLayout, setApplyLayout] = useState(true);
  const [reseed, setReseed] = useState(false);

  const c = theme.config;
  const fonts = c.fonts ?? { heading: 'Inter', body: 'Inter' };
  const palette = theme.colorPalette ?? [c.primary, c.secondary, c.accent, c.background, c.foreground ?? '#0f172a'];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleApply = useCallback(async () => {
    if (status === 'confirming') {
      setStatus('applying');
      setErrorMsg('');
      try {
        const token = getAccessToken();
        if (!token) throw new Error('Not authenticated');
        const headers: Record<string, string> = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        };
        if (tenantSlug) headers['x-tenant-slug'] = tenantSlug;
        const res = await fetch(`${API_URL}/settings/theme/apply`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ themeId: theme.id, applyLayout, reseed }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.message || 'Failed to apply theme');
        }
        setStatus('success');
        onApplied(theme.id);
        setTimeout(() => onClose(), 1500);
      } catch (err: unknown) {
        setErrorMsg(err instanceof Error ? err.message : 'Unknown error');
        setStatus('error');
      }
    } else {
      setStatus('confirming');
    }
  }, [status, theme.id, applyLayout, reseed, onApplied, onClose]);

  // Build the preview URL — standalone page that renders actual store blocks
  const previewUrl = `/theme-preview?themeId=${encodeURIComponent(theme.id)}&locale=en`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative flex h-[90vh] w-[95vw] max-w-7xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Close */}
        <button onClick={onClose} className="absolute right-4 top-4 z-20 rounded-full bg-gray-100 p-2 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Left Panel - Details */}
        <div className="flex w-80 shrink-0 flex-col border-r border-gray-200 bg-gray-50">
          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex items-start gap-2">
              <h2 className="text-xl font-bold text-gray-900">{theme.name}</h2>
              {isActive && (
                <span className="mt-1 shrink-0 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">Active</span>
              )}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">{theme.description}</p>

            <div className="mt-4">
              <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                theme.category === 'universal' ? 'bg-violet-100 text-violet-700' : 'bg-gray-200 text-gray-700'
              }`}>
                {theme.category === 'universal' ? 'Universal' : `Sector: ${theme.sector}`}
              </span>
            </div>

            {/* Colors */}
            <div className="mt-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Color Palette</p>
              <div className="flex flex-wrap gap-2">
                {palette.map((color, i) => (
                  <div key={i} className="group relative">
                    <div className="h-10 w-10 rounded-lg border border-gray-200 shadow-sm" style={{ backgroundColor: color }} />
                    <div className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-0.5 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                      {color}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Typography */}
            <div className="mt-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Typography</p>
              <p className="text-sm text-gray-700"><span className="text-gray-400">Heading:</span> <span className="font-medium">{fonts.heading}</span></p>
              <p className="text-sm text-gray-700"><span className="text-gray-400">Body:</span> <span className="font-medium">{fonts.body}</span></p>
            </div>

            {/* Layout */}
            <div className="mt-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Layout</p>
              <div className="space-y-1 text-sm text-gray-700">
                <p><span className="text-gray-400">Header:</span> {c.layout?.headerStyle ?? 'standard'}</p>
                <p><span className="text-gray-400">Product Grid:</span> {c.layout?.productGridColumns ?? 4} columns</p>
                <p><span className="text-gray-400">Border Radius:</span> {c.borderRadius ?? 'md'}</p>
              </div>
            </div>
          </div>

          {/* Apply Section */}
          <div className="border-t border-gray-200 bg-white p-6">
            <label className="mb-2 flex cursor-pointer items-center gap-3">
              <input type="checkbox" checked={applyLayout} onChange={(e) => setApplyLayout(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm text-gray-700">Apply layout (homepage, header, footer)</span>
            </label>
            <label className="mb-4 flex cursor-pointer items-center gap-3">
              <input type="checkbox" checked={reseed} onChange={(e) => setReseed(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500" />
              <span className="text-sm text-gray-700">Reseed demo data (products, categories, orders, customers)</span>
            </label>

            {status === 'confirming' && (
              <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                <p className="font-medium">Are you sure?</p>
                <p className="mt-1 text-xs text-amber-700">
                  {reseed
                    ? 'All existing products, orders, customers, and pages will be replaced with demo data.'
                    : applyLayout
                      ? 'Your current homepage, header, and footer will be replaced.'
                      : 'Only colors and fonts will be changed.'}
                </p>
              </div>
            )}

            {status === 'error' && errorMsg && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{errorMsg}</div>
            )}

            {status === 'success' && (
              <div className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Theme applied successfully!
              </div>
            )}

            {isActive && status === 'idle' ? (
              <button disabled className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-600">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Currently Active
              </button>
            ) : status === 'success' ? null : (
              <div className="flex gap-2">
                {status === 'confirming' && (
                  <button onClick={() => setStatus('idle')} className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                    Cancel
                  </button>
                )}
                <button onClick={handleApply} disabled={status === 'applying'} className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all disabled:opacity-50 ${status === 'confirming' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-gray-900 hover:bg-gray-800'}`}>
                  {status === 'applying' ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      Applying...
                    </>
                  ) : status === 'confirming' ? 'Confirm Apply' : 'Apply Theme'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Real Store Preview via iframe */}
        <div className="flex-1 overflow-hidden bg-gray-100">
          <div className="flex h-10 items-center border-b border-gray-200 bg-white px-4">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <div className="h-3 w-3 rounded-full bg-green-400" />
            </div>
            <div className="ml-4 flex-1">
              <div className="mx-auto max-w-md rounded-md bg-gray-100 px-3 py-1 text-center text-xs text-gray-400">
                {theme.name.toLowerCase()}-store.zunapro.com
              </div>
            </div>
          </div>
          <iframe
            src={previewUrl}
            className="h-[calc(100%-2.5rem)] w-full border-0"
            title={`${theme.name} Theme Preview`}
          />
        </div>
      </div>
    </div>
  );
}
