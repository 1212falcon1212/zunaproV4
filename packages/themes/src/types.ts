import type { ThemeConfig, PageContent } from '@zunapro/types';

export type ThemeSector = 'genel' | 'mobilya' | 'teknoloji' | 'giyim' | 'gida' | 'kozmetik' | 'ev-yasam';

export type ThemeCategory = 'sector' | 'universal';

export interface ThemeManifest {
  id: string;
  name: string;
  description: string;
  sector: ThemeSector;
  category?: ThemeCategory;
  colorPalette?: string[];
  thumbnail?: string;
  config: ThemeConfig;
  sections: ThemeSectionConfig[];
}

export interface ThemeBundle {
  manifest: ThemeManifest;
  homePage: PageContent;
  header: PageContent;
  footer: PageContent;
}

export interface ThemeSectionConfig {
  id: string;
  name: string;
  type: 'hero' | 'featured-products' | 'categories-grid' | 'banner' | 'custom';
  component?: string;
  defaultProps?: Record<string, unknown>;
}

export type { ThemeConfig };
