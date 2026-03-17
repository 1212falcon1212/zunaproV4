'use client';

import { useEffect, useState } from 'react';
import { BlockRenderer } from '../../_components/blocks/block-renderer';
import type { PageContent } from '@zunapro/types';

export default function PreviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const [content, setContent] = useState<PageContent | null>(null);
  const [locale, setLocale] = useState('en');

  useEffect(() => {
    params.then((p) => setLocale(p.locale));
  }, [params]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'page-builder-preview') {
        setContent(event.data.content as PageContent);
      }
    };

    window.addEventListener('message', handleMessage);

    // Signal to parent that preview is ready
    window.parent.postMessage({ type: 'page-builder-preview-ready' }, '*');

    return () => window.removeEventListener('message', handleMessage);
  }, []);

  if (!content || !content.blocks || content.blocks.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-400">
        <p>Waiting for preview data...</p>
      </div>
    );
  }

  return (
    <div>
      <BlockRenderer blocks={content.blocks} locale={locale} />
    </div>
  );
}
