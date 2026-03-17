import type { ThemeConfig } from '@zunapro/types';

const BASE_THEME: ThemeConfig = {
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
};

const RADIUS_MAP: Record<string, string> = {
  none: '0px', sm: '0.25rem', md: '0.375rem', lg: '0.5rem', xl: '0.75rem',
};

export function themeConfigToCssVars(config: Partial<ThemeConfig>): string {
  const merged = { ...BASE_THEME, ...config };
  const fonts = { ...BASE_THEME.fonts, ...config.fonts };

  return [
    `--color-primary: ${merged.primary}`,
    `--color-secondary: ${merged.secondary}`,
    `--color-accent: ${merged.accent}`,
    `--color-background: ${merged.background}`,
    `--color-foreground: ${merged.foreground ?? '#0f172a'}`,
    `--color-muted: ${merged.muted ?? '#f1f5f9'}`,
    `--color-border: ${merged.border ?? '#e2e8f0'}`,
    `--font-heading: '${fonts?.heading ?? 'Inter'}', sans-serif`,
    `--font-body: '${fonts?.body ?? 'Inter'}', sans-serif`,
    `--radius: ${RADIUS_MAP[merged.borderRadius ?? 'md'] ?? '0.375rem'}`,
  ].join('; ');
}

export function getGoogleFontsUrl(config: Partial<ThemeConfig>): string | null {
  const fonts = config.fonts ?? BASE_THEME.fonts;
  if (!fonts) return null;

  const families = new Set<string>();
  if (fonts.heading) families.add(fonts.heading);
  if (fonts.body) families.add(fonts.body);
  if (families.size === 0) return null;

  const params = Array.from(families)
    .map((f) => `family=${encodeURIComponent(f)}:wght@400;500;600;700`)
    .join('&');

  return `https://fonts.googleapis.com/css2?${params}&display=swap`;
}

export function mergeThemeConfig(config: Partial<ThemeConfig> | null): ThemeConfig {
  return { ...BASE_THEME, ...config } as ThemeConfig;
}
