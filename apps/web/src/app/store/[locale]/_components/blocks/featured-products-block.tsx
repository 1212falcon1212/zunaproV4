'use client';

import { useState } from 'react';
import type { Block } from '@zunapro/types';

interface FeaturedProductsBlockProps {
  block: Block;
  locale: string;
}

export function FeaturedProductsBlock({ block, locale }: FeaturedProductsBlockProps) {
  const {
    title = 'ÖNE ÇIKAN ÜRÜNLER',
    subtitle = 'Öne Çıkan Ürünlerimiz',
    columns = 4,
    products = [],
    tabs = [],
  } = block.props as {
    title?: string;
    subtitle?: string;
    columns?: number;
    products?: Array<{
      name: string;
      price: string;
      oldPrice?: string;
      badge?: string;
      image?: string;
      category?: string;
      rating?: number;
      reviews?: number;
    }>;
    tabs?: string[];
  };

  const [activeTab, setActiveTab] = useState(0);

  // Tab'lar varsa filtreleme yap
  const filteredProducts = tabs.length > 0 && activeTab > 0
    ? products.filter(p => p.category === tabs[activeTab])
    : products;

  return (
    <section className="py-12 px-4 bg-white">
      <div className="container mx-auto max-w-[1300px]">
        {/* Section Header */}
        <div className="text-center mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-red-500 mb-2">
            {title}
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            {subtitle}
          </h2>
        </div>

        {/* Tabs */}
        {tabs.length > 0 && (
          <div className="flex justify-center gap-2 mb-8 flex-wrap">
            {tabs.map((tab, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === idx
                    ? 'bg-red-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        )}

        {/* Products Grid */}
        <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-${columns} gap-4`}>
          {filteredProducts.map((product, index) => (
            <div
              key={index}
              className="group relative bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              {/* Badge */}
              {product.badge && (
                <div className="absolute top-3 left-3 z-10">
                  <span className="px-2.5 py-1 bg-red-500 text-white text-[10px] font-bold rounded-md uppercase">
                    {product.badge}
                  </span>
                </div>
              )}

              {/* Product Image */}
              <div className="relative aspect-square bg-gray-50 overflow-hidden">
                <img
                  src={product.image || '/placeholder.jpg'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Quick Actions */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-3 group-hover:translate-y-0">
                  <button className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-500 hover:text-white transition-colors" title="Hızlı Bakış">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                  <button className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-500 hover:text-white transition-colors" title="Favorilere Ekle">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                  <button className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-500 hover:text-white transition-colors" title="Sepete Ekle">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-1">
                  {product.name}
                </h3>
                
                {/* Rating */}
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-3.5 h-3.5 ${i < (product.rating || 5) ? 'text-yellow-400' : 'text-gray-200'} fill-current`} viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                  {product.reviews !== undefined && (
                    <span className="text-xs text-gray-400">({product.reviews})</span>
                  )}
                </div>

                {/* Price */}
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-red-500">
                    ${product.price}
                  </span>
                  {product.oldPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      ${product.oldPrice}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
