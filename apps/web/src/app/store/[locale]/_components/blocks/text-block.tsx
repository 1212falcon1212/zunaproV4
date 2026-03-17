import type { Block } from '@zunapro/types';

interface TextProps {
  block: Block;
  locale: string;
}

export function TextBlock({ block, locale }: TextProps) {
  const props = block.props as {
    content?: Record<string, string>;
    tag?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  };

  const content = props.content?.[locale] ?? props.content?.en ?? '';
  const Tag = props.tag || 'p';

  const isHeading = Tag.startsWith('h');

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <Tag
        className={
          isHeading
            ? 'font-bold text-[var(--color-foreground)]'
            : 'text-[var(--color-foreground)]/80 leading-relaxed'
        }
        style={isHeading ? { fontFamily: 'var(--font-heading)' } : undefined}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
