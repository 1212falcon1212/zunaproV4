'use client';

import type { Block } from '@zunapro/types';
import { useState, useEffect, useCallback } from 'react';

interface TestimonialSliderBlockProps {
  block: Block;
  locale: string;
}

export function TestimonialSliderBlock({ block, locale }: TestimonialSliderBlockProps) {
  const {
    title = 'Müşteri Yorumları',
    subtitle = 'Müşterilerimiz Ne Diyor',
    testimonials = [],
  } = block.props as {
    title?: string;
    subtitle?: string;
    testimonials?: Array<{
      text: string;
      name: string;
      role: string;
      avatar?: string;
    }>;
  };

  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 3;

  const nextSlide = useCallback(() => {
    setStartIndex((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  useEffect(() => {
    if (testimonials.length <= visibleCount) return;
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide, testimonials.length]);

  if (!testimonials || testimonials.length === 0) return null;

  const getVisibleTestimonials = () => {
    const result = [];
    for (let i = 0; i < Math.min(visibleCount, testimonials.length); i++) {
      result.push(testimonials[(startIndex + i) % testimonials.length]);
    }
    return result;
  };

  const visible = getVisibleTestimonials();

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-[1300px]">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-2">
            {title}
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            {subtitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visible.map((testimonial, idx) => (
            <div
              key={`${startIndex}-${idx}`}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 transition-all duration-500 hover:shadow-md"
            >
              {/* Yıldızlar */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>

              {/* Yorum Metni */}
              <p className="text-sm text-gray-600 leading-relaxed mb-6 min-h-[80px]">
                {testimonial.text}
              </p>

              {/* Kişi Bilgisi */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 ring-2 ring-red-100">
                  <img
                    src={testimonial.avatar || '/placeholder-avatar.jpg'}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">{testimonial.name}</h4>
                  <p className="text-xs text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {testimonials.length > visibleCount && (
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setStartIndex(idx)}
                className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                  idx === startIndex
                    ? 'bg-red-500 w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Yorum ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
