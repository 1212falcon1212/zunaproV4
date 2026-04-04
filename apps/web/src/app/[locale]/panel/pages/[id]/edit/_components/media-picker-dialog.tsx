'use client';

import { useState, useEffect } from 'react';
import { Button, Input, Label } from '@zunapro/ui';
import { X, Upload, Image as ImageIcon, Loader2, Check } from 'lucide-react';
import { getAccessToken } from '@/lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface MediaItem {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
}

interface MediaPickerDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  tenantSlug: string;
}

export function MediaPickerDialog({
  open,
  onClose,
  onSelect,
  tenantSlug,
}: MediaPickerDialogProps) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');

  useEffect(() => {
    if (!open) return;
    loadMedia();
  }, [open, tenantSlug]);

  const loadMedia = async () => {
    setLoading(true);
    const token = getAccessToken();
    try {
      const res = await fetch(`${API_URL}/media`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-tenant-slug': tenantSlug,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setMedia(Array.isArray(data) ? data : data.data || []);
      }
    } catch {
      // Failed to load media
    }
    setLoading(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const token = getAccessToken();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${API_URL}/media/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'x-tenant-slug': tenantSlug,
        },
        body: formData,
      });

      if (res.ok) {
        const uploaded = await res.json();
        setMedia((prev) => [uploaded, ...prev]);
        setSelectedUrl(uploaded.url);
      }
    } catch {
      // Upload failed
    }
    setUploading(false);
  };

  const handleConfirm = () => {
    const url = selectedUrl || urlInput;
    if (url) {
      onSelect(url);
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 flex max-h-[80vh] w-full max-w-3xl flex-col rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold">Select Media</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Upload + URL input */}
          <div className="mb-6 flex gap-4">
            <div className="flex-1">
              <Label>Upload new</Label>
              <label className="mt-1 flex cursor-pointer items-center gap-2 rounded-lg border-2 border-dashed border-slate-300 px-4 py-3 text-sm text-slate-500 hover:border-slate-400">
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                {uploading ? 'Uploading...' : 'Choose file'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUpload}
                  disabled={uploading}
                />
              </label>
            </div>
            <div className="flex-1">
              <Label>Or paste URL</Label>
              <Input
                value={urlInput}
                onChange={(e) => {
                  setUrlInput(e.target.value);
                  setSelectedUrl(null);
                }}
                placeholder="https://..."
                className="mt-1"
              />
            </div>
          </div>

          {/* Media grid */}
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            </div>
          ) : media.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center text-slate-400">
              <ImageIcon className="mb-2 h-8 w-8" />
              <p className="text-sm">No media uploaded yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {media
                .filter((m) => m.mimeType.startsWith('image/'))
                .map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSelectedUrl(item.url);
                      setUrlInput('');
                    }}
                    className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                      selectedUrl === item.url
                        ? 'border-violet-500 ring-2 ring-violet-200'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img
                      src={item.url}
                      alt={item.filename}
                      className="h-full w-full object-cover"
                    />
                    {selectedUrl === item.url && (
                      <div className="absolute right-1 top-1 rounded-full bg-violet-500 p-0.5">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </button>
                ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t px-6 py-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedUrl && !urlInput}
          >
            Select
          </Button>
        </div>
      </div>
    </div>
  );
}
