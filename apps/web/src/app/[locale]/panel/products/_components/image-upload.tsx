'use client';

import { useCallback, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@zunapro/ui';
import { panelApi } from '@/lib/panel-api';
import { proxyImageUrl } from '@/lib/media-url';

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
}

function BrokenImageIcon() {
  return (
    <svg className="h-8 w-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M18 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75z" />
    </svg>
  );
}

export function ImageUpload({ images, onChange }: ImageUploadProps) {
  const t = useTranslations('panel.products');
  const [uploading, setUploading] = useState(false);
  const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set());

  const handleUpload = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      setUploading(true);
      try {
        const newImages: string[] = [...images];
        for (const file of Array.from(files)) {
          const formData = new FormData();
          formData.append('file', file);
          const result = await panelApi.upload<{ url: string }>(
            '/media/upload',
            formData,
          );
          newImages.push(result.url);
        }
        onChange(newImages);
      } catch {
        // Error is shown at form level
      } finally {
        setUploading(false);
      }
    },
    [images, onChange],
  );

  const handleRemove = (index: number) => {
    const removed = images[index];
    setBrokenImages((prev) => {
      const next = new Set(prev);
      next.delete(removed);
      return next;
    });
    onChange(images.filter((_, i) => i !== index));
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      handleUpload(e.dataTransfer.files);
    },
    [handleUpload],
  );

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50/50 p-8 transition-colors hover:border-violet-400 hover:bg-violet-50/30"
      >
        <svg
          className="mb-2 h-8 w-8 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <p className="text-sm text-slate-500">{t('dragDrop')}</p>
        <label className="mt-2 cursor-pointer">
          <Button variant="outline" size="sm" disabled={uploading} asChild>
            <span>{uploading ? t('uploading') : t('browse')}</span>
          </Button>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className="hidden"
            onChange={(e) => handleUpload(e.target.files)}
          />
        </label>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
          {images.map((url, index) => (
            <div
              key={url}
              className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
            >
              {brokenImages.has(url) ? (
                <div className="flex h-full w-full flex-col items-center justify-center gap-1">
                  <BrokenImageIcon />
                  <span className="text-[9px] text-slate-400">Broken</span>
                </div>
              ) : (
                <img
                  src={proxyImageUrl(url)}
                  alt=""
                  className="h-full w-full object-cover"
                  onError={() => setBrokenImages((prev) => new Set(prev).add(url))}
                />
              )}
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-white opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
              >
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              {index === 0 && (
                <span className="absolute bottom-1 left-1 rounded bg-violet-600 px-1.5 py-0.5 text-[10px] font-medium text-white">
                  {t('mainImage')}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
