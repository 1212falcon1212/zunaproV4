import { HeroSection } from '../../_components/hero-section';
import { CategoriesGrid } from '../../_components/categories-grid';
import { FeaturedProducts } from '../../_components/featured-products';
import { BrandFilter } from './brand-filter';
import { FeatureComparison } from './feature-comparison';

interface TeknolojiHomepageProps {
  locale: string;
}

export function TeknolojiHomepage({ locale }: TeknolojiHomepageProps) {
  return (
    <div>
      <HeroSection locale={locale} />
      <BrandFilter locale={locale} />
      <FeaturedProducts locale={locale} />
      <FeatureComparison locale={locale} />
      <CategoriesGrid locale={locale} />
    </div>
  );
}
