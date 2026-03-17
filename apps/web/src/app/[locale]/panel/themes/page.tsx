'use client';

import { useEffect, useState, useCallback } from 'react';
import { getUserFromToken } from '@/lib/auth';
import { ThemeCard } from './_components/theme-card';
import { ThemePreviewModal } from './_components/theme-preview-modal';

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

type FilterTab = 'all' | 'sector' | 'universal';

export default function ThemesPage() {
  const [themes, setThemes] = useState<ThemeManifest[]>([]);
  const [activeThemeId, setActiveThemeId] = useState<string | null>(null);
  const [previewTheme, setPreviewTheme] = useState<ThemeManifest | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterTab>('all');
  const [tenantSlug, setTenantSlug] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const user = getUserFromToken();

      // Resolve tenant slug from JWT
      let slug = '';
      if (user?.tenantId) {
        const tenantRes = await fetch(`${API_URL}/tenants/${user.tenantId}`);
        if (tenantRes.ok) {
          const tenant = await tenantRes.json();
          slug = tenant.slug || '';
          setTenantSlug(slug);
        }
      }

      // Fetch themes list (public, no auth needed)
      const themesRes = await fetch(`${API_URL}/storefront/themes`);
      if (themesRes.ok) {
        const data = await themesRes.json();
        setThemes(data);
      }

      // Fetch current active theme (public storefront endpoint, no auth needed)
      if (slug) {
        const activeRes = await fetch(`${API_URL}/storefront/active-theme`, {
          headers: { 'x-tenant-slug': slug },
        });
        if (activeRes.ok) {
          const data = await activeRes.json();
          setActiveThemeId(data?.themeId ?? null);
        }
      }
    } catch {
      // Themes will be empty, which is handled
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleApplied = useCallback((themeId: string) => {
    setActiveThemeId(themeId);
  }, []);

  const filteredThemes = themes.filter((t) => {
    if (filter === 'sector') return t.category !== 'universal';
    if (filter === 'universal') return t.category === 'universal';
    return true;
  });

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-10">
          <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
          <div className="mt-2 h-4 w-80 animate-pulse rounded bg-gray-100" />
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-[420px] animate-pulse rounded-2xl border border-gray-200 bg-gray-50" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Themes</h1>
        <p className="mt-2 text-base text-gray-500">
          Choose a theme to customize your store&apos;s appearance. Click any theme to preview and apply.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-8 flex items-center gap-1 rounded-lg bg-gray-100 p-1">
        {([
          { key: 'all', label: 'All Themes', count: themes.length },
          { key: 'sector', label: 'Sector', count: themes.filter((t) => t.category !== 'universal').length },
          { key: 'universal', label: 'Universal', count: themes.filter((t) => t.category === 'universal').length },
        ] as const).map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              filter === key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
            <span className={`rounded-full px-2 py-0.5 text-xs ${
              filter === key ? 'bg-gray-100 text-gray-700' : 'bg-gray-200/50 text-gray-400'
            }`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Theme Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
        {filteredThemes.map((theme) => (
          <ThemeCard
            key={theme.id}
            theme={theme}
            isActive={theme.id === activeThemeId}
            onPreview={setPreviewTheme}
          />
        ))}
      </div>

      {filteredThemes.length === 0 && (
        <div className="py-20 text-center text-gray-400">No themes found in this category.</div>
      )}

      {/* Preview Modal */}
      {previewTheme && (
        <ThemePreviewModal
          theme={previewTheme}
          isActive={previewTheme.id === activeThemeId}
          onClose={() => setPreviewTheme(null)}
          onApplied={handleApplied}
          tenantSlug={tenantSlug}
        />
      )}
    </div>
  );
}
