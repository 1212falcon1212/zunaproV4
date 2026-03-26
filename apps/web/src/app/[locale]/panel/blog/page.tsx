'use client';

import { use, useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Card,
  CardContent,
  Badge,
  Input,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@zunapro/ui';
import { panelApi } from '@/lib/panel-api';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  FileText,
  Eye,
  FilePenLine,
  ChevronLeft,
  ChevronRight,
  Newspaper,
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: Record<string, string>;
  slug: string;
  status: string;
  category?: string | null;
  author?: string | null;
  excerpt?: Record<string, string> | null;
  featuredImage?: string | null;
  publishedAt?: string | null;
  createdAt: string;
}

interface BlogResponse {
  data: BlogPost[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export default function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page, limit: 20 };
      if (statusFilter && statusFilter !== 'all') params.status = statusFilter;
      const result = await panelApi.get<BlogResponse>('/blog', params);
      setPosts(result.data);
      setTotal(result.meta.total);
      setTotalPages(result.meta.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const filteredPosts = useMemo(() => {
    if (!search.trim()) return posts;
    const q = search.toLowerCase();
    return posts.filter((post) => {
      const title = post.title[locale] || post.title.en || post.slug;
      return title.toLowerCase().includes(q);
    });
  }, [posts, search, locale]);

  const publishedCount = useMemo(
    () => posts.filter((p) => p.status === 'published').length,
    [posts],
  );
  const draftCount = useMemo(
    () => posts.filter((p) => p.status === 'draft').length,
    [posts],
  );

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      await panelApi.delete(`/blog/${id}`);
      fetchPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete blog post');
    }
  };

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push('ellipsis');
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
        pages.push(i);
      }
      if (page < totalPages - 2) pages.push('ellipsis');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Blog Posts</h1>
          <p className="mt-1 text-sm text-slate-500">
            Create and manage your blog content across all languages.
          </p>
        </div>
        <Button
          onClick={() => router.push(`/${locale}/panel/blog/new/edit`)}
          className="h-10 rounded-lg bg-violet-600 px-5 text-white shadow-sm hover:bg-violet-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Post
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border border-slate-200 shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-violet-50">
              <FileText className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Posts</p>
              <p className="text-2xl font-bold text-slate-900">{total}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-slate-200 shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50">
              <Eye className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Published</p>
              <p className="text-2xl font-bold text-slate-900">{publishedCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-slate-200 shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-50">
              <FilePenLine className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Drafts</p>
              <p className="text-2xl font-bold text-slate-900">{draftCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border border-slate-200 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search blog posts..."
                className="pl-9"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(val) => {
                setStatusFilter(val);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
        </div>
      ) : filteredPosts.length === 0 ? (
        /* Empty state */
        <Card className="border border-slate-200 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-20">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <Newspaper className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">No posts yet</h3>
            <p className="mb-6 mt-1 max-w-sm text-center text-sm text-slate-500">
              Start sharing your stories. Create your first blog post to engage your audience.
            </p>
            <Button
              onClick={() => router.push(`/${locale}/panel/blog/new/edit`)}
              className="rounded-lg bg-violet-600 px-5 text-white hover:bg-violet-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Post
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Blog card grid */}
          <div className="grid gap-5 sm:grid-cols-2">
            {filteredPosts.map((post) => {
              const title = post.title[locale] || post.title.en || post.slug;
              const excerptText =
                post.excerpt?.[locale] || post.excerpt?.en || '';
              return (
                <Card
                  key={post.id}
                  className="group overflow-hidden border border-slate-200 shadow-sm transition-shadow duration-200 hover:shadow-md"
                >
                  {/* Featured image */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                    {post.featuredImage ? (
                      <img
                        src={post.featuredImage}
                        alt={title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <FileText className="h-10 w-10 text-slate-300" />
                      </div>
                    )}
                    {/* Hover overlay with actions */}
                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/40 group-hover:opacity-100">
                      <button
                        onClick={() =>
                          router.push(`/${locale}/panel/blog/${post.id}/edit`)
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm transition-colors hover:bg-white"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-rose-600 shadow-sm transition-colors hover:bg-white"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Card body */}
                  <CardContent className="p-5">
                    <div className="mb-3 flex items-center gap-2">
                      {post.category && (
                        <Badge
                          variant="secondary"
                          className="rounded-md bg-violet-50 text-xs font-medium text-violet-700"
                        >
                          {post.category}
                        </Badge>
                      )}
                      <Badge
                        variant={post.status === 'published' ? 'default' : 'secondary'}
                        className={`rounded-md text-xs font-medium ${
                          post.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-50'
                            : 'bg-amber-50 text-amber-700 hover:bg-amber-50'
                        }`}
                      >
                        {post.status === 'published' ? 'Published' : 'Draft'}
                      </Badge>
                    </div>
                    <h3
                      className="mb-1 cursor-pointer text-base font-semibold text-slate-900 transition-colors hover:text-violet-600"
                      onClick={() =>
                        router.push(`/${locale}/panel/blog/${post.id}/edit`)
                      }
                    >
                      {title}
                    </h3>
                    {excerptText && (
                      <p className="mb-3 line-clamp-2 text-sm text-slate-500">
                        {excerptText}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                      {post.author && <span>by {post.author}</span>}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Page {page} of {totalPages}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {getPageNumbers().map((pg, idx) =>
                  pg === 'ellipsis' ? (
                    <span
                      key={`e-${idx}`}
                      className="flex h-9 w-9 items-center justify-center text-sm text-slate-400"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={pg}
                      onClick={() => setPage(pg)}
                      className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                        page === pg
                          ? 'bg-violet-600 text-white shadow-sm'
                          : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {pg}
                    </button>
                  ),
                )}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
