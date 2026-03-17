import type { Block } from '@zunapro/types';

interface SpacerProps {
  block: Block;
  locale: string;
}

export function SpacerBlock({ block }: SpacerProps) {
  const props = block.props as {
    height?: string;
  };

  return <div style={{ height: props.height || '2rem' }} aria-hidden="true" />;
}
