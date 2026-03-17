import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

interface StoreFooterProps {
  locale: string;
  storeName?: string;
}

export async function StoreFooter({ locale, storeName }: StoreFooterProps) {
  const t = await getTranslations('storefront');

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-foreground)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
              {storeName ?? 'Store'}
            </h3>
            <p className="mt-2 text-sm text-gray-400">
              {t('footer.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
              {t('footer.quickLinks')}
            </h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href={`/store/${locale}/products`} className="text-sm text-gray-400 hover:text-white">
                  {t('header.allProducts')}
                </Link>
              </li>
              <li>
                <Link href={`/store/${locale}/categories`} className="text-sm text-gray-400 hover:text-white">
                  {t('categories')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
              {t('footer.customerService')}
            </h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href={`/store/${locale}/pages/contact`} className="text-sm text-gray-400 hover:text-white">
                  {t('footer.contact')}
                </Link>
              </li>
              <li>
                <Link href={`/store/${locale}/pages/shipping-policy`} className="text-sm text-gray-400 hover:text-white">
                  {t('footer.shippingPolicy')}
                </Link>
              </li>
              <li>
                <Link href={`/store/${locale}/pages/returns`} className="text-sm text-gray-400 hover:text-white">
                  {t('footer.returns')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
              {t('footer.legal')}
            </h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href={`/store/${locale}/pages/privacy`} className="text-sm text-gray-400 hover:text-white">
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link href={`/store/${locale}/pages/terms`} className="text-sm text-gray-400 hover:text-white">
                  {t('footer.terms')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-700 pt-8 text-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} {storeName ?? 'Store'}. {t('footer.allRightsReserved')}
          </p>
        </div>
      </div>
    </footer>
  );
}
