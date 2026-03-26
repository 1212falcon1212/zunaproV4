'use client';

import Link from 'next/link';
import type { Block } from '@zunapro/types';

interface PromoBanner {
  id: string;
  image?: string;
  title?: Record<string, string>;
  subtitle?: Record<string, string>;
  buttonText?: Record<string, string>;
  buttonLink?: string;
  backgroundColor?: string;
  textColor?: string;
}

interface PromoBannersBlockProps {
  block: Block;
  locale: string;
}

export function PromoBannersBlock({ block, locale }: PromoBannersBlockProps) {
  const props = block.props as {
    banners?: PromoBanner[];
  };

  const banners = props.banners ?? [];

  if (banners.length === 0) {
    return null;
  }

  const gridCols =
    banners.length === 1
      ? 'grid-cols-1'
      : banners.length === 2
        ? 'grid-cols-1 md:grid-cols-2'
        : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  return (
    <section className="mx-auto max-w-[1300px] px-4 py-8 sm:px-6 lg:px-8">
      <div className={`grid ${gridCols} gap-4`}>
        {banners.slice(0, 3).map((banner) => {
          const title = banner.title?.[locale] ?? banner.title?.en ?? '';
          const subtitle = banner.subtitle?.[locale] ?? banner.subtitle?.en ?? '';
          const buttonText = banner.buttonText?.[locale] ?? banner.buttonText?.en ?? '';
          const bgColor = banner.backgroundColor ?? '#3b82f6';
          const txtColor = banner.textColor ?? 'white';
          const link = resolveStoreLink(banner.buttonLink ?? '#', locale);

          return (
            <div
              key={banner.id}
              className="relative flex min-h-[200px] flex-col items-start justify-end overflow-hidden rounded-lg p-6"
              style={{
                backgroundColor: bgColor,
                backgroundImage: banner.image ? `url(${banner.image})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: txtColor,
              }}
            >
              {/* Overlay for images */}
              {banner.image && (
                <div className="absolute inset-0 bg-black/30" />
              )}

              <div className="relative z-10">
                {title && (
                  <h3
                    className="mb-1 text-xl font-bold"
                    style={{ fontFamily: 'var(--font-heading)', color: txtColor }}
                  >
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p
                    className="mb-3 text-sm opacity-90"
                    style={{ color: txtColor }}
                  >
                    {subtitle}
                  </p>
                )}
                {buttonText && (
                  <Link
                    href={link}
                    className="inline-flex items-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[var(--color-foreground)] shadow-sm transition-colors hover:bg-gray-100"
                  >
                    {buttonText}
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function resolveStoreLink(link: string, locale: string): string {
  if (!link || link.startsWith('http') || link.startsWith('#')) return link || '#';
  const normalized = link.startsWith('/') ? link : `/${link}`;
  return `/store/${locale}${normalized === '/' ? '' : normalized}`;
}
