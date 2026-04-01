'use client';

import { useTranslations } from 'next-intl';
import { useCurrency } from '../../_components/hooks/use-currency';

interface CartItem {
  productId: string;
  name: Record<string, string>;
  slug: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Address {
  firstName: string;
  lastName: string;
  address1: string;
  city: string;
  postalCode: string;
  country: string;
}

interface ReviewStepProps {
  items: CartItem[];
  address: Address;
  shippingMethod: string;
  paymentMethod: string;
  locale: string;
  submitting: boolean;
  onSubmit: () => void;
  onBack: () => void;
}

export function ReviewStep({
  items,
  address,
  shippingMethod,
  paymentMethod,
  locale,
  submitting,
  onSubmit,
  onBack,
}: ReviewStepProps) {
  const t = useTranslations('storefront.checkout');
  const { formatPrice } = useCurrency();
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">{t('review')}</h2>

      {/* Items */}
      <div className="rounded-lg border border-gray-200">
        <div className="border-b bg-gray-50 px-4 py-3 text-sm font-medium">
          {t('orderItems')}
        </div>
        <div className="divide-y">
          {items.map((item) => (
            <div key={item.productId} className="flex items-center gap-4 p-4">
              {item.image && (
                <img
                  src={item.image}
                  alt=""
                  className="h-12 w-12 rounded object-cover"
                />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {item.name[locale] || Object.values(item.name)[0]}
                </p>
                <p className="text-xs text-gray-500">x{item.quantity}</p>
              </div>
              <p className="text-sm font-medium">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>
        <div className="border-t bg-gray-50 px-4 py-3">
          <div className="flex justify-between font-bold">
            <span>{t('subtotal')}</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
        </div>
      </div>

      {/* Shipping address */}
      <div className="rounded-lg border border-gray-200 p-4">
        <h3 className="mb-2 text-sm font-medium">{t('shippingAddress')}</h3>
        <p className="text-sm text-gray-600">
          {address.firstName} {address.lastName}
          <br />
          {address.address1}
          <br />
          {address.city} {address.postalCode}
          <br />
          {address.country}
        </p>
      </div>

      {/* Methods */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-gray-200 p-4">
          <h3 className="mb-1 text-sm font-medium">{t('shippingMethod')}</h3>
          <p className="text-sm capitalize text-gray-600">{shippingMethod}</p>
        </div>
        <div className="rounded-lg border border-gray-200 p-4">
          <h3 className="mb-1 text-sm font-medium">{t('paymentMethod')}</h3>
          <p className="text-sm capitalize text-gray-600">
            {paymentMethod.replace('_', ' ')}
          </p>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          disabled={submitting}
          className="rounded-lg border border-gray-200 px-6 py-2.5 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
        >
          {t('back')}
        </button>
        <button
          onClick={onSubmit}
          disabled={submitting}
          className="rounded-lg bg-blue-600 px-8 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? t('placing') : t('placeOrder')}
        </button>
      </div>
    </div>
  );
}
