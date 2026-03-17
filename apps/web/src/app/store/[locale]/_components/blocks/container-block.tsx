import type { Block } from '@zunapro/types';
import { BlockRenderer } from './block-renderer';

interface ContainerProps {
  block: Block;
  locale: string;
}

export function ContainerBlock({ block, locale }: ContainerProps) {
  const props = block.props as {
    fullWidth?: boolean;
  };

  return (
    <div
      className={
        props.fullWidth ? 'w-full' : 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'
      }
    >
      {block.children && block.children.length > 0 && (
        <BlockRenderer blocks={block.children} locale={locale} />
      )}
    </div>
  );
}
