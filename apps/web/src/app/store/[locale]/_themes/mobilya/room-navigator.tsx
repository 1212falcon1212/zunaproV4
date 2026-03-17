'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

const ROOMS = [
  { id: 'living-room', icon: '🛋️', categorySlug: 'living-room' },
  { id: 'bedroom', icon: '🛏️', categorySlug: 'bedroom' },
  { id: 'dining-room', icon: '🪑', categorySlug: 'dining-room' },
  { id: 'office', icon: '🖥️', categorySlug: 'office' },
  { id: 'kitchen', icon: '🍳', categorySlug: 'kitchen' },
  { id: 'bathroom', icon: '🚿', categorySlug: 'bathroom' },
];

interface RoomNavigatorProps {
  locale: string;
}

export function RoomNavigator({ locale }: RoomNavigatorProps) {
  const t = useTranslations('storefront.themes.mobilya');
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);

  return (
    <section className="bg-[var(--color-muted)]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2
          className="text-center text-2xl font-bold text-[var(--color-foreground)] sm:text-3xl"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {t('rooms')}
        </h2>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {ROOMS.map((room) => (
            <Link
              key={room.id}
              href={`/store/${locale}/categories/${room.categorySlug}`}
              onMouseEnter={() => setHoveredRoom(room.id)}
              onMouseLeave={() => setHoveredRoom(null)}
              className={`flex flex-col items-center gap-3 rounded-xl border-2 bg-[var(--color-background)] p-6 text-center transition-all ${
                hoveredRoom === room.id
                  ? 'border-[var(--color-primary)] shadow-lg'
                  : 'border-transparent shadow-sm'
              }`}
            >
              <span className="text-4xl">{room.icon}</span>
              <span className="text-sm font-medium text-[var(--color-foreground)]">
                {t(`room.${room.id}`)}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
