'use client';

import { useState, useCallback } from 'react';
import { ProductGallery } from './product-gallery';
import { ProductInfo } from './product-info';
import { AddToCartForm } from './add-to-cart-form';
import { ShareButton } from './share-button';
import { useTranslations } from 'next-intl';
import type { ProductVariantDisplay } from './variant-selector';

interface ProductData {
  id: string;
  name: Record<string, string>;
  slug: string;
  description?: Record<string, string> | null;
  price: string | number;
  compareAtPrice?: string | number | null;
  sku?: string | null;
  stock: number;
  images: string[];
  productVariants: ProductVariantDisplay[];
}

interface ProductDetailClientProps {
  product: ProductData;
  locale: string;
}

export function ProductDetailClient({ product, locale }: ProductDetailClientProps) {
  const t = useTranslations('storefront');
  const [selectedVariant, setSelectedVariant] = useState<ProductVariantDisplay | null>(null);

  const handleVariantChange = useCallback((variant: ProductVariantDisplay | null) => {
    setSelectedVariant(variant);
  }, []);

  const variantImages = selectedVariant?.images && selectedVariant.images.length > 0
    ? selectedVariant.images
    : undefined;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      {/* Gallery */}
      <ProductGallery
        images={product.images}
        productName={product.name[locale] ?? product.name.en ?? ''}
        variantImages={variantImages}
      />

      {/* Product info + cart form */}
      <div>
        <ProductInfo
          product={product}
          locale={locale}
          selectedVariant={selectedVariant}
        />
        <AddToCartForm
          productId={product.id}
          productVariants={product.productVariants ?? []}
          baseStock={product.stock}
          locale={locale}
          onVariantChange={handleVariantChange}
        />

        {/* Share */}
        <div className="mt-6 flex items-center gap-2 border-t border-[var(--color-border)] pt-6">
          <span className="text-sm text-[var(--color-secondary)]">{t('product.share')}:</span>
          <ShareButton />
        </div>
      </div>
    </div>
  );
}
