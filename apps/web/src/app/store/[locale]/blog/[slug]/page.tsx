import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { serverFetch } from '@/lib/server-store-api';

interface BlogPost {
  id: string;
  title: Record<string, string>;
  slug: string;
  excerpt?: Record<string, string> | null;
  content?: Record<string, string> | null;
  featuredImage?: string | null;
  author?: string | null;
  category?: string | null;
  tags?: string[];
  publishedAt?: string | null;
  seoMeta?: Record<string, { title?: string; description?: string }> | null;
}

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;

  try {
    const post = await serverFetch<BlogPost>(`/storefront/blog/${slug}`);
    const title = post.title[locale] ?? post.title.en ?? slug;
    const seo = post.seoMeta?.[locale];
    const excerptText = post.excerpt?.[locale] ?? post.excerpt?.en ?? '';

    return {
      title: seo?.title ?? title,
      description: seo?.description ?? (excerptText || `Read "${title}"`),
      openGraph: {
        title: seo?.title ?? title,
        description: seo?.description ?? (excerptText || `Read "${title}"`),
        images: post.featuredImage ? [{ url: post.featuredImage }] : [],
        type: 'article',
      },
    };
  } catch {
    return { title: slug };
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;

  let post: BlogPost;
  try {
    post = await serverFetch<BlogPost>(`/storefront/blog/${slug}`);
  } catch {
    notFound();
  }

  const title = post.title[locale] ?? post.title.en ?? slug;
  const contentHtml = post.content?.[locale] ?? post.content?.en ?? '';
  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Back link */}
      <Link
        href={`/store/${locale}/blog`}
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-[var(--color-primary)] hover:underline"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Blog
      </Link>

      {/* Featured image */}
      {post.featuredImage && (
        <div className="mb-8 overflow-hidden rounded-[var(--radius)]">
          <img
            src={post.featuredImage}
            alt={title}
            className="h-[400px] w-full object-cover"
          />
        </div>
      )}

      {/* Header */}
      <header className="mb-8">
        <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-[var(--color-muted-foreground)]">
          {post.category && (
            <span className="rounded-full bg-[var(--color-primary)]/10 px-3 py-1 text-xs font-medium text-[var(--color-primary)]">
              {post.category}
            </span>
          )}
          {publishedDate && <span>{publishedDate}</span>}
          {post.author && (
            <>
              <span className="text-[var(--color-border)]">|</span>
              <span>By {post.author}</span>
            </>
          )}
        </div>
        <h1
          className="text-3xl font-bold text-[var(--color-foreground)] sm:text-4xl"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {title}
        </h1>
      </header>

      {/* Content */}
      {contentHtml && (
        <div
          className="prose prose-lg max-w-none text-[var(--color-foreground)]"
          style={{ fontFamily: 'var(--font-body)' }}
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="mt-10 flex flex-wrap gap-2 border-t border-[var(--color-border)] pt-6">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-muted-foreground)]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
