import Link from 'next/link';
import type { Block } from '@zunapro/types';

interface LogoProps {
  block: Block;
  locale: string;
}

export function LogoBlock({ block, locale }: LogoProps) {
  const props = block.props as {
    src?: string;
    logoUrl?: string;
    alt?: string;
    width?: string;
    height?: string;
    storeName?: string | Record<string, string>;
  };

  const imgSrc = props.src || props.logoUrl || '';
  const storeName =
    typeof props.storeName === 'object'
      ? (props.storeName[locale] ?? props.storeName.en ?? 'Store')
      : (props.storeName || 'Store');

  const content = imgSrc ? (
    <img
      src={imgSrc}
      alt={props.alt || storeName}
      style={{
        maxWidth: props.width || '150px',
        height: props.height || 'auto',
      }}
      className="object-contain"
    />
  ) : (
    <span
      className="text-xl font-bold text-[var(--color-foreground)]"
      style={{ fontFamily: 'var(--font-heading)' }}
    >
      {storeName}
    </span>
  );

  return (
    <Link href={`/store/${locale}`} className="inline-flex items-center">
      {content}
    </Link>
  );
}
