'use client';

import { useState } from 'react';
import type { Block } from '@zunapro/types';

interface NewsletterProps {
  block: Block;
  locale: string;
}

export function NewsletterBlock({ block, locale }: NewsletterProps) {
  const props = block.props as {
    title?: Record<string, string>;
    subtitle?: Record<string, string>;
    description?: Record<string, string>;
    placeholder?: Record<string, string>;
    buttonText?: Record<string, string>;
    backgroundColor?: string;
  };

  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const title = props.title?.[locale] ?? props.title?.en ?? '';
  const desc = props.description || props.subtitle;
  const subtitle = desc?.[locale] ?? desc?.en ?? '';
  const placeholder =
    props.placeholder?.[locale] ?? props.placeholder?.en ?? 'Enter your email';
  const buttonText =
    props.buttonText?.[locale] ?? props.buttonText?.en ?? 'Subscribe';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <section
      className="px-4 py-12 sm:px-6 lg:px-8"
      style={{
        backgroundColor: props.backgroundColor || 'var(--color-muted)',
      }}
    >
      <div className="mx-auto max-w-2xl text-center">
        {title && (
          <h2
            className="text-2xl font-bold text-[var(--color-foreground)]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="mt-2 text-[var(--color-foreground)]/70">{subtitle}</p>
        )}
        {submitted ? (
          <p className="mt-4 text-sm font-medium text-green-600">
            Thank you for subscribing!
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-0"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              required
              className="flex-1 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 text-sm text-[var(--color-foreground)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] sm:rounded-r-none"
            />
            <button
              type="submit"
              className="rounded-[var(--radius)] bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white hover:opacity-90 sm:rounded-l-none"
            >
              {buttonText}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
