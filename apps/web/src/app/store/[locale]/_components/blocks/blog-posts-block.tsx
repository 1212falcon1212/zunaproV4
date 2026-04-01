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
    subtitle?: Record<string, string>;
    limit?: number;
    columns?: number;
    showExcerpt?: boolean;
    showDate?: boolean;
    showAuthor?: boolean;
  };

  const title = props.title?.[locale] ?? props.title?.en ?? '';
  const subtitle = props.subtitle?.[locale] ?? props.subtitle?.en ?? '';
  const limit = props.limit || 4;
  const columns = props.columns || 4;
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
    return new Date(dateStr).toLocaleDateString('tr-TR', {
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
      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto max-w-[1300px]">
          {(title || subtitle) && (
            <div className="text-center mb-8">
              {title && <p className="text-xs font-semibold uppercase tracking-wider text-red-500 mb-2">{title}</p>}
              {subtitle && <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{subtitle}</h2>}
            </div>
          )}
          <div className={`grid ${gridCols} gap-6`}>
            {Array.from({ length: limit }).map((_, i) => (
              <div key={i} className="animate-pulse overflow-hidden rounded-xl border border-gray-100 bg-white">
                <div className="aspect-[16/10] bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-3 w-1/3 rounded bg-gray-200" />
                  <div className="h-4 w-3/4 rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) return null;

  return (
    <section className="py-12 px-4 bg-white">
      <div className="container mx-auto max-w-[1300px]">
        {(title || subtitle) && (
          <div className="text-center mb-10">
            {title && <p className="text-xs font-semibold uppercase tracking-wider text-red-500 mb-2">{title}</p>}
            {subtitle && <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{subtitle}</h2>}
          </div>
        )}

        <div className={`grid ${gridCols} gap-6`}>
          {posts.map((post) => {
            const postTitle = post.title[locale] ?? post.title.en ?? post.slug;
            return (
              <Link
                key={post.id}
                href={`/store/${locale}/blog/${post.slug}`}
                className="group overflow-hidden rounded-xl bg-white border border-gray-100 transition-all duration-300 hover:shadow-xl"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                  {post.featuredImage ? (
                    <img
                      src={post.featuredImage}
                      alt={postTitle}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400 bg-gradient-to-br from-gray-100 to-gray-200">
                      <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="mb-3 flex items-center gap-3 text-xs text-gray-500">
                    {showAuthor && post.author && (
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        {post.author}
                      </span>
                    )}
                    {post.category && (
                      <span className="font-medium text-red-500">{post.category}</span>
                    )}
                    {showDate && post.publishedAt && (
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        {formatDate(post.publishedAt)}
                      </span>
                    )}
                  </div>

                  <h3 className="mb-3 text-base font-bold text-gray-900 line-clamp-2 group-hover:text-red-500 transition-colors">
                    {postTitle}
                  </h3>

                  <span className="text-sm font-semibold text-red-500 group-hover:underline flex items-center gap-1">
                    Devamını Oku
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
