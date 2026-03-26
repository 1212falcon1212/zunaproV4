'use client';

import { use, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useTenantSlug } from '../_components/tenant-context';

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

interface BlogResponse {
  data: BlogPost[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export default function StoreBlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const tenantSlug = useTenantSlug();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/storefront/blog?page=${page}&limit=12`,
        { headers: { 'x-tenant-slug': tenantSlug } },
      );
      if (!res.ok) throw new Error('Failed to fetch');
      const data: BlogResponse = await res.json();
      setPosts(data.data);
      setTotalPages(data.meta.totalPages);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [page, tenantSlug]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1
        className="mb-8 text-3xl font-bold text-[var(--color-foreground)]"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        Blog
      </h1>

      {loading && (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden"
            >
              <div className="aspect-[16/10] bg-[var(--color-muted)]" />
              <div className="p-4 space-y-2">
                <div className="h-3 w-1/3 rounded bg-[var(--color-muted)]" />
                <div className="h-4 w-3/4 rounded bg-[var(--color-muted)]" />
                <div className="h-3 w-full rounded bg-[var(--color-muted)]" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && posts.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-[var(--radius)] border border-dashed border-[var(--color-border)] bg-[var(--color-card)] py-16 text-center">
          <p className="text-lg font-medium text-[var(--color-foreground)]">
            No blog posts yet
          </p>
          <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
            Check back later for new articles.
          </p>
        </div>
      )}

      {!loading && posts.length > 0 && (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {posts.map((post) => {
            const title = post.title[locale] ?? post.title.en ?? post.slug;
            const excerptText = post.excerpt?.[locale] ?? post.excerpt?.en ?? '';

            return (
              <Link
                key={post.id}
                href={`/store/${locale}/blog/${post.slug}`}
                className="group overflow-hidden rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-card)] transition-shadow hover:shadow-lg"
              >
                <div className="aspect-[16/10] overflow-hidden bg-[var(--color-muted)]">
                  {post.featuredImage ? (
                    <img
                      src={post.featuredImage}
                      alt={title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-4xl text-[var(--color-muted-foreground)]">
                      <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs text-[var(--color-muted-foreground)]">
                    {post.category && (
                      <span className="rounded-full bg-[var(--color-primary)]/10 px-2 py-0.5 text-[var(--color-primary)] font-medium">
                        {post.category}
                      </span>
                    )}
                    {post.publishedAt && (
                      <span>{formatDate(post.publishedAt)}</span>
                    )}
                  </div>
                  <h3
                    className="mb-2 text-base font-semibold text-[var(--color-foreground)] line-clamp-2"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {title}
                  </h3>
                  {excerptText && (
                    <p className="mb-3 text-sm text-[var(--color-muted-foreground)] line-clamp-3">
                      {excerptText}
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
      )}

      {!loading && totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-2 text-sm font-medium text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-muted)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-[var(--color-muted-foreground)]">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-2 text-sm font-medium text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-muted)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
