import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

interface BreadcrumbsProps {
  locale: string;
  items: { label: string; href?: string }[];
}

export async function Breadcrumbs({ locale, items }: BreadcrumbsProps) {
  const t = await getTranslations('storefront');

  return (
    <nav className="mb-6 flex items-center gap-2 text-sm text-[var(--color-secondary)]">
      <Link href={`/store/${locale}`} className="hover:text-[var(--color-primary)]">
        {t('header.home')}
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          <span>/</span>
          {item.href ? (
            <Link href={item.href} className="hover:text-[var(--color-primary)]">
              {item.label}
            </Link>
          ) : (
            <span className="text-[var(--color-foreground)]">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
