import Link from 'next/link';
import type { Block } from '@zunapro/types';

interface NavigationMenuProps {
  block: Block;
  locale: string;
}

interface NavItem {
  label: Record<string, string>;
  href?: string;
  link?: string;
  children?: NavItem[];
}

function resolveStoreLink(link: string, locale: string): string {
  if (link.startsWith('http') || link.startsWith('#')) return link;
  // Prefix with /store/[locale] for internal links
  const normalized = link.startsWith('/') ? link : `/${link}`;
  return `/store/${locale}${normalized === '/' ? '' : normalized}`;
}

export function NavigationMenuBlock({ block, locale }: NavigationMenuProps) {
  const props = block.props as {
    items?: NavItem[];
    orientation?: 'horizontal' | 'vertical';
  };

  const items = props.items || [];
  const isVertical = props.orientation === 'vertical';

  if (items.length === 0) return null;

  return (
    <nav>
      <ul
        className={`flex gap-1 ${isVertical ? 'flex-col' : 'flex-row items-center'}`}
      >
        {items.map((item, index) => {
          const label = item.label[locale] ?? item.label.en ?? '';
          const itemHref = resolveStoreLink(item.href || item.link || '#', locale);
          return (
            <li key={index} className="relative group">
              <Link
                href={itemHref}
                className="rounded-md px-3 py-2 text-sm font-medium text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-muted)] hover:text-[var(--color-primary)]"
              >
                {label}
              </Link>
              {item.children && item.children.length > 0 && (
                <ul className="absolute left-0 top-full z-50 hidden min-w-[160px] rounded-md border border-[var(--color-border)] bg-[var(--color-background)] py-1 shadow-lg group-hover:block">
                  {item.children.map((child, ci) => {
                    const childLabel =
                      child.label[locale] ?? child.label.en ?? '';
                    const childHref = resolveStoreLink(child.href || child.link || '#', locale);
                    return (
                      <li key={ci}>
                        <Link
                          href={childHref}
                          className="block px-4 py-2 text-sm text-[var(--color-foreground)] hover:bg-[var(--color-muted)]"
                        >
                          {childLabel}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
