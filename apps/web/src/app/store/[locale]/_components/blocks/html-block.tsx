import type { Block } from '@zunapro/types';

interface HtmlProps {
  block: Block;
  locale: string;
}

export function HtmlBlock({ block, locale }: HtmlProps) {
  const props = block.props as {
    html?: Record<string, string> | string;
  };

  const raw = props.html;
  const html = typeof raw === 'string'
    ? raw
    : raw?.[locale] ?? raw?.en ?? '';
  if (!html) return null;

  return (
    <div dangerouslySetInnerHTML={{ __html: html }} />
  );
}
