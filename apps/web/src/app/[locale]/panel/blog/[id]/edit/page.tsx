'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Button,
  Card,
  Input,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@zunapro/ui';
import { panelApi } from '@/lib/panel-api';
import {
  Save,
  ImageIcon,
  Trash2,
  Link2,
  ChevronRight,
} from 'lucide-react';

const LOCALES = ['en', 'tr', 'de', 'fr', 'es'] as const;
const LOCALE_LABELS: Record<string, string> = {
  en: 'EN',
  tr: 'TR',
  de: 'DE',
  fr: 'FR',
  es: 'ES',
};

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
  status: string;
}

export default function BlogPostEditPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = use(params);
  const router = useRouter();
  const isNew = id === 'new';

  const [title, setTitle] = useState<Record<string, string>>({});
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState<Record<string, string>>({});
  const [content, setContent] = useState<Record<string, string>>({});
  const [featuredImage, setFeaturedImage] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [status, setStatus] = useState('draft');
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  useEffect(() => {
    if (isNew) return;
    const fetchPost = async () => {
      try {
        const post = await panelApi.get<BlogPost>(`/blog/${id}`);
        setTitle(post.title || {});
        setSlug(post.slug);
        setExcerpt(post.excerpt || {});
        setContent(post.content || {});
        setFeaturedImage(post.featuredImage || '');
        setAuthor(post.author || '');
        setCategory(post.category || '');
        setTagsInput(Array.isArray(post.tags) ? post.tags.join(', ') : '');
        setStatus(post.status);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, isNew]);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      const body = {
        title,
        slug: slug || undefined,
        excerpt: Object.keys(excerpt).length > 0 ? excerpt : undefined,
        content: Object.keys(content).length > 0 ? content : undefined,
        featuredImage: featuredImage || undefined,
        author: author || undefined,
        category: category || undefined,
        tags,
        status,
      };

      if (isNew) {
        await panelApi.post('/blog', body);
      } else {
        await panelApi.patch(`/blog/${id}`, body);
      }
      setLastSaved(new Date().toLocaleTimeString());
      router.push(`/${locale}/panel/blog`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save blog post');
    } finally {
      setSaving(false);
    }
  };

  const parsedTags = tagsInput
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-slate-500">
        <Link
          href={`/${locale}/panel`}
          className="transition-colors hover:text-slate-700"
        >
          Panel
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link
          href={`/${locale}/panel/blog`}
          className="transition-colors hover:text-slate-700"
        >
          Blog
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-slate-800">
          {isNew ? 'New Post' : 'Edit Post'}
        </span>
      </nav>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {/* 2-column layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content — col-span-2 */}
        <div className="space-y-6 lg:col-span-2">
          {/* Title Card */}
          <Card className="overflow-hidden border border-slate-200 shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4">
              <h2 className="text-sm font-semibold text-slate-800">Title</h2>
            </div>
            <div className="p-6">
              <Tabs defaultValue="en">
                <TabsList className="mb-4 h-9 w-full justify-start rounded-lg bg-slate-100 p-1">
                  {LOCALES.map((loc) => (
                    <TabsTrigger
                      key={loc}
                      value={loc}
                      className="rounded-md px-4 text-xs font-medium uppercase data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      {LOCALE_LABELS[loc]}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {LOCALES.map((loc) => (
                  <TabsContent key={loc} value={loc}>
                    <Input
                      value={title[loc] || ''}
                      onChange={(e) =>
                        setTitle((prev) => ({ ...prev, [loc]: e.target.value }))
                      }
                      placeholder={`Enter title in ${LOCALE_LABELS[loc]}...`}
                      className="text-base"
                    />
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </Card>

          {/* Content Card */}
          <Card className="overflow-hidden border border-slate-200 shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4">
              <h2 className="text-sm font-semibold text-slate-800">Content</h2>
            </div>
            <div className="p-6">
              <Tabs defaultValue="en">
                <TabsList className="mb-4 h-9 w-full justify-start rounded-lg bg-slate-100 p-1">
                  {LOCALES.map((loc) => (
                    <TabsTrigger
                      key={loc}
                      value={loc}
                      className="rounded-md px-4 text-xs font-medium uppercase data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      {LOCALE_LABELS[loc]}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {LOCALES.map((loc) => (
                  <TabsContent key={loc} value={loc}>
                    <textarea
                      value={content[loc] || ''}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          [loc]: e.target.value,
                        }))
                      }
                      placeholder={`Write your content in ${LOCALE_LABELS[loc]}...`}
                      rows={16}
                      className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-colors focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
                    />
                    <p className="mt-2 text-xs text-slate-400">
                      Supports HTML markup for rich formatting.
                    </p>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </Card>

          {/* Excerpt Card */}
          <Card className="overflow-hidden border border-slate-200 shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4">
              <h2 className="text-sm font-semibold text-slate-800">Excerpt</h2>
            </div>
            <div className="p-6">
              <Tabs defaultValue="en">
                <TabsList className="mb-4 h-9 w-full justify-start rounded-lg bg-slate-100 p-1">
                  {LOCALES.map((loc) => (
                    <TabsTrigger
                      key={loc}
                      value={loc}
                      className="rounded-md px-4 text-xs font-medium uppercase data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      {LOCALE_LABELS[loc]}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {LOCALES.map((loc) => (
                  <TabsContent key={loc} value={loc}>
                    <textarea
                      value={excerpt[loc] || ''}
                      onChange={(e) =>
                        setExcerpt((prev) => ({
                          ...prev,
                          [loc]: e.target.value,
                        }))
                      }
                      placeholder={`Short excerpt in ${LOCALE_LABELS[loc]}...`}
                      rows={3}
                      className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-colors focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
                    />
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </Card>
        </div>

        {/* Sidebar — col-span-1 */}
        <div className="space-y-6">
          {/* Publish Card */}
          <Card className="overflow-hidden border border-slate-200 shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4">
              <h2 className="text-sm font-semibold text-slate-800">Publish</h2>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="mb-2 block text-xs font-medium text-slate-500">
                  Status
                </label>
                <div className="flex rounded-lg border border-slate-200 p-1">
                  <button
                    type="button"
                    onClick={() => setStatus('draft')}
                    className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all ${
                      status === 'draft'
                        ? 'bg-amber-100 text-amber-800 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Draft
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('published')}
                    className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all ${
                      status === 'published'
                        ? 'bg-emerald-100 text-emerald-800 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Published
                  </button>
                </div>
              </div>
              {lastSaved && (
                <p className="mb-4 text-xs text-slate-400">
                  Last saved at {lastSaved}
                </p>
              )}
              <Button
                onClick={handleSave}
                disabled={saving || !title.en}
                className="w-full rounded-lg bg-violet-600 text-white shadow-sm hover:bg-violet-700 disabled:opacity-50"
              >
                <Save className="mr-2 h-4 w-4" />
                {saving ? 'Saving...' : isNew ? 'Create Post' : 'Save Changes'}
              </Button>
            </div>
          </Card>

          {/* Featured Image Card */}
          <Card className="overflow-hidden border border-slate-200 shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4">
              <h2 className="text-sm font-semibold text-slate-800">
                Featured Image
              </h2>
            </div>
            <div className="p-6">
              {/* Preview */}
              <div className="mb-4 overflow-hidden rounded-lg border border-dashed border-slate-300 bg-slate-50">
                {featuredImage ? (
                  <div className="relative">
                    <img
                      src={featuredImage}
                      alt="Featured"
                      className="aspect-video w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex aspect-video flex-col items-center justify-center">
                    <ImageIcon className="mb-2 h-8 w-8 text-slate-300" />
                    <p className="text-xs text-slate-400">No image set</p>
                  </div>
                )}
              </div>

              {/* URL Input */}
              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                  placeholder="https://..."
                  className="pl-9"
                />
              </div>

              {featuredImage && (
                <button
                  type="button"
                  onClick={() => setFeaturedImage('')}
                  className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-rose-200 py-2 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove Image
                </button>
              )}
            </div>
          </Card>

          {/* Details Card */}
          <Card className="overflow-hidden border border-slate-200 shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4">
              <h2 className="text-sm font-semibold text-slate-800">Details</h2>
            </div>
            <div className="space-y-4 p-6">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500">
                  Author
                </label>
                <Input
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Author name"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500">
                  Category
                </label>
                <Input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Technology"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500">
                  Tags (comma-separated)
                </label>
                <Input
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="tag1, tag2, tag3"
                />
                {parsedTags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {parsedTags.map((tag, i) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="rounded-md bg-slate-100 text-xs text-slate-600"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Slug Card */}
          <Card className="overflow-hidden border border-slate-200 shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4">
              <h2 className="text-sm font-semibold text-slate-800">Slug</h2>
            </div>
            <div className="p-6">
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="my-blog-post"
              />
              <p className="mt-2 text-xs text-slate-400">
                Leave empty to auto-generate from the title.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
