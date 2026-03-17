'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { storeApi, isCustomerAuthenticated } from '@/lib/store-api';
import { AddressStep } from './_components/address-step';
import { ShippingStep } from './_components/shipping-step';
import { PaymentStep } from './_components/payment-step';
import { ReviewStep } from './_components/review-step';

interface Cart {
  items: Array<{
    productId: string;
    name: Record<string, string>;
    slug: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
}

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

const emptyAddress: Address = {
  firstName: '',
  lastName: '',
  address1: '',
  city: '',
  postalCode: '',
  country: '',
};

const steps = ['address', 'shipping', 'payment', 'review'] as const;

export default function CheckoutPage() {
  const t = useTranslations('storefront.checkout');
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;

  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [address, setAddress] = useState<Address>(emptyAddress);
  const [shippingMethod, setShippingMethod] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isCustomerAuthenticated()) {
      router.push(`/store/${locale}/auth/login?redirect=/store/${locale}/checkout`);
      return;
    }

    storeApi
      .get<Cart>('/storefront/cart')
      .then((data) => {
        if (!data.items.length) {
          router.push(`/store/${locale}/cart`);
          return;
        }
        setCart(data);
      })
      .finally(() => setLoading(false));
  }, [locale, router]);

  const handlePlaceOrder = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const order = await storeApi.post<{ id: string; orderNumber: string }>(
        '/storefront/orders',
        {
          shippingAddress: address,
          shippingMethod,
          paymentMethod,
          locale,
        },
        true,
      );

      // If payment method requires redirect, create checkout session
      if (paymentMethod === 'stripe' || paymentMethod === 'iyzico') {
        const payment = await storeApi.post<{
          checkoutUrl: string;
          sessionId: string;
        }>(
          '/storefront/payments/checkout',
          {
            orderId: order.id,
            gateway: paymentMethod,
            returnUrl: `${window.location.origin}/store/${locale}/account/orders`,
          },
          true,
        );

        window.location.href = payment.checkoutUrl;
        return;
      }

      // Bank transfer — redirect to order confirmation
      router.push(`/store/${locale}/account/orders?success=${order.orderNumber}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to place order',
      );
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!cart) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Progress */}
      <div className="mb-8 flex items-center justify-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                i <= step
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {i + 1}
            </div>
            <span
              className={`hidden text-sm sm:inline ${
                i <= step ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              {t(`steps.${s}`)}
            </span>
            {i < steps.length - 1 && (
              <div
                className={`h-px w-8 ${
                  i < step ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {step === 0 && (
        <AddressStep
          address={address}
          onChange={setAddress}
          onNext={() => setStep(1)}
        />
      )}
      {step === 1 && (
        <ShippingStep
          selected={shippingMethod}
          onSelect={setShippingMethod}
          onNext={() => setStep(2)}
          onBack={() => setStep(0)}
        />
      )}
      {step === 2 && (
        <PaymentStep
          selected={paymentMethod}
          onSelect={setPaymentMethod}
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && (
        <ReviewStep
          items={cart.items}
          address={address}
          shippingMethod={shippingMethod}
          paymentMethod={paymentMethod}
          locale={locale}
          submitting={submitting}
          onSubmit={handlePlaceOrder}
          onBack={() => setStep(2)}
        />
      )}
    </div>
  );
}
