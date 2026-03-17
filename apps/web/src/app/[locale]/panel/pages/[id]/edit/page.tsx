'use client';

import { use, useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAccessToken, getUserFromToken } from '@/lib/auth';
import { usePageBuilderStore } from '@/lib/stores/page-builder-store';
import type { Block } from '@zunapro/types';
import { EditorToolbar } from './_components/editor-toolbar';
import { BlockSidebar } from './_components/block-sidebar';
import { EditorCanvas } from './_components/editor-canvas';
import { BlockSettingsPanel } from './_components/block-settings-panel';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface PageData {
  id: string;
  title: Record<string, string> | string;
  slug: string;
  content: { version: number; blocks: Block[] } | null;
  status: string;
}

export default function PageEditorPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = use(params);
  const router = useRouter();
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [tenantSlug, setTenantSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    blocks,
    isDirty,
    isSaving,
    selectedBlockId,
    setBlocks,
    setIsSaving,
    markClean,
    getContent,
    undo,
    redo,
    removeBlock,
    selectBlock,
  } = usePageBuilderStore();

  // Fetch tenant slug from user token
  useEffect(() => {
    async function fetchTenantSlug() {
      const user = getUserFromToken();
      if (!user) {
        router.push(`/${locale}/auth/login`);
        return;
      }

      const token = getAccessToken();
      if (!token) {
        router.push(`/${locale}/auth/login`);
        return;
      }

      try {
        const tenantRes = await fetch(`${API_URL}/tenants/${user.tenantId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!tenantRes.ok) {
          throw new Error('Failed to fetch tenant information');
        }
        const tenant = await tenantRes.json();
        setTenantSlug(tenant.slug);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tenant');
        setLoading(false);
      }
    }

    fetchTenantSlug();
  }, [locale, router]);

  // Fetch page data once tenant slug is available
  useEffect(() => {
    if (!tenantSlug) return;

    async function fetchPage() {
      const token = getAccessToken();
      if (!token) return;

      try {
        const res = await fetch(`${API_URL}/pages/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-tenant-slug': tenantSlug as string,
          },
        });
        if (!res.ok) {
          throw new Error('Failed to fetch page');
        }
        const data: PageData = await res.json();
        setPageData(data);
        setBlocks(data.content?.blocks ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load page');
      } finally {
        setLoading(false);
      }
    }

    fetchPage();
  }, [id, tenantSlug, setBlocks]);

  // Save function
  const saveContent = useCallback(async () => {
    if (!tenantSlug) return;
    const token = getAccessToken();
    if (!token) return;

    setIsSaving(true);
    try {
      const content = getContent();
      const res = await fetch(`${API_URL}/pages/${id}/content`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'x-tenant-slug': tenantSlug,
        },
        body: JSON.stringify({ blocks: content.blocks }),
      });
      if (!res.ok) {
        throw new Error('Failed to save page content');
      }
      markClean();
    } catch (err) {
      // Error is visible via isSaving resetting; could add toast in future
      console.error('Save failed:', err);
    } finally {
      setIsSaving(false);
    }
  }, [id, tenantSlug, getContent, markClean, setIsSaving]);

  // Auto-save: debounced 3s after last change
  useEffect(() => {
    if (!isDirty || loading) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveContent();
    }, 3000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [isDirty, blocks, saveContent, loading]);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const isCtrlOrMeta = e.ctrlKey || e.metaKey;

      // Ctrl+Z / Cmd+Z = Undo
      if (isCtrlOrMeta && !e.shiftKey && e.key === 'z') {
        e.preventDefault();
        undo();
        return;
      }

      // Ctrl+Shift+Z / Cmd+Shift+Z = Redo
      if (isCtrlOrMeta && e.shiftKey && e.key === 'z') {
        e.preventDefault();
        redo();
        return;
      }

      // Ctrl+S / Cmd+S = Save
      if (isCtrlOrMeta && e.key === 's') {
        e.preventDefault();
        saveContent();
        return;
      }

      // Delete / Backspace to remove selected block (only if not in input/textarea)
      if (
        (e.key === 'Delete' || e.key === 'Backspace') &&
        selectedBlockId
      ) {
        const target = e.target as HTMLElement;
        const isEditable =
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable;
        if (!isEditable) {
          e.preventDefault();
          removeBlock(selectedBlockId);
        }
      }

      // Escape to deselect
      if (e.key === 'Escape' && selectedBlockId) {
        selectBlock(null);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, saveContent, selectedBlockId, removeBlock, selectBlock]);

  // Warn before unload if dirty
  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (isDirty) {
        e.preventDefault();
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
          <span className="text-sm text-slate-500">Loading page editor...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="rounded-full bg-red-100 p-3">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <p className="text-sm text-slate-600">{error}</p>
          <button
            onClick={() => router.back()}
            className="text-sm text-violet-600 underline hover:text-violet-800"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col overflow-hidden -m-4 lg:-m-6">
      {/* Toolbar */}
      <EditorToolbar
        pageTitle={
          pageData?.title
            ? typeof pageData.title === 'string'
              ? pageData.title
              : pageData.title[locale] ?? pageData.title.en ?? 'Untitled'
            : 'Untitled'
        }
        pageSlug={pageData?.slug ?? ''}
        onSave={saveContent}
        locale={locale}
        tenantSlug={tenantSlug ?? ''}
      />

      {/* Editor body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar: Block catalog */}
        <BlockSidebar />

        {/* Center: Canvas */}
        <EditorCanvas />

        {/* Right sidebar: Block settings */}
        <BlockSettingsPanel locale={locale} />
      </div>
    </div>
  );
}
