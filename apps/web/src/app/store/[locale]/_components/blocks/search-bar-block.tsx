'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Block } from '@zunapro/types';

interface SearchBarProps {
  block: Block;
  locale: string;
}

export function SearchBarBlock({ block, locale }: SearchBarProps) {
  const props = block.props as {
    placeholder?: Record<string, string>;
    width?: string;
  };

  const [query, setQuery] = useState('');
  const router = useRouter();

  const placeholder =
    props.placeholder?.[locale] ?? props.placeholder?.en ?? 'Search...';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/store/${locale}/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative"
      style={{ maxWidth: props.width || '300px' }}
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2 pr-10 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-secondary)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
      />
      <button
        type="submit"
        className="absolute right-0 top-0 flex h-full items-center px-3 text-[var(--color-secondary)] hover:text-[var(--color-primary)]"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
    </form>
  );
}
