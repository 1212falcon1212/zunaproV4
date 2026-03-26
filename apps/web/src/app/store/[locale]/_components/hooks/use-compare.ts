'use client';

import { useState, useEffect, useCallback } from 'react';

const COMPARE_KEY = 'zunapro_compare';
const MAX_COMPARE = 4;

export function useCompare() {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(COMPARE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      setItems([]);
    }
  }, []);

  const save = useCallback((newItems: string[]) => {
    setItems(newItems);
    localStorage.setItem(COMPARE_KEY, JSON.stringify(newItems));
    window.dispatchEvent(new Event('compare-updated'));
  }, []);

  const toggle = useCallback((productId: string) => {
    setItems((prev) => {
      if (prev.includes(productId)) {
        const next = prev.filter((id) => id !== productId);
        localStorage.setItem(COMPARE_KEY, JSON.stringify(next));
        window.dispatchEvent(new Event('compare-updated'));
        return next;
      }
      if (prev.length >= MAX_COMPARE) return prev;
      const next = [...prev, productId];
      localStorage.setItem(COMPARE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event('compare-updated'));
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

  return { items, count: items.length, toggle, remove, clear, has, maxItems: MAX_COMPARE };
}

export function getCompareCount(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const stored = localStorage.getItem(COMPARE_KEY);
    return stored ? (JSON.parse(stored) as string[]).length : 0;
  } catch {
    return 0;
  }
}
