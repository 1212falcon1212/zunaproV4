'use client';

import { useTranslations } from 'next-intl';
import { useCurrency } from '../../_components/hooks/use-currency';

interface ShippingStepProps {
  selected: string;
  onSelect: (method: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const shippingOptions = [
  { id: 'yurtici', name: 'Yurtici Kargo', estimatedDays: '2-3', cost: 25 },
  { id: 'aras', name: 'Aras Kargo', estimatedDays: '1-2', cost: 22 },
  { id: 'mng', name: 'MNG Kargo', estimatedDays: '2-3', cost: 20 },
];

export function ShippingStep({
  selected,
  onSelect,
  onNext,
  onBack,
}: ShippingStepProps) {
  const t = useTranslations('storefront.checkout');
  const { formatPrice } = useCurrency();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">{t('shippingMethod')}</h2>
      <div className="space-y-3">
        {shippingOptions.map((option) => (
          <label
            key={option.id}
            className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors ${
              selected === option.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="shipping"
                value={option.id}
                checked={selected === option.id}
                onChange={() => onSelect(option.id)}
                className="h-4 w-4 text-blue-600"
              />
              <div>
                <p className="font-medium">{option.name}</p>
                <p className="text-sm text-gray-500">
                  {t('estimatedDays', { days: option.estimatedDays })}
                </p>
              </div>
            </div>
            <span className="font-medium">{formatPrice(option.cost)}</span>
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
          {t('continue')}
        </button>
      </div>
    </div>
  );
}
