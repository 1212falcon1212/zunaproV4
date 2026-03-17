'use client';

import { useTranslations } from 'next-intl';

interface PaymentStepProps {
  selected: string;
  onSelect: (method: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const paymentOptions = [
  {
    id: 'stripe',
    name: 'Credit/Debit Card',
    description: 'Pay securely with Stripe',
  },
  {
    id: 'iyzico',
    name: 'iyzico',
    description: 'Pay with iyzico payment form',
  },
  {
    id: 'bank_transfer',
    name: 'Bank Transfer',
    description: 'Pay via bank transfer',
  },
];

export function PaymentStep({
  selected,
  onSelect,
  onNext,
  onBack,
}: PaymentStepProps) {
  const t = useTranslations('storefront.checkout');

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">{t('paymentMethod')}</h2>
      <div className="space-y-3">
        {paymentOptions.map((option) => (
          <label
            key={option.id}
            className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
              selected === option.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="payment"
              value={option.id}
              checked={selected === option.id}
              onChange={() => onSelect(option.id)}
              className="h-4 w-4 text-blue-600"
            />
            <div>
              <p className="font-medium">{option.name}</p>
              <p className="text-sm text-gray-500">{option.description}</p>
            </div>
          </label>
        ))}
      </div>
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="rounded-lg border border-gray-200 px-6 py-2.5 text-sm font-medium hover:bg-gray-50"
        >
          {t('back')}
        </button>
        <button
          onClick={onNext}
          disabled={!selected}
          className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {t('reviewOrder')}
        </button>
      </div>
    </div>
  );
}
