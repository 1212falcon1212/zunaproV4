import type { ThemeConfig } from '@zunapro/types';

export type ThemeSector = 'genel' | 'mobilya' | 'teknoloji' | 'giyim' | 'gida' | 'kozmetik' | 'ev-yasam';

export interface ThemeManifest {
  id: string;
  name: string;
  description: string;
  sector: ThemeSector;
  thumbnail?: string;
  config: ThemeConfig;
  sections: ThemeSectionConfig[];
}

export interface ThemeSectionConfig {
  id: string;
  name: string;
  type: 'hero' | 'featured-products' | 'categories-grid' | 'banner' | 'custom';
  component?: string;
  defaultProps?: Record<string, unknown>;
}

export type { ThemeConfig };
