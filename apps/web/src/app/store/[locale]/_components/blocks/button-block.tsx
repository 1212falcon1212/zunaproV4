import Link from 'next/link';
import type { Block } from '@zunapro/types';

interface ButtonProps {
  block: Block;
  locale: string;
}

function resolveStoreLink(link: string, locale: string): string {
  if (!link || link.startsWith('http') || link.startsWith('#')) return link || '#';
  const normalized = link.startsWith('/') ? link : `/${link}`;
  return `/store/${locale}${normalized === '/' ? '' : normalized}`;
}

export function ButtonBlock({ block, locale }: ButtonProps) {
  const props = block.props as {
    text?: Record<string, string>;
    link?: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    align?: 'left' | 'center' | 'right';
    fullWidth?: boolean;
  };

  const text = props.text?.[locale] ?? props.text?.en ?? 'Button';
  const variant = props.variant || 'primary';
  const size = props.size || 'md';
  const align = props.align || 'left';

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  const variantClasses = {
    primary:
      'bg-[var(--color-primary)] text-white hover:opacity-90',
    secondary:
      'bg-[var(--color-secondary)] text-white hover:opacity-90',
    outline:
      'border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white',
    ghost:
      'text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10',
  };

  const alignClass = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  const className = `inline-flex items-center rounded-[var(--radius)] font-semibold transition-all ${sizeClasses[size]} ${variantClasses[variant]} ${props.fullWidth ? 'w-full justify-center' : ''}`;

  return (
    <div
      className={`mx-auto flex max-w-7xl px-4 sm:px-6 lg:px-8 ${alignClass[align]}`}
    >
      {props.link ? (
        <Link href={resolveStoreLink(props.link, locale)} className={className}>
          {text}
        </Link>
      ) : (
        <span className={className}>{text}</span>
      )}
    </div>
  );
}
