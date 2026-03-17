'use client';

import { useTranslations } from 'next-intl';

interface Address {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
}

interface AddressStepProps {
  address: Address;
  onChange: (address: Address) => void;
  onNext: () => void;
}

export function AddressStep({ address, onChange, onNext }: AddressStepProps) {
  const t = useTranslations('storefront.checkout');

  const update = (field: keyof Address, value: string) => {
    onChange({ ...address, [field]: value });
  };

  const isValid =
    address.firstName &&
    address.lastName &&
    address.address1 &&
    address.city &&
    address.postalCode &&
    address.country;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">{t('shippingAddress')}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">{t('firstName')}</label>
          <input
            type="text"
            value={address.firstName}
            onChange={(e) => update('firstName', e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">{t('lastName')}</label>
          <input
            type="text"
            value={address.lastName}
            onChange={(e) => update('lastName', e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">{t('address')}</label>
        <input
          type="text"
          value={address.address1}
          onChange={(e) => update('address1', e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium">{t('city')}</label>
          <input
            type="text"
            value={address.city}
            onChange={(e) => update('city', e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">{t('postalCode')}</label>
          <input
            type="text"
            value={address.postalCode}
            onChange={(e) => update('postalCode', e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">{t('country')}</label>
          <input
            type="text"
            value={address.country}
            onChange={(e) => update('country', e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">{t('phone')}</label>
        <input
          type="tel"
          value={address.phone ?? ''}
          onChange={(e) => update('phone', e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div className="flex justify-end">
        <button
          onClick={onNext}
          disabled={!isValid}
          className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {t('continue')}
        </button>
      </div>
    </div>
  );
}
