import { PrismaClient } from '../node_modules/.prisma/master-client/index.js';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding master database...');

  // Upsert modules — all 4 main modules + sub-modules
  const modules = [
    // E-Ticaret Temel
    { name: 'Product Management', slug: 'products', description: 'Create and manage your product catalog' },
    { name: 'Order Management', slug: 'orders', description: 'Process and track customer orders' },
    { name: 'Customer Management', slug: 'customers', description: 'Manage customer accounts and data' },
    { name: 'Basic SEO', slug: 'seo-basic', description: 'Basic search engine optimization tools' },
    { name: 'Store Settings', slug: 'settings', description: 'Configure your store settings' },
    // E-Ticaret Gelismis
    { name: 'Variants & Stock', slug: 'variants-stock', description: 'Product variants and stock tracking' },
    { name: 'Coupons & Discounts', slug: 'coupons', description: 'Discount codes and coupon management' },
    { name: 'Bulk Import/Export', slug: 'bulk-import', description: 'Bulk product import and export (CSV/Excel)' },
    // Kargo
    { name: 'Shipping Integration', slug: 'shipping', description: 'Cargo company integrations (Yurtici, Aras, MNG)' },
    // Odeme
    { name: 'Payment Gateway', slug: 'payments', description: 'Payment gateway integrations (PayTR, iyzico, Stripe)' },
    // SEO & Pazarlama
    { name: 'Advanced SEO', slug: 'seo-advanced', description: 'Advanced SEO tools, Google Analytics, Meta Pixel' },
    { name: 'Email Marketing', slug: 'email-marketing', description: 'Email campaigns, abandoned cart reminders' },
    // Raporlama
    { name: 'Reports & Analytics', slug: 'reports', description: 'Sales, customer, and stock reports with dashboard' },
    // Finans
    { name: 'E-Invoice', slug: 'einvoice', description: 'E-fatura ve e-arsiv otomasyon (GIB entegrasyonu)' },
    { name: 'Income & Expense', slug: 'income-expense', description: 'Gelir-gider takibi, KDV hesaplama, nakit akis' },
    { name: 'Accounting Reports', slug: 'accounting', description: 'Muhasebe raporlari, kar-zarar, cari hesap' },
    // Pazaryeri
    { name: 'Trendyol Integration', slug: 'marketplace-trendyol', description: 'Trendyol cift yonlu urun/siparis senkronizasyonu' },
    { name: 'Hepsiburada Integration', slug: 'marketplace-hepsiburada', description: 'Hepsiburada urun listeleme ve siparis yonetimi' },
    { name: 'N11 Integration', slug: 'marketplace-n11', description: 'N11 urun ve siparis entegrasyonu' },
    { name: 'Amazon TR Integration', slug: 'marketplace-amazon', description: 'Amazon Turkiye SP-API entegrasyonu' },
    // E-Ihracat
    { name: 'Multi-Currency', slug: 'multi-currency', description: 'Coklu doviz destegi, canli kur, doviz bazli fiyatlandirma' },
    { name: 'Peppol E-Invoice', slug: 'peppol', description: 'Peppol e-fatura ile uluslararasi faturalama' },
    { name: 'International Shipping', slug: 'intl-shipping', description: 'DHL, FedEx, UPS entegrasyonu, ETGB' },
    // Tasarim & Marka
    { name: 'AI Logo Generator', slug: 'ai-logo', description: 'AI ile otomatik logo olusturma' },
    { name: 'Theme Editor', slug: 'theme-editor', description: 'Ozel tema editoru ve banner tasarim araci' },
    // API
    { name: 'API Access', slug: 'api-access', description: 'REST API access for third-party integrations' },
  ];

  for (const mod of modules) {
    await prisma.module.upsert({
      where: { slug: mod.slug },
      update: { name: mod.name, description: mod.description },
      create: mod,
    });
  }
  console.log(`Seeded ${modules.length} modules`);

  // Upsert plans
  const plans = [
    {
      name: 'Baslangic',
      slug: 'baslangic',
      price: 199,
      currency: 'TRY',
      features: {
        maxProducts: 500,
        maxStorage: 5, // GB
        customDomain: false,
        apiAccess: false,
        prioritySupport: false,
        maxPaymentGateways: 1,
        maxShippingProviders: 2,
        maxThemes: 1,
        locales: ['tr', 'en'],
        currencies: ['TRY'],
      },
      moduleSlugs: [
        'products', 'orders', 'customers', 'seo-basic', 'settings',
        'shipping', 'payments',
      ],
    },
    {
      name: 'Profesyonel',
      slug: 'profesyonel',
      price: 499,
      currency: 'TRY',
      features: {
        maxProducts: 5000,
        maxStorage: 25,
        customDomain: true,
        apiAccess: false,
        prioritySupport: false,
        maxPaymentGateways: -1,
        maxShippingProviders: -1,
        maxThemes: -1,
        locales: ['tr', 'en', 'de', 'fr', 'es'],
        currencies: ['TRY', 'EUR', 'USD'],
      },
      moduleSlugs: [
        'products', 'orders', 'customers', 'seo-basic', 'settings',
        'variants-stock', 'coupons', 'bulk-import',
        'shipping', 'payments',
        'seo-advanced', 'email-marketing', 'reports',
        'einvoice', 'income-expense', 'accounting',
      ],
    },
    {
      name: 'Kurumsal',
      slug: 'kurumsal',
      price: 999,
      currency: 'TRY',
      features: {
        maxProducts: -1,
        maxStorage: 100,
        customDomain: true,
        apiAccess: true,
        prioritySupport: true,
        maxPaymentGateways: -1,
        maxShippingProviders: -1,
        maxThemes: -1,
        locales: ['tr', 'en', 'de', 'fr', 'es'],
        currencies: ['TRY', 'EUR', 'USD', 'GBP'],
      },
      moduleSlugs: [
        'products', 'orders', 'customers', 'seo-basic', 'settings',
        'variants-stock', 'coupons', 'bulk-import',
        'shipping', 'payments',
        'seo-advanced', 'email-marketing', 'reports',
        'einvoice', 'income-expense', 'accounting',
        'marketplace-trendyol', 'marketplace-hepsiburada', 'marketplace-n11', 'marketplace-amazon',
        'api-access',
      ],
    },
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { slug: plan.slug },
      update: {
        name: plan.name,
        price: plan.price,
        currency: plan.currency,
        features: plan.features,
        moduleSlugs: plan.moduleSlugs,
      },
      create: plan,
    });
  }
  console.log(`Seeded ${plans.length} plans`);

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
