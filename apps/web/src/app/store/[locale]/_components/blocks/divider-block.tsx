import type { Block } from '@zunapro/types';

interface DividerProps {
  block: Block;
  locale: string;
}

export function DividerBlock({ block }: DividerProps) {
  const props = block.props as {
    color?: string;
    width?: string;
    thickness?: string;
    style?: 'solid' | 'dashed' | 'dotted';
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <hr
        style={{
          borderColor: props.color || 'var(--color-border)',
          borderWidth: props.thickness || '1px',
          borderStyle: props.style || 'solid',
          maxWidth: props.width || '100%',
          margin: '0 auto',
        }}
      />
    </div>
  );
}
