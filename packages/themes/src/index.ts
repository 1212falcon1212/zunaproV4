export type { ThemeManifest, ThemeSector, ThemeSectionConfig, ThemeConfig } from './types.js';
export { BASE_THEME_CONFIG, generateCssVariables, getGoogleFontsUrl } from './base/index.js';
export { registerTheme, getThemeById, getAllThemes, getThemeBySector } from './registry.js';

// Seed data exports
export { getSeedData, getCommonSeedData } from './seeds/index.js';
export type {
  SectorSeedData,
  SeedProduct,
  SeedCategory,
  SeedPage,
  SeedSetting,
  SeedSettingValue,
} from './seeds/index.js';
