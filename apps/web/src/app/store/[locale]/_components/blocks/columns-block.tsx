import type { Block } from '@zunapro/types';
import { BlockRenderer } from './block-renderer';

interface ColumnsProps {
  block: Block;
  locale: string;
}

const GRID_COLS: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
};

export function ColumnsBlock({ block, locale }: ColumnsProps) {
  const props = block.props as {
    columns?: number;
    gap?: string;
  };

  const columns = props.columns || 2;
  const gap = props.gap || '1.5rem';
  const gridClass = GRID_COLS[columns] || GRID_COLS[2];

  return (
    <div
      className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid ${gridClass}`}
      style={{ gap }}
    >
      {block.children?.map((child) => (
        <div key={child.id}>
          {child.children ? (
            <BlockRenderer blocks={child.children} locale={locale} />
          ) : (
            <BlockRenderer blocks={[child]} locale={locale} />
          )}
        </div>
      ))}
    </div>
  );
}
