import type { SectorSeedData, SeedPage, SeedSetting, SeedCustomer, SeedOrder, SeedMenu } from './types';
import type { PageContent } from '@zunapro/types';
import { genelSeedData } from './genel';
import { commonPages, additionalCommonPages, commonSettings, commonCustomers, commonOrders, defaultHeader, defaultFooter, commonMenus } from './common';

export type { SectorSeedData, SeedProduct, SeedCategory, SeedPage, SeedSetting, SeedSettingValue, SeedCustomer, SeedOrder, SeedMenu, SeedBlogPost } from './types';

export function getSeedData(_sector?: string): SectorSeedData {
  return genelSeedData;
}

export function getCommonSeedData(): {
  pages: SeedPage[];
  settings: SeedSetting[];
  customers: SeedCustomer[];
  orders: SeedOrder[];
  menus: SeedMenu[];
  header: PageContent;
  footer: PageContent;
} {
  return {
    pages: [...commonPages, ...additionalCommonPages],
    settings: commonSettings,
    customers: commonCustomers,
    orders: commonOrders,
    menus: commonMenus,
    header: defaultHeader,
    footer: defaultFooter,
  };
}
