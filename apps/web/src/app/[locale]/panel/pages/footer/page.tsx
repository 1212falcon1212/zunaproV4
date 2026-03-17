'use client';

import { use, useState, useEffect, useCallback, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@zunapro/ui';
import { ArrowLeft, Save, Loader2, Monitor, Tablet, Smartphone } from 'lucide-react';
import Link from 'next/link';
import { getUserFromToken, getAccessToken } from '@/lib/auth';
import { usePageBuilderStore } from '@/lib/stores/page-builder-store';
import { BlockSidebar } from '../[id]/edit/_components/block-sidebar';
import { EditorCanvas } from '../[id]/edit/_components/editor-canvas';
import { BlockSettingsPanel } from '../[id]/edit/_components/block-settings-panel';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function FooterEditorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const t = useTranslations('panel.pages');
  const [tenantSlug, setTenantSlug] = useState('');
  const [loading, setLoading] = useState(true);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    blocks,
    setBlocks,
    selectedBlockId,
    isDirty,
    isSaving,
    setIsSaving,
    markClean,
    devicePreview,
    setDevicePreview,
    undo,
    redo,
    getContent,
  } = usePageBuilderStore();

  useEffect(() => {
    const loadData = async () => {
      const user = getUserFromToken();
      if (!user) return;

      const token = getAccessToken();
      const tenantRes = await fetch(`${API_URL}/tenants/${user.tenantId}`);
      const tenant = await tenantRes.json();
      setTenantSlug(tenant.slug);

      const res = await fetch(`${API_URL}/global-sections/footer`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-tenant-slug': tenant.slug,
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.blocks) {
          setBlocks(data.blocks);
        } else {
          setBlocks([]);
        }
      } else {
        setBlocks([]);
      }
      setLoading(false);
    };

    loadData();
  }, [setBlocks]);

  const save = useCallback(async () => {
    if (!tenantSlug) return;
    setIsSaving(true);
    const token = getAccessToken();
    const content = getContent();

    await fetch(`${API_URL}/global-sections/footer`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'x-tenant-slug': tenantSlug,
      },
      body: JSON.stringify({ blocks: content.blocks }),
    });

    setIsSaving(false);
    markClean();
  }, [tenantSlug, setIsSaving, getContent, markClean]);

  // Auto-save
  useEffect(() => {
    if (!isDirty || !tenantSlug) return;
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(save, 3000);
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [isDirty, blocks, tenantSlug, save]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        redo();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        save();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo, save]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-2">
        <div className="flex items-center gap-3">
          <Link href={`/${locale}/panel/pages`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">{t('editFooter')}</h1>
          {isDirty && (
            <span className="text-xs text-amber-600">{t('unsaved')}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-gray-200 p-0.5">
            <Button
              variant={devicePreview === 'desktop' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setDevicePreview('desktop')}
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button
              variant={devicePreview === 'tablet' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setDevicePreview('tablet')}
            >
              <Tablet className="h-4 w-4" />
            </Button>
            <Button
              variant={devicePreview === 'mobile' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setDevicePreview('mobile')}
            >
              <Smartphone className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={save} disabled={!isDirty || isSaving} className="gap-2">
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {t('save')}
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex flex-1 overflow-hidden">
        <BlockSidebar />
        <EditorCanvas />
        {selectedBlockId && <BlockSettingsPanel locale={locale} />}
      </div>
    </div>
  );
}
