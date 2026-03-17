'use client';

import Link from 'next/link';
import type { Block } from '@zunapro/types';

interface CartIconProps {
  block: Block;
  locale: string;
}

export function CartIconBlock({ block, locale }: CartIconProps) {
  const props = block.props as {
    showCount?: boolean;
  };

  return (
    <Link
      href={`/store/${locale}/cart`}
      className="relative inline-flex items-center rounded-md p-2 text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-muted)]"
    >
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
        />
      </svg>
      {props.showCount !== false && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-primary)] text-xs font-bold text-white">
          0
        </span>
      )}
    </Link>
  );
}
