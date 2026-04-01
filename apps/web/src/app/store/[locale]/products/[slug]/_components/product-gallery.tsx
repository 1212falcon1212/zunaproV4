'use client';

import { useState, useEffect } from 'react';

interface ProductGalleryProps {
  images: string[];
  productName: string;
  variantImages?: string[];
}

export function ProductGallery({ images, productName, variantImages }: ProductGalleryProps) {
  // When variant has its own images, show those; otherwise show product images
  const displayImages = variantImages && variantImages.length > 0 ? variantImages : images;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  // Reset to first image when the variant images change
  const imageKey = variantImages?.[0] ?? '';
  useEffect(() => {
    setSelectedIndex(0);
    setZoomed(false);
  }, [imageKey]);

  const currentImage = displayImages[selectedIndex];

  if (displayImages.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-[var(--radius)] bg-[var(--color-muted)]">
        <svg className="h-20 w-20 text-[var(--color-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div
        className="relative aspect-square cursor-zoom-in overflow-hidden rounded-[var(--radius)] bg-[var(--color-muted)]"
        onClick={() => setZoomed(!zoomed)}
      >
        <img
          src={currentImage}
          alt={productName}
          className={`h-full w-full object-cover transition-transform duration-300 ${zoomed ? 'scale-150' : 'scale-100'}`}
        />
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {displayImages.map((img, i) => (
            <button
              key={i}
              onClick={() => { setSelectedIndex(i); setZoomed(false); }}
              className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-[var(--radius)] border-2 ${
                i === selectedIndex ? 'border-[var(--color-primary)]' : 'border-transparent'
              }`}
            >
              <img src={img} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
