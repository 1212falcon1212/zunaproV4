'use client';

import type { Block } from '@zunapro/types';

interface PromoBannerBlockProps {
  block: Block;
  locale: string;
}

export function PromoBannerBlock({ block, locale }: PromoBannerBlockProps) {
  const {
    text = 'Sınırlı süreli teklif',
    backgroundColor = '#FF6B35',
    textColor = '#FFFFFF',
    scrolling = true,
  } = block.props as {
    text?: string;
    backgroundColor?: string;
    textColor?: string;
    scrolling?: boolean;
  };

  return (
    <div
      className="relative overflow-hidden py-3"
      style={{ backgroundColor }}
    >
      <div className={scrolling ? 'animate-scroll-left' : ''}>
        <div className="flex gap-12 whitespace-nowrap">
          {Array.from({ length: 20 }).map((_, i) => (
            <span
              key={i}
              className="text-sm font-bold uppercase tracking-wider"
              style={{ color: textColor }}
            >
              {text}
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll-left {
          animation: scroll-left 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
