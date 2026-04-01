'use client';

import { use, useEffect, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@zunapro/ui';
import { panelApi } from '@/lib/panel-api';
import { UploadZone } from './_components/upload-zone';
import { MediaGrid } from './_components/media-grid';

interface MediaItem {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

interface PaginatedResponse {
  data: MediaItem[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export default function MediaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  use(params);
  const t = useTranslations('panel.media');
  const [items, setItems] = useState<MediaItem[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMedia = useCallback(async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const res = await panelApi.get<PaginatedResponse>('/media', {
        page,
        limit: 20,
      });
      setItems(res.data);
      setMeta(res.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load media');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleDelete = async (id: string) => {
    if (!confirm(t('deleteConfirm'))) return;
    try {
      await panelApi.delete(`/media/${id}`);
      fetchMedia(meta.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete media');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t('title')}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {t('subtitle', { count: meta.total })}
        </p>
      </div>

      <UploadZone onUploadComplete={() => fetchMedia(1)} />

      {error && (
        <div className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
        </div>
      ) : (
        <MediaGrid items={items} onDelete={handleDelete} />
      )}

      {meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={meta.page <= 1}
            onClick={() => fetchMedia(meta.page - 1)}
          >
            {t('prev')}
          </Button>
          <span className="text-sm text-slate-500">
            {meta.page} / {meta.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={meta.page >= meta.totalPages}
            onClick={() => fetchMedia(meta.page + 1)}
          >
            {t('next')}
          </Button>
        </div>
      )}
    </div>
  );
}
