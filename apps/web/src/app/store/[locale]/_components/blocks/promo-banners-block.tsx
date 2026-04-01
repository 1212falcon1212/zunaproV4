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
  if (banners.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1300px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {banners.slice(0, 2).map((banner) => {
          const title = banner.title?.[locale] ?? banner.title?.en ?? '';
          const subtitle = banner.subtitle?.[locale] ?? banner.subtitle?.en ?? '';
          const buttonText = banner.buttonText?.[locale] ?? banner.buttonText?.en ?? '';
          const bgColor = banner.backgroundColor ?? '#3b82f6';
          const txtColor = banner.textColor ?? 'white';
          const link = resolveStoreLink(banner.buttonLink ?? '#', locale);

          return (
            <div
              key={banner.id}
              className="group relative flex min-h-[240px] md:min-h-[280px] overflow-hidden rounded-2xl"
              style={{ backgroundColor: bgColor }}
            >
              {banner.image && (
                <img
                  src={banner.image}
                  alt={title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
              {banner.image && <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />}

              <div className="relative z-10 flex flex-col justify-center p-8 md:p-10 max-w-[60%]" style={{ color: txtColor }}>
                {subtitle && (
                  <span className="text-xs font-bold uppercase tracking-wider opacity-80 mb-2">{subtitle}</span>
                )}
                {title && (
                  <h3 className="text-xl md:text-2xl font-bold mb-4 leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                    {title}
                  </h3>
                )}
                {buttonText && (
                  <Link
                    href={link}
                    className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm transition-all hover:bg-red-500 hover:text-white w-fit"
                  >
                    {buttonText}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
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
