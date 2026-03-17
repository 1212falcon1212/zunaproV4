import Link from 'next/link';
import type { Block } from '@zunapro/types';

interface BannerProps {
  block: Block;
  locale: string;
}

function resolveStoreLink(link: string, locale: string): string {
  if (!link || link.startsWith('http') || link.startsWith('#')) return link || '#';
  const normalized = link.startsWith('/') ? link : `/${link}`;
  return `/store/${locale}${normalized === '/' ? '' : normalized}`;
}

export function BannerBlock({ block, locale }: BannerProps) {
  const props = block.props as {
    title?: Record<string, string>;
    subtitle?: Record<string, string>;
    buttonText?: Record<string, string>;
    buttonLink?: string;
    backgroundImage?: string;
    backgroundColor?: string;
    textColor?: string;
    height?: string;
  };

  const title = props.title?.[locale] ?? props.title?.en ?? '';
  const subtitle = props.subtitle?.[locale] ?? props.subtitle?.en ?? '';
  const buttonText = props.buttonText?.[locale] ?? props.buttonText?.en ?? '';

  const hasImage = !!props.backgroundImage;
  const bgColor = hasImage
    ? 'transparent'
    : props.backgroundColor || block.style?.backgroundColor || 'var(--color-primary)';
  const txtColor =
    props.textColor || block.style?.textColor || 'white';

  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundColor: bgColor,
        backgroundImage: hasImage ? `url(${props.backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: props.height || '200px',
        color: txtColor,
      }}
    >
      {hasImage && (
        <div className="absolute inset-0 bg-black/30" />
      )}
      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-12 sm:px-6 lg:px-8">
        <div>
          {title && (
            <h2
              className="text-2xl font-bold sm:text-3xl"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {title}
            </h2>
          )}
          {subtitle && <p className="mt-2 text-lg opacity-90">{subtitle}</p>}
        </div>
        {buttonText && props.buttonLink && (
          <Link
            href={resolveStoreLink(props.buttonLink, locale)}
            className="inline-flex items-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-[var(--color-primary)] shadow-sm hover:bg-gray-50"
          >
            {buttonText}
          </Link>
        )}
      </div>
    </section>
  );
}
