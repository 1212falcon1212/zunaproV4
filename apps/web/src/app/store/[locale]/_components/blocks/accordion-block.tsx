'use client';

import { useState } from 'react';
import type { Block } from '@zunapro/types';

interface AccordionProps {
  block: Block;
  locale: string;
}

interface AccordionItem {
  title: Record<string, string>;
  content: Record<string, string>;
}

export function AccordionBlock({ block, locale }: AccordionProps) {
  const props = block.props as {
    title?: Record<string, string>;
    items?: AccordionItem[];
    allowMultiple?: boolean;
  };

  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const title = props.title?.[locale] ?? props.title?.en ?? '';
  const items = props.items || [];

  const toggleItem = (index: number) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        if (!props.allowMultiple) {
          next.clear();
        }
        next.add(index);
      }
      return next;
    });
  };

  if (items.length === 0) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {title && (
        <h2
          className="mb-6 text-2xl font-bold text-[var(--color-foreground)]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {title}
        </h2>
      )}
      <div className="divide-y divide-[var(--color-border)] rounded-[var(--radius)] border border-[var(--color-border)]">
        {items.map((item, index) => {
          const itemTitle = item.title[locale] ?? item.title.en ?? '';
          const itemContent = item.content[locale] ?? item.content.en ?? '';
          const isOpen = openItems.has(index);

          return (
            <div key={index}>
              <button
                type="button"
                onClick={() => toggleItem(index)}
                className="flex w-full items-center justify-between px-6 py-4 text-left"
              >
                <span className="font-medium text-[var(--color-foreground)]">
                  {itemTitle}
                </span>
                <svg
                  className={`h-5 w-5 shrink-0 text-[var(--color-secondary)] transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>
              {isOpen && (
                <div className="px-6 pb-4 text-[var(--color-foreground)]/70">
                  <div dangerouslySetInnerHTML={{ __html: itemContent }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
