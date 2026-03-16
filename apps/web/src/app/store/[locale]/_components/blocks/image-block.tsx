import Link from 'next/link';
import type { Block } from '@zunapro/types';

interface ImageProps {
  block: Block;
  locale: string;
}

function resolveStoreLink(link: string, locale: string): string {
  if (!link || link.startsWith('http') || link.startsWith('#')) return link || '#';
  const normalized = link.startsWith('/') ? link : `/${link}`;
  return `/store/${locale}${normalized === '/' ? '' : normalized}`;
}

export function ImageBlock({ block, locale }: ImageProps) {
  const props = block.props as {
    src?: string;
    alt?: Record<string, string>;
    link?: string;
    width?: string;
    aspectRatio?: string;
  };

  if (!props.src) return null;

  const alt = props.alt?.[locale] ?? props.alt?.en ?? '';

  const img = (
    <img
      src={props.src}
      alt={alt}
      className="h-full w-full object-cover"
      style={{ aspectRatio: props.aspectRatio || 'auto' }}
      loading="lazy"
    />
  );

  const wrapper = (
    <div
      className="mx-auto overflow-hidden rounded-[var(--radius)]"
      style={{ maxWidth: props.width || '100%' }}
    >
      {img}
    </div>
  );

  if (props.link) {
    return (
      <Link href={resolveStoreLink(props.link, locale)} className="block">
        {wrapper}
      </Link>
    );
  }

  return wrapper;
}
