import type { Block } from '@zunapro/types';

interface HtmlProps {
  block: Block;
  locale: string;
}

export function HtmlBlock({ block, locale }: HtmlProps) {
  const props = block.props as {
    html?: Record<string, string>;
  };

  const html = props.html?.[locale] ?? props.html?.en ?? '';
  if (!html) return null;

  return (
    <div
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 prose prose-lg max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
