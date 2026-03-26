'use client';

import { useState, useEffect, useCallback } from 'react';

const WISHLIST_KEY = 'zunapro_wishlist';

export function useWishlist() {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      setItems([]);
    }
  }, []);

  const save = useCallback((newItems: string[]) => {
    setItems(newItems);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(newItems));
    window.dispatchEvent(new Event('wishlist-updated'));
  }, []);

  const toggle = useCallback((productId: string) => {
    setItems((prev) => {
      const next = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event('wishlist-updated'));
      return next;
    });
  }, []);

  const remove = useCallback((productId: string) => {
    save(items.filter((id) => id !== productId));
  }, [items, save]);

  const clear = useCallback(() => {
    save([]);
  }, [save]);

  const has = useCallback((productId: string) => items.includes(productId), [items]);

  return { items, count: items.length, toggle, remove, clear, has };
}

export function getWishlistCount(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const stored = localStorage.getItem(WISHLIST_KEY);
    return stored ? (JSON.parse(stored) as string[]).length : 0;
  } catch {
    return 0;
  }
}
