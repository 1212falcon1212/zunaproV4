import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'tr', 'de', 'fr', 'es'],
  defaultLocale: 'en',
});
