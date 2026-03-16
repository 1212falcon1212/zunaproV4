import type { SectorSeedData, SeedPage, SeedSetting } from './types';
import type { PageContent } from '@zunapro/types';
import { genelSeedData } from './genel';
import { mobilyaSeedData } from './mobilya';
import { teknolojiSeedData } from './teknoloji';
import { giyimSeedData } from './giyim';
import { kozmetikSeedData } from './kozmetik';
import { gidaSeedData } from './gida';
import { evYasamSeedData } from './ev-yasam';
import { commonPages, commonSettings, defaultHeader, defaultFooter } from './common';

export type { SectorSeedData, SeedProduct, SeedCategory, SeedPage, SeedSetting, SeedSettingValue } from './types';

const SECTOR_MAP: Record<string, SectorSeedData> = {
  genel: genelSeedData,
  mobilya: mobilyaSeedData,
  teknoloji: teknolojiSeedData,
  giyim: giyimSeedData,
  kozmetik: kozmetikSeedData,
  gida: gidaSeedData,
  'ev-yasam': evYasamSeedData,
};

export function getSeedData(sector: string): SectorSeedData {
  return SECTOR_MAP[sector] ?? SECTOR_MAP.genel;
}

export function getCommonSeedData(): {
  pages: SeedPage[];
  settings: SeedSetting[];
  header: PageContent;
  footer: PageContent;
} {
  return {
    pages: commonPages,
    settings: commonSettings,
    header: defaultHeader,
    footer: defaultFooter,
  };
}
