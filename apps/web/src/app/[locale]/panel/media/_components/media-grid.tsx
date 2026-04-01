'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@zunapro/ui';

interface MediaItem {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

interface MediaGridProps {
  items: MediaItem[];
  onDelete: (id: string) => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaGrid({ items, onDelete }: MediaGridProps) {
  const t = useTranslations('panel.media');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
        <p className="text-sm text-slate-500">{t('empty')}</p>
      </div>
    );
  }

  const copyUrl = async (id: string, url: string) => {
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {items.map((item) => (
        <div
          key={item.id}
          className="group relative overflow-hidden rounded-lg border bg-white"
        >
          <div className="aspect-square">
            {item.mimeType.startsWith('image/') ? (
              <img
                src={item.url}
                alt={item.filename}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-slate-100">
                <svg
                  className="h-8 w-8 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            )}
          </div>

          <div className="p-2">
            <p className="truncate text-xs font-medium text-slate-700">
              {item.filename}
            </p>
            <p className="text-xs text-slate-400">{formatFileSize(item.size)}</p>
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => copyUrl(item.id, item.url)}
            >
              {copiedId === item.id ? t('copied') : t('copyUrl')}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(item.id)}
            >
              {t('delete')}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
