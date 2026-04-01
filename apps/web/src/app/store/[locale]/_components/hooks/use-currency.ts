'use client';

import { useState, useEffect, useCallback } from 'react';

const CURRENCY_SYMBOLS: Record<string, string> = {
  TRY: '₺',
  USD: '$',
  EUR: '€',
  GBP: '£',
};

const CURRENCY_LOCALES: Record<string, string> = {
  TRY: 'tr-TR',
  USD: 'en-US',
  EUR: 'de-DE',
  GBP: 'en-GB',
};

export function useCurrency() {
  const [currency, setCurrency] = useState('USD');

  useEffect(() => {
    const stored = localStorage.getItem('zunapro_currency');
    if (stored) setCurrency(stored);

    const handleChange = () => {
      const updated = localStorage.getItem('zunapro_currency');
      if (updated) setCurrency(updated);
    };

    window.addEventListener('currency-changed', handleChange);
    window.addEventListener('storage', handleChange);
    return () => {
      window.removeEventListener('currency-changed', handleChange);
      window.removeEventListener('storage', handleChange);
    };
  }, []);

  const formatPrice = useCallback(
    (amount: number | string) => {
      const num = typeof amount === 'string' ? parseFloat(amount) : amount;
      if (isNaN(num)) return `${CURRENCY_SYMBOLS[currency] || currency} 0.00`;

      const loc = CURRENCY_LOCALES[currency] || 'en-US';
      return new Intl.NumberFormat(loc, {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(num);
    },
    [currency],
  );

  const symbol = CURRENCY_SYMBOLS[currency] || currency;

  return { currency, formatPrice, symbol };
}
