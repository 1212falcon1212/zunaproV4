'use client';

import { useEffect, useState } from 'react';
import { storeApi } from '@/lib/store-api';

interface CartResponse {
  items: unknown[];
}

export function CartBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    storeApi.get<CartResponse>('/cart')
      .then((cart) => setCount(cart.items?.length ?? 0))
      .catch(() => setCount(0));
  }, []);

  if (count === 0) return null;

  return (
    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-primary)] text-[10px] font-bold text-white">
      {count > 99 ? '99+' : count}
    </span>
  );
}
