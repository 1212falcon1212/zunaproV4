import { PrismaClient } from '../node_modules/.prisma/master-client/index.js';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding master database...');

  // Upsert modules
  const modules = [
    { name: 'Product Management', slug: 'products', description: 'Create and manage your product catalog' },
    { name: 'Order Management', slug: 'orders', description: 'Process and track customer orders' },
    { name: 'Customer Management', slug: 'customers', description: 'Manage customer accounts and data' },
    { name: 'Basic SEO', slug: 'seo-basic', description: 'Basic search engine optimization tools' },
    { name: 'Store Settings', slug: 'settings', description: 'Configure your store settings' },
    { name: 'Advanced SEO', slug: 'seo-advanced', description: 'Advanced SEO tools and analytics' },
    { name: 'Reports & Analytics', slug: 'reports', description: 'Detailed business reports and analytics' },
    { name: 'API Access', slug: 'api-access', description: 'REST API access for integrations' },
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
      features: { maxProducts: 500, maxStorage: 5, customDomain: false, apiAccess: false, prioritySupport: false },
      moduleSlugs: ['products', 'orders', 'customers', 'seo-basic', 'settings'],
    },
    {
      name: 'Profesyonel',
      slug: 'profesyonel',
      price: 499,
      currency: 'TRY',
      features: { maxProducts: 5000, maxStorage: 25, customDomain: true, apiAccess: false, prioritySupport: false },
      moduleSlugs: ['products', 'orders', 'customers', 'seo-basic', 'settings', 'seo-advanced', 'reports'],
    },
    {
      name: 'Kurumsal',
      slug: 'kurumsal',
      price: 999,
      currency: 'TRY',
      features: { maxProducts: -1, maxStorage: 100, customDomain: true, apiAccess: true, prioritySupport: true },
      moduleSlugs: ['products', 'orders', 'customers', 'seo-basic', 'settings', 'seo-advanced', 'reports', 'api-access'],
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
