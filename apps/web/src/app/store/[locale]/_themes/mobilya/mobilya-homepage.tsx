import { HeroSection } from '../../_components/hero-section';
import { CategoriesGrid } from '../../_components/categories-grid';
import { FeaturedProducts } from '../../_components/featured-products';
import { RoomNavigator } from './room-navigator';
import { MaterialFilter } from './material-filter';

interface MobilyaHomepageProps {
  locale: string;
}

export function MobilyaHomepage({ locale }: MobilyaHomepageProps) {
  return (
    <div>
      <HeroSection locale={locale} />
      <RoomNavigator locale={locale} />
      <FeaturedProducts locale={locale} />
      <MaterialFilter locale={locale} />
      <CategoriesGrid locale={locale} />
    </div>
  );
}
