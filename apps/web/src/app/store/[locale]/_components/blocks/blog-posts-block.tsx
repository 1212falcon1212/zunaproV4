'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Block } from '@zunapro/types';
import { useTenantSlug } from '../tenant-context';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface BlogPost {
  id: string;
  title: Record<string, string>;
  slug: string;
  excerpt?: Record<string, string> | null;
  featuredImage?: string | null;
  author?: string | null;
  category?: string | null;
  publishedAt?: string | null;
}

interface BlogPostsBlockProps {
  block: Block;
  locale: string;
}

export function BlogPostsBlock({ block, locale }: BlogPostsBlockProps) {
  const props = block.props as {
    title?: Record<string, string>;
    limit?: number;
    columns?: number;
    showExcerpt?: boolean;
    showDate?: boolean;
    showAuthor?: boolean;
  };

  const title = props.title?.[locale] ?? props.title?.en ?? '';
  const limit = props.limit || 4;
  const columns = props.columns || 4;
  const showExcerpt = props.showExcerpt ?? true;
  const showDate = props.showDate ?? true;
  const showAuthor = props.showAuthor ?? true;

  const tenantSlug = useTenantSlug();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(
          `${API_URL}/storefront/blog/recent?limit=${limit}`,
          { headers: { 'x-tenant-slug': tenantSlug } },
        );
        if (!res.ok) throw new Error('Failed to fetch');
        const data: BlogPost[] = await res.json();
        setPosts(data);
      } catch {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [limit, tenantSlug]);

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const gridCols =
    columns === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : columns === 3
        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {title && (
          <h2
            className="mb-6 text-2xl font-bold text-[var(--color-foreground)]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {title}
          </h2>
        )}
        <div className={`grid ${gridCols} gap-6`}>
          {Array.from({ length: limit }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse overflow-hidden rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-card)]"
            >
              <div className="aspect-[16/10] bg-[var(--color-muted)]" />
              <div className="p-4 space-y-2">
                <div className="h-3 w-1/3 rounded bg-[var(--color-muted)]" />
                <div className="h-4 w-3/4 rounded bg-[var(--color-muted)]" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (posts.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {title && (
        <h2
          className="mb-6 text-2xl font-bold text-[var(--color-foreground)]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {title}
        </h2>
      )}

      <div className={`grid ${gridCols} gap-6`}>
        {posts.map((post) => {
          const postTitle = post.title[locale] ?? post.title.en ?? post.slug;
          const excerptText = post.excerpt?.[locale] ?? post.excerpt?.en ?? '';

          return (
            <Link
              key={post.id}
              href={`/store/${locale}/blog/${post.slug}`}
              className="group overflow-hidden rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-card)] transition-shadow hover:shadow-lg"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-muted)]">
                {post.featuredImage ? (
                  <img
                    src={post.featuredImage}
                    alt={postTitle}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[var(--color-muted-foreground)]">
                    <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>

              <div className="p-4">
                <div className="mb-2 flex items-center gap-2 text-xs text-[var(--color-muted-foreground)]">
                  {post.category && (
                    <span className="font-medium text-[var(--color-primary)]">
                      {post.category}
                    </span>
                  )}
                  {showDate && post.publishedAt && (
                    <span>{formatDate(post.publishedAt)}</span>
                  )}
                </div>

                <h3
                  className="mb-1 text-base font-bold text-[var(--color-foreground)] line-clamp-2"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {postTitle}
                </h3>

                {showExcerpt && excerptText && (
                  <p className="mb-2 text-sm text-[var(--color-muted-foreground)] line-clamp-2">
                    {excerptText}
                  </p>
                )}

                {showAuthor && post.author && (
                  <p className="mb-2 text-xs text-[var(--color-muted-foreground)]">
                    By {post.author}
                  </p>
                )}

                <span className="text-sm font-medium text-[var(--color-primary)] group-hover:underline">
                  Continue Reading
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
