import type { ThemeConfig } from '@zunapro/types';

export const BASE_THEME_CONFIG: Required<ThemeConfig> = {
  primary: '#2563eb',
  secondary: '#64748b',
  accent: '#f59e0b',
  background: '#ffffff',
  foreground: '#0f172a',
  muted: '#f1f5f9',
  border: '#e2e8f0',
  fonts: { heading: 'Inter', body: 'Inter' },
  borderRadius: 'md',
  layout: {
    headerStyle: 'standard',
    productGridColumns: 4,
    footerColumns: 4,
  },
  logoUrl: '',
  faviconUrl: '',
  customCss: '',
};

const BORDER_RADIUS_MAP: Record<string, string> = {
  none: '0px',
  sm: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
};

export function generateCssVariables(config: Partial<ThemeConfig>): string {
  const merged = { ...BASE_THEME_CONFIG, ...config };
  const fonts = { ...BASE_THEME_CONFIG.fonts, ...config.fonts };

  const vars: Record<string, string> = {
    '--color-primary': merged.primary,
    '--color-secondary': merged.secondary,
    '--color-accent': merged.accent,
    '--color-background': merged.background,
    '--color-foreground': merged.foreground ?? BASE_THEME_CONFIG.foreground,
    '--color-muted': merged.muted ?? BASE_THEME_CONFIG.muted,
    '--color-border': merged.border ?? BASE_THEME_CONFIG.border,
    '--font-heading': `'${fonts.heading}', sans-serif`,
    '--font-body': `'${fonts.body}', sans-serif`,
    '--radius': BORDER_RADIUS_MAP[merged.borderRadius ?? 'md'] ?? '0.375rem',
  };

  return Object.entries(vars)
    .map(([key, value]) => `${key}: ${value};`)
    .join('\n  ');
}

export function getGoogleFontsUrl(config: Partial<ThemeConfig>): string | null {
  const fonts = config.fonts ?? BASE_THEME_CONFIG.fonts;
  const families = new Set<string>();

  if (fonts.heading) families.add(fonts.heading);
  if (fonts.body) families.add(fonts.body);

  if (families.size === 0) return null;

  const params = Array.from(families)
    .map((f) => `family=${encodeURIComponent(f)}:wght@400;500;600;700`)
    .join('&');

  return `https://fonts.googleapis.com/css2?${params}&display=swap`;
}
