import type { ThemeManifest, ThemeBundle, ThemeSector } from './types.js';

import { genelBundle } from './genel/index.js';

const themes = new Map<string, ThemeManifest>();
const bundles = new Map<string, ThemeBundle>();

export function registerTheme(manifest: ThemeManifest): void {
  themes.set(manifest.id, manifest);
}

export function registerThemeBundle(bundle: ThemeBundle): void {
  bundles.set(bundle.manifest.id, bundle);
  themes.set(bundle.manifest.id, bundle.manifest);
}

export function getThemeById(id: string): ThemeManifest | undefined {
  return themes.get(id);
}

export function getThemeBundleById(id: string): ThemeBundle | undefined {
  return bundles.get(id);
}

export function getAllThemes(): ThemeManifest[] {
  return Array.from(themes.values());
}

export function getAllThemeBundles(): ThemeBundle[] {
  return Array.from(bundles.values());
}

export function getThemeBySector(sector: ThemeSector): ThemeManifest[] {
  return Array.from(themes.values()).filter((t) => t.sector === sector);
}

// Register default theme bundle
registerThemeBundle(genelBundle);
