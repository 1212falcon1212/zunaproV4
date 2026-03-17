'use client';

import { Button } from '@zunapro/ui';
import { usePageBuilderStore } from '@/lib/stores/page-builder-store';
import {
  Undo2,
  Redo2,
  Monitor,
  Tablet,
  Smartphone,
  Eye,
  Save,
  Loader2,
  ArrowLeft,
  Check,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@zunapro/ui';

interface EditorToolbarProps {
  pageTitle: string;
  pageSlug: string;
  onSave: () => void;
  locale: string;
  tenantSlug: string;
}

export function EditorToolbar({
  pageTitle,
  pageSlug,
  onSave,
  locale,
  tenantSlug,
}: EditorToolbarProps) {
  const {
    isDirty,
    isSaving,
    devicePreview,
    setDevicePreview,
    historyIndex,
    history,
    undo,
    redo,
  } = usePageBuilderStore();

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const devices: Array<{
    value: 'desktop' | 'tablet' | 'mobile';
    icon: typeof Monitor;
    label: string;
  }> = [
    { value: 'desktop', icon: Monitor, label: 'Desktop' },
    { value: 'tablet', icon: Tablet, label: 'Tablet' },
    { value: 'mobile', icon: Smartphone, label: 'Mobile' },
  ];

  return (
    <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4">
      {/* Left: Back + Page title */}
      <div className="flex items-center gap-3">
        <Link
          href={`/${locale}/panel/pages`}
          className="flex items-center gap-1.5 rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>

        <div className="h-6 w-px bg-slate-200" />

        <div className="flex items-center gap-2">
          <h1 className="text-sm font-semibold text-slate-800">{pageTitle}</h1>
          {isDirty && (
            <span className="inline-flex h-2 w-2 rounded-full bg-amber-400" />
          )}
          {!isDirty && !isSaving && (
            <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
              <Check className="h-3 w-3" />
              Saved
            </span>
          )}
        </div>
      </div>

      {/* Center: Undo/Redo + Device preview */}
      <div className="flex items-center gap-1">
        <button
          onClick={undo}
          disabled={!canUndo}
          className={cn(
            'rounded-lg p-2 transition-colors',
            canUndo
              ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
              : 'cursor-not-allowed text-slate-300',
          )}
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="h-4 w-4" />
        </button>

        <button
          onClick={redo}
          disabled={!canRedo}
          className={cn(
            'rounded-lg p-2 transition-colors',
            canRedo
              ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
              : 'cursor-not-allowed text-slate-300',
          )}
          title="Redo (Ctrl+Shift+Z)"
        >
          <Redo2 className="h-4 w-4" />
        </button>

        <div className="mx-2 h-6 w-px bg-slate-200" />

        <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5">
          {devices.map(({ value, icon: Icon, label }) => (
            <button
              key={value}
              onClick={() => setDevicePreview(value)}
              className={cn(
                'rounded-md p-1.5 transition-all',
                devicePreview === value
                  ? 'bg-white text-violet-600 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600',
              )}
              title={label}
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>
      </div>

      {/* Right: Preview + Save */}
      <div className="flex items-center gap-2">
        <a
          href={`/store/${locale}/${pageSlug || ''}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-800"
        >
          <Eye className="h-4 w-4" />
          Preview
        </a>

        <Button
          onClick={onSave}
          disabled={isSaving || !isDirty}
          size="sm"
          className="gap-1.5"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
