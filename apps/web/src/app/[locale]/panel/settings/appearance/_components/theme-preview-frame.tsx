'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';

interface ThemePreviewFrameProps {
  config: Record<string, unknown>;
  storeUrl?: string;
}

export function ThemePreviewFrame({ config, storeUrl }: ThemePreviewFrameProps) {
  const t = useTranslations('panel.settings.appearance');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Send config updates to iframe
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;

    iframe.contentWindow.postMessage(
      { type: 'theme-preview-update', config },
      '*',
    );
  }, [config]);

  const previewUrl = storeUrl
    ? `${storeUrl}?preview=true`
    : '/store/en?preview=true';

  return (
    <div className="overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b bg-gray-50 px-4 py-2">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-red-400" />
          <span className="h-3 w-3 rounded-full bg-yellow-400" />
          <span className="h-3 w-3 rounded-full bg-green-400" />
        </div>
        <span className="flex-1 text-center text-xs text-gray-500">{t('preview')}</span>
      </div>
      <iframe
        ref={iframeRef}
        src={previewUrl}
        className="h-[600px] w-full"
        title={t('preview')}
      />
    </div>
  );
}
