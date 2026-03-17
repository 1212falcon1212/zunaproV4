import type { ThemeManifest, ThemeBundle, ThemeSector } from './types.js';

import { genelBundle } from './genel/index.js';
import { mobilyaBundle } from './mobilya/index.js';
import { teknolojiBundle } from './teknoloji/index.js';
import { giyimBundle } from './giyim/index.js';
import { kozmetikBundle } from './kozmetik/index.js';
import { gidaBundle } from './gida/index.js';
import { minimalBundle } from './minimal/index.js';
import { boldBundle } from './bold/index.js';
import { elegantBundle } from './elegant/index.js';

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

// Eagerly register all built-in theme bundles
const builtInBundles: ThemeBundle[] = [
  genelBundle,
  mobilyaBundle,
  teknolojiBundle,
  giyimBundle,
  kozmetikBundle,
  gidaBundle,
  minimalBundle,
  boldBundle,
  elegantBundle,
];

for (const bundle of builtInBundles) {
  registerThemeBundle(bundle);
}
