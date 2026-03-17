import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { serverFetch } from '@/lib/server-store-api';

interface Category {
  id: string;
  name: Record<string, string>;
  slug: string;
  image?: string | null;
  _count: { products: number };
}

interface CategoriesGridProps {
  locale: string;
}

export async function CategoriesGrid({ locale }: CategoriesGridProps) {
  const t = await getTranslations('storefront');

  let categories: Category[] = [];
  try {
    categories = await serverFetch<Category[]>('/storefront/categories');
  } catch {
    categories = [];
  }

  if (categories.length === 0) return null;

  return (
    <section className="bg-[var(--color-muted)]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2
          className="text-2xl font-bold text-[var(--color-foreground)] sm:text-3xl"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {t('categories')}
        </h2>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.slice(0, 8).map((cat) => {
            const name = cat.name[locale] ?? cat.name.en ?? cat.slug;
            return (
              <Link
                key={cat.id}
                href={`/store/${locale}/categories/${cat.slug}`}
                className="group relative flex aspect-[4/3] items-end overflow-hidden rounded-[var(--radius)] bg-[var(--color-background)] shadow-sm transition-shadow hover:shadow-md"
              >
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10" />
                )}
                <div className="relative w-full bg-gradient-to-t from-black/60 to-transparent p-4">
                  <h3 className="text-sm font-semibold text-white sm:text-base">{name}</h3>
                  <p className="text-xs text-white/70">{cat._count.products} {t('products.items')}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
