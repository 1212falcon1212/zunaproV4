'use client';

import type { Block } from '@zunapro/types';
import { useState, useEffect } from 'react';

interface HeroSliderBlockProps {
  block: Block;
  locale: string;
}

export function HeroSliderBlock({ block, locale }: HeroSliderBlockProps) {
  const {
    slides = [],
    autoplay = true,
    interval = 5000,
  } = block.props as {
    slides?: Array<{
      badge?: string;
      title: string;
      description: string;
      image?: string;
      primaryButtonText?: string;
      secondaryButtonText?: string;
      price?: string;
      discount?: string;
    }>;
    autoplay?: boolean;
    interval?: number;
  };

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!autoplay || slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, interval);
    return () => clearInterval(timer);
  }, [autoplay, interval, slides.length]);

  if (!slides || slides.length === 0) return null;

  const slide = slides[currentSlide];

  return (
    <section className="relative bg-white py-4 md:py-8 lg:py-12">
      <div className="container mx-auto px-4 lg:px-6 max-w-[1750px]">
        <div className="relative bg-[#fcf1ef] rounded-[40px] md:rounded-[50px] min-h-[500px] md:min-h-[600px] lg:min-h-[700px] flex items-center border-[8px] md:border-[16px] border-white shadow-2xl shadow-pink-100/60 outline outline-2 outline-pink-200/50 overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full px-8 md:px-20 py-16">
            <div className="space-y-6 z-10 order-2 lg:order-1">
              {slide.discount && (
                <div className="inline-flex items-center gap-2 bg-red-500/10 px-4 py-1.5 rounded-full">
                  <span className="text-[13px] font-bold text-red-500 tracking-wide">
                    {slide.discount}
                  </span>
                </div>
              )}

              {slide.badge && (
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></div>
                  <span className="text-[13px] font-bold text-gray-700 tracking-wider uppercase">
                    {slide.badge}
                  </span>
                </div>
              )}

              <h1 className="text-4xl md:text-5xl lg:text-[72px] font-bold text-gray-900 leading-[1.05] tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                {slide.title}
              </h1>

              <p className="text-base text-gray-600 max-w-xl leading-relaxed opacity-90">
                {slide.description}
              </p>

              {slide.price && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 uppercase tracking-wider">Fiyat</span>
                  <span className="text-2xl font-bold text-gray-900">{slide.price}</span>
                </div>
              )}

              <div className="flex flex-wrap gap-4 pt-2">
                <button className="bg-[#ff4d4d] text-white text-[14px] font-bold rounded-full hover:bg-black transition-all duration-500 shadow-xl shadow-red-100 uppercase tracking-widest px-10 py-4">
                  {slide.primaryButtonText || 'Sepete Ekle'}
                </button>
                <button className="bg-white text-gray-900 text-[14px] font-bold rounded-full hover:bg-gray-900 hover:text-white transition-all duration-500 border border-gray-200 shadow-lg px-10 py-4">
                  {slide.secondaryButtonText || 'Şimdi İncele'}
                </button>
              </div>
            </div>

            <div className="relative order-1 lg:order-2 flex justify-center items-center h-[350px] md:h-[500px] lg:h-[650px]">
              {/* Sarı glow efekti */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(255,210,50,0.55) 0%, rgba(255,180,0,0.3) 30%, rgba(255,150,0,0.1) 55%, transparent 75%)' }} />
              <div className="relative z-10 transform transition-transform duration-700 hover:scale-105">
                <img
                  src={slide.image || '/placeholder-hero.jpg'}
                  alt={slide.title}
                  className="w-full h-auto max-w-[300px] md:max-w-md lg:max-w-lg mx-auto drop-shadow-[0_35px_60px_rgba(0,0,0,0.2)]"
                />
              </div>
            </div>
          </div>

          {slides.length > 1 && (
            <div className="absolute bottom-10 right-12 md:right-24 flex gap-3 z-30">
              {slides.map((_: unknown, index: number) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2.5 rounded-full transition-all duration-500 ${
                    index === currentSlide
                      ? 'bg-red-500 w-10'
                      : 'bg-gray-300 hover:bg-gray-400 w-2.5'
                  }`}
                  aria-label={`Slayt ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Ticker / Kayan Banner */}
      <div className="mt-12 md:mt-24 bg-gradient-to-r from-[#de4232] via-[#ff8c00] to-[#ffd700] h-24 md:h-28 flex items-center overflow-hidden shadow-inner">
        <div className="flex animate-marquee whitespace-nowrap py-8">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="flex items-center mx-10 text-white font-bold uppercase tracking-[0.15em] text-sm md:text-[17px]">
              <span className="mr-5 text-2xl">★</span>
              SINIRLI SÜRELİK TEKLİF - TÜM ÜRÜNLERDE %59 İNDİRİM
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
