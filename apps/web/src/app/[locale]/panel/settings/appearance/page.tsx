'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { ThemeEditor } from './_components/theme-editor';
import { ThemePreviewFrame } from './_components/theme-preview-frame';

export default function AppearancePage() {
  const t = useTranslations('panel.settings.appearance');
  const [previewConfig, setPreviewConfig] = useState<Record<string, unknown>>({});

  const handleConfigChange = useCallback((config: Record<string, unknown>) => {
    setPreviewConfig(config);
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">{t('themeEditor')}</h1>
        <p className="mt-1 text-sm text-slate-500">{t('themeEditorDescription')}</p>
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
        {/* Editor */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <ThemeEditor onConfigChange={handleConfigChange} />
        </div>

        {/* Preview */}
        <div className="sticky top-8">
          <ThemePreviewFrame config={previewConfig} />
        </div>
      </div>
    </div>
  );
}
