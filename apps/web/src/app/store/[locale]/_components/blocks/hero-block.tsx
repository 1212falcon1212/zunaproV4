import Link from 'next/link';
import type { Block } from '@zunapro/types';

interface HeroProps {
  block: Block;
  locale: string;
}

function resolveStoreLink(link: string, locale: string): string {
  if (!link || link.startsWith('http') || link.startsWith('#')) return link || '#';
  const normalized = link.startsWith('/') ? link : `/${link}`;
  return `/store/${locale}${normalized === '/' ? '' : normalized}`;
}

export function HeroBlock({ block, locale }: HeroProps) {
  const props = block.props as {
    title?: Record<string, string>;
    subtitle?: Record<string, string>;
    buttonText?: Record<string, string>;
    buttonLink?: string;
    secondaryButtonText?: Record<string, string>;
    secondaryButtonLink?: string;
    backgroundImage?: string;
    overlayOpacity?: number;
  };

  const title = props.title?.[locale] ?? props.title?.en ?? '';
  const subtitle = props.subtitle?.[locale] ?? props.subtitle?.en ?? '';
  const buttonText = props.buttonText?.[locale] ?? props.buttonText?.en ?? '';
  const secondaryText =
    props.secondaryButtonText?.[locale] ?? props.secondaryButtonText?.en ?? '';

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)]"
      style={
        props.backgroundImage
          ? {
              backgroundImage: `url(${props.backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : undefined
      }
    >
      {props.backgroundImage && (
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: props.overlayOpacity ?? 0.4 }}
        />
      )}
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="max-w-2xl">
          {title && (
            <h1
              className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {title}
            </h1>
          )}
          {subtitle && <p className="mt-6 text-lg text-white/80">{subtitle}</p>}
          {(buttonText || secondaryText) && (
            <div className="mt-8 flex gap-4">
              {buttonText && props.buttonLink && (
                <Link
                  href={resolveStoreLink(props.buttonLink, locale)}
                  className="inline-flex items-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-[var(--color-primary)] shadow-sm hover:bg-gray-50"
                >
                  {buttonText}
                </Link>
              )}
              {secondaryText && props.secondaryButtonLink && (
                <Link
                  href={resolveStoreLink(props.secondaryButtonLink, locale)}
                  className="inline-flex items-center rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
                >
                  {secondaryText}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
