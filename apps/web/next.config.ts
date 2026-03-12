import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig = {
  output: 'standalone',
  transpilePackages: ['@zunapro/ui'],
};

export default withNextIntl(nextConfig);
