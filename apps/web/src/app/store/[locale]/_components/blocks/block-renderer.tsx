import type { Block } from '@zunapro/types';
import { HeroBlock } from './hero-block';
import { TextBlock } from './text-block';
import { ImageBlock } from './image-block';
import { HtmlBlock } from './html-block';
import { ContainerBlock } from './container-block';
import { ColumnsBlock } from './columns-block';
import { ProductShowcaseBlock } from './product-showcase-block';
import { CategoryShowcaseBlock } from './category-showcase-block';
import { BannerBlock } from './banner-block';
import { SpacerBlock } from './spacer-block';
import { DividerBlock } from './divider-block';
import { ButtonBlock } from './button-block';
import { AccordionBlock } from './accordion-block';
import { NavigationMenuBlock } from './navigation-menu-block';
import { LogoBlock } from './logo-block';
import { SearchBarBlock } from './search-bar-block';
import { CartIconBlock } from './cart-icon-block';
import { SocialLinksBlock } from './social-links-block';
import { NewsletterBlock } from './newsletter-block';
import { ProductListingBlock } from './product-listing-block';
import { CategoryListingBlock } from './category-listing-block';
import { BannerGridBlock } from './banner-grid-block';
import { CategoryProductsBlock } from './category-products-block';
import { PromoBannersBlock } from './promo-banners-block';
import { ContactFormBlock } from './contact-form-block';
import { BlogPostsBlock } from './blog-posts-block';
import { TestimonialSliderBlock } from './testimonial-slider-block';
import { HeroSliderBlock } from './hero-slider-block';
import { PromoBannerBlock } from './promo-banner-block';
import { FeaturedProductsBlock } from './featured-products-block';
import { ProductsOfWeekBlock } from './products-of-week-block';

interface BlockRendererProps {
  blocks: Block[];
  locale: string;
}

const BLOCK_COMPONENTS: Record<
  string,
  React.ComponentType<{ block: Block; locale: string }>
> = {
  hero: HeroBlock,
  text: TextBlock,
  image: ImageBlock,
  html: HtmlBlock,
  container: ContainerBlock,
  columns: ColumnsBlock,
  'product-showcase': ProductShowcaseBlock,
  'category-showcase': CategoryShowcaseBlock,
  banner: BannerBlock,
  spacer: SpacerBlock,
  divider: DividerBlock,
  button: ButtonBlock,
  accordion: AccordionBlock,
  'navigation-menu': NavigationMenuBlock,
  logo: LogoBlock,
  'search-bar': SearchBarBlock,
  'cart-icon': CartIconBlock,
  'social-links': SocialLinksBlock,
  newsletter: NewsletterBlock,
  'product-listing': ProductListingBlock,
  'category-listing': CategoryListingBlock,
  'banner-grid': BannerGridBlock,
  'category-products': CategoryProductsBlock,
  'promo-banners': PromoBannersBlock,
  'contact-form': ContactFormBlock,
  'blog-posts': BlogPostsBlock,
  'testimonial-slider': TestimonialSliderBlock,
  'hero-slider': HeroSliderBlock,
  'promo-banner': PromoBannerBlock,
  'featured-products': FeaturedProductsBlock,
  'products-of-week': ProductsOfWeekBlock,
};

export function BlockRenderer({ blocks, locale }: BlockRendererProps) {
  return (
    <>
      {blocks.map((block) => (
        <RenderBlock key={block.id} block={block} locale={locale} />
      ))}
    </>
  );
}

export function RenderBlock({
  block,
  locale,
}: {
  block: Block;
  locale: string;
}) {
  if (block.visibility) {
    const hasVisibleDevice =
      block.visibility.desktop ||
      block.visibility.tablet ||
      block.visibility.mobile;
    if (!hasVisibleDevice) return null;
  }

  const Component = BLOCK_COMPONENTS[block.type];
  if (!Component) return null;

  const style = blockStyleToCss(block.style);

  return (
    <div style={style} data-block-id={block.id} data-block-type={block.type}>
      <Component block={block} locale={locale} />
    </div>
  );
}

function blockStyleToCss(
  style?: Block['style'],
): React.CSSProperties | undefined {
  if (!style) return undefined;

  const css: React.CSSProperties = {};
  if (style.padding) css.padding = style.padding;
  if (style.margin) css.margin = style.margin;
  if (style.backgroundColor) css.backgroundColor = style.backgroundColor;
  if (style.textColor) css.color = style.textColor;
  if (style.borderRadius) css.borderRadius = style.borderRadius;
  if (style.maxWidth) {
    css.maxWidth = style.maxWidth;
    css.marginLeft = 'auto';
    css.marginRight = 'auto';
  }
  if (style.textAlign) css.textAlign = style.textAlign;

  return Object.keys(css).length > 0 ? css : undefined;
}
