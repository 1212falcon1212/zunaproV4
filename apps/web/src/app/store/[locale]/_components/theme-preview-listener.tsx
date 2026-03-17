'use client';

import { useEffect } from 'react';

function loadGoogleFonts(fonts: { heading?: string; body?: string }) {
  const families = new Set<string>();
  if (fonts.heading) families.add(fonts.heading);
  if (fonts.body) families.add(fonts.body);
  if (families.size === 0) return;

  // Remove any previously injected preview font link
  const existing = document.getElementById('theme-preview-fonts');
  if (existing) existing.remove();

  const params = Array.from(families)
    .map((f) => `family=${encodeURIComponent(f)}:wght@400;500;600;700`)
    .join('&');

  const link = document.createElement('link');
  link.id = 'theme-preview-fonts';
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?${params}&display=swap`;
  document.head.appendChild(link);
}

export function ThemePreviewListener() {
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'theme-preview-update') {
        const config = event.data.config;
        if (!config || typeof config !== 'object') return;

        const root = document.documentElement;

        const colorMap: Record<string, string> = {
          primary: '--color-primary',
          secondary: '--color-secondary',
          accent: '--color-accent',
          background: '--color-background',
          foreground: '--color-foreground',
          muted: '--color-muted',
          border: '--color-border',
        };

        for (const [key, cssVar] of Object.entries(colorMap)) {
          if (config[key]) {
            root.style.setProperty(cssVar, config[key]);
          }
        }

        if (config.fonts) {
          loadGoogleFonts(config.fonts);
          if (config.fonts.heading) {
            root.style.setProperty('--font-heading', `'${config.fonts.heading}', sans-serif`);
          }
          if (config.fonts.body) {
            root.style.setProperty('--font-body', `'${config.fonts.body}', sans-serif`);
          }
        }

        const radiusMap: Record<string, string> = {
          none: '0px', sm: '0.25rem', md: '0.375rem', lg: '0.5rem', xl: '0.75rem',
        };
        if (config.borderRadius && radiusMap[config.borderRadius]) {
          root.style.setProperty('--radius', radiusMap[config.borderRadius]);
        }

        return;
      }

      if (event.data?.type === 'theme-preview-load-fonts') {
        const fonts = event.data.fonts;
        if (fonts && typeof fonts === 'object') {
          loadGoogleFonts(fonts);
        }
      }
    };

    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  return null;
}
