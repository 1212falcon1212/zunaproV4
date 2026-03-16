export interface PageContent {
  version: 1;
  blocks: Block[];
}

export interface Block {
  id: string;
  type: BlockType;
  props: Record<string, unknown>;
  style?: BlockStyle;
  children?: Block[];
  visibility?: { desktop: boolean; tablet: boolean; mobile: boolean };
}

export type BlockType =
  | 'hero'
  | 'text'
  | 'image'
  | 'html'
  | 'container'
  | 'columns'
  | 'product-showcase'
  | 'category-showcase'
  | 'banner'
  | 'spacer'
  | 'divider'
  | 'button'
  | 'accordion'
  | 'blog-posts'
  | 'navigation-menu'
  | 'logo'
  | 'search-bar'
  | 'cart-icon'
  | 'social-links'
  | 'newsletter'
  | 'product-listing'
  | 'category-listing';

export interface BlockStyle {
  padding?: string;
  margin?: string;
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: string;
  maxWidth?: string;
  textAlign?: 'left' | 'center' | 'right';
  customCss?: string;
}
