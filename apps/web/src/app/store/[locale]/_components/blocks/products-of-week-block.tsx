'use client';

import type { Block } from '@zunapro/types';

interface ProductsOfWeekBlockProps {
  block: Block;
  locale: string;
}

export function ProductsOfWeekBlock({ block, locale }: ProductsOfWeekBlockProps) {
  const {
    title = 'Haftanın Ürünleri',
    subtitle = 'Gibi Satış',
    buttonText = 'Alışverişe Başla',
    image = '',
    backgroundColor = '#FF6B35',
  } = block.props as {
    title?: string;
    subtitle?: string;
    buttonText?: string;
    image?: string;
    backgroundColor?: string;
  };

  return (
    <section className="py-8 px-4">
      <div className="container mx-auto">
        <div 
          className="rounded-2xl overflow-hidden flex items-center justify-between p-8 md:p-12"
          style={{ backgroundColor }}
        >
          <div className="flex-1 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">{title}</h2>
            <p className="text-lg mb-6">{subtitle}</p>
            <button className="px-6 py-3 bg-white text-gray-900 font-semibold rounded hover:bg-gray-100 transition-colors">
              {buttonText}
            </button>
          </div>
          {image && (
            <div className="hidden md:block flex-1">
              <img 
                src={image} 
                alt={title}
                className="w-full h-auto max-w-md ml-auto"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
