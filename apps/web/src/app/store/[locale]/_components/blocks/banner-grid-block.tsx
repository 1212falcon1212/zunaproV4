'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import type { Block } from '@zunapro/types';

interface BannerSlide {
  id: string;
  image: string;
  title?: Record<string, string>;
  subtitle?: Record<string, string>;
  buttonText?: Record<string, string>;
  buttonLink?: string;
  textColor?: string;
  textPosition?: 'left' | 'center' | 'right';
  overlayOpacity?: number;
}

interface SideBanner {
  id: string;
  image: string;
  title?: Record<string, string>;
  subtitle?: Record<string, string>;
  buttonText?: Record<string, string>;
  buttonLink?: string;
  textColor?: string;
  countdown?: string;
}

interface BannerGridProps {
  block: Block;
  locale: string;
}

function resolveLink(link: string | undefined, locale: string): string {
  if (!link || link.startsWith('http') || link.startsWith('#')) return link || '#';
  const normalized = link.startsWith('/') ? link : `/${link}`;
  return `/store/${locale}${normalized === '/' ? '' : normalized}`;
}

function getLocalized(val: Record<string, string> | undefined, locale: string): string {
  if (!val) return '';
  return val[locale] ?? val['en'] ?? Object.values(val)[0] ?? '';
}

function CountdownTimer({ target }: { target: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = Math.max(0, new Date(target).getTime() - Date.now());
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [target]);

  return (
    <div className="flex gap-2">
      {[
        { value: timeLeft.days, label: 'Days' },
        { value: timeLeft.hours, label: 'Hr' },
        { value: timeLeft.minutes, label: 'Min' },
        { value: timeLeft.seconds, label: 'Sc' },
      ].map((item) => (
        <div key={item.label} className="flex flex-col items-center rounded-md bg-white/90 px-2.5 py-1.5 text-center shadow-sm">
          <span className="text-lg font-bold leading-tight text-[var(--color-foreground)]">{String(item.value).padStart(2, '0')}</span>
          <span className="text-[10px] text-[var(--color-secondary)]">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function BannerOverlay({ banner, locale, size = 'large' }: { banner: SideBanner; locale: string; size?: 'large' | 'small' }) {
  const isSmall = size === 'small';
  return (
    <div
      className="absolute inset-0 flex flex-col justify-center p-4 lg:p-6"
      style={{ color: banner.textColor ?? 'white' }}
    >
      {getLocalized(banner.title, locale) && (
        <h3
          className={`font-bold drop-shadow-md ${isSmall ? 'mb-1 text-base lg:text-lg' : 'mb-2 text-xl lg:text-2xl'}`}
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {getLocalized(banner.title, locale)}
        </h3>
      )}
      {getLocalized(banner.subtitle, locale) && (
        <p className={`opacity-90 drop-shadow-sm ${isSmall ? 'mb-2 text-xs' : 'mb-3 text-sm'}`}>{getLocalized(banner.subtitle, locale)}</p>
      )}
      {banner.countdown && <div className="mb-3"><CountdownTimer target={banner.countdown} /></div>}
      {getLocalized(banner.buttonText, locale) && banner.buttonLink && (
        <div>
          <Link
            href={resolveLink(banner.buttonLink, locale)}
            className={`inline-flex items-center rounded-md bg-[var(--color-foreground)] font-semibold text-[var(--color-background)] shadow-sm transition-colors hover:opacity-90 ${isSmall ? 'px-4 py-1.5 text-xs' : 'px-5 py-2 text-sm'}`}
          >
            {getLocalized(banner.buttonText, locale)}
          </Link>
        </div>
      )}
    </div>
  );
}

export function BannerGridBlock({ block, locale }: BannerGridProps) {
  const props = block.props as {
    slides?: BannerSlide[];
    sideBanners?: SideBanner[];
    autoplay?: boolean;
    autoplayInterval?: number;
    height?: string;
    gap?: string;
  };

  const slides = props.slides ?? [];
  const sideBanners = props.sideBanners ?? [];
  const autoplay = props.autoplay ?? true;
  const interval = props.autoplayInterval ?? 5000;
  const height = props.height ?? '560px';
  const gap = props.gap ?? '10px';

  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    if (slides.length <= 1) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    if (slides.length <= 1) return;
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (!autoplay || slides.length <= 1) return;
    const timer = setInterval(nextSlide, interval);
    return () => clearInterval(timer);
  }, [autoplay, interval, nextSlide, slides.length]);

  if (slides.length === 0 && sideBanners.length === 0) return null;

  const hasRight = sideBanners.length > 0;
  const topRight = sideBanners[0] ?? null;
  const bottomRight = sideBanners.slice(1, 3); // max 2 bottom banners

  /*
    CSS Grid with named areas:
    ┌─────────────┬─────────────┐
    │             │  top-right  │  ~55% height
    │  carousel   ├──────┬──────┤
    │             │ bl   │ br   │  ~45% height
    └─────────────┴──────┴──────┘
      ~55% width    ~45% width
  */

  const gridStyle: React.CSSProperties = hasRight
    ? {
        display: 'grid',
        gap,
        height,
        gridTemplateColumns: '55% 1fr',
        gridTemplateRows: bottomRight.length > 0 ? '1.2fr 1fr' : '1fr',
        gridTemplateAreas: bottomRight.length > 0
          ? `"carousel topright" "carousel bottomright"`
          : `"carousel topright"`,
      }
    : {
        display: 'grid',
        height,
      };

  return (
    <section className="mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-8">
      <div style={gridStyle}>
        {/* Main Carousel */}
        {slides.length > 0 && (
          <div className="relative overflow-hidden rounded-lg" style={{ gridArea: hasRight ? 'carousel' : undefined }}>
            {slides.map((slide, idx) => (
              <div
                key={slide.id}
                className="absolute inset-0 transition-opacity duration-500"
                style={{ opacity: idx === currentSlide ? 1 : 0, pointerEvents: idx === currentSlide ? 'auto' : 'none' }}
              >
                {slide.image && <img src={slide.image} alt={getLocalized(slide.title, locale)} className="h-full w-full object-cover" />}
                {(slide.overlayOpacity ?? 0) > 0 && (
                  <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${slide.overlayOpacity})` }} />
                )}
                <div
                  className="absolute inset-0 flex flex-col justify-end p-6 pb-16 lg:p-10 lg:pb-20"
                  style={{
                    alignItems: slide.textPosition === 'center' ? 'center' : slide.textPosition === 'right' ? 'flex-end' : 'flex-start',
                    textAlign: slide.textPosition ?? 'left',
                    color: slide.textColor ?? 'white',
                  }}
                >
                  {getLocalized(slide.title, locale) && (
                    <h2 className="mb-2 text-2xl font-bold drop-shadow-md sm:text-3xl lg:text-4xl" style={{ fontFamily: 'var(--font-heading)' }}>
                      {getLocalized(slide.title, locale)}
                    </h2>
                  )}
                  {getLocalized(slide.subtitle, locale) && (
                    <p className="mb-4 text-sm opacity-90 drop-shadow-sm sm:text-base">{getLocalized(slide.subtitle, locale)}</p>
                  )}
                  {getLocalized(slide.buttonText, locale) && slide.buttonLink && (
                    <Link
                      href={resolveLink(slide.buttonLink, locale)}
                      className="inline-flex items-center rounded-md bg-[var(--color-primary)] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:opacity-90"
                    >
                      {getLocalized(slide.buttonText, locale)}
                    </Link>
                  )}
                </div>
              </div>
            ))}
            {slides.length > 1 && (
              <>
                <button onClick={prevSlide} className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/70 p-2 text-[var(--color-foreground)] shadow hover:bg-white">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button onClick={nextSlide} className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/70 p-2 text-[var(--color-foreground)] shadow hover:bg-white">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
                <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
                  {slides.map((_, idx) => (
                    <button key={idx} onClick={() => setCurrentSlide(idx)} className={`h-2.5 w-2.5 rounded-full transition-colors ${idx === currentSlide ? 'bg-white' : 'bg-white/50'}`} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Top-right banner */}
        {topRight && (
          <div className="relative overflow-hidden rounded-lg" style={{ gridArea: 'topright' }}>
            {topRight.image && <img src={topRight.image} alt={getLocalized(topRight.title, locale)} className="h-full w-full object-cover" />}
            <BannerOverlay banner={topRight} locale={locale} size="large" />
          </div>
        )}

        {/* Bottom-right: 2 small banners side by side */}
        {bottomRight.length > 0 && (
          <div style={{ gridArea: 'bottomright', display: 'grid', gridTemplateColumns: `repeat(${bottomRight.length}, 1fr)`, gap }}>
            {bottomRight.map((banner) => (
              <div key={banner.id} className="relative overflow-hidden rounded-lg">
                {banner.image && <img src={banner.image} alt={getLocalized(banner.title, locale)} className="h-full w-full object-cover" />}
                <BannerOverlay banner={banner} locale={locale} size="small" />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
