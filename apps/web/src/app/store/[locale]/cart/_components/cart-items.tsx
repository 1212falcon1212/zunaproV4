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
  variantName?: string;
}

interface CartItemsProps {
  items: CartItem[];
  locale: string;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export function CartItems({
  items,
  locale,
  onUpdateQuantity,
  onRemove,
}: CartItemsProps) {
  const t = useTranslations('storefront');
  const { formatPrice } = useCurrency();

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center">
        <p className="text-lg text-gray-500">{t('emptyCart')}</p>
      </div>
    );
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.productId}
          className="flex items-center gap-4 rounded-lg border border-gray-200 p-4"
        >
          {item.image && (
            <img
              src={item.image}
              alt=""
              className="h-20 w-20 rounded-md object-cover"
            />
          )}
          <div className="flex-1">
            <h3 className="font-medium">
              {item.name[locale] || Object.values(item.name)[0]}
            </h3>
            {item.variantName && (
              <p className="text-sm text-gray-500">{item.variantName}</p>
            )}
            <p className="text-sm font-medium text-gray-700">
              {formatPrice(item.price)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                onUpdateQuantity(item.productId, item.quantity - 1)
              }
              disabled={item.quantity <= 1}
              className="flex h-8 w-8 items-center justify-center rounded-md border text-sm disabled:opacity-50"
            >
              -
            </button>
            <span className="w-8 text-center text-sm">{item.quantity}</span>
            <button
              onClick={() =>
                onUpdateQuantity(item.productId, item.quantity + 1)
              }
              className="flex h-8 w-8 items-center justify-center rounded-md border text-sm"
            >
              +
            </button>
          </div>
          <p className="w-20 text-right font-medium">
            {formatPrice(item.price * item.quantity)}
          </p>
          <button
            onClick={() => onRemove(item.productId)}
            className="text-sm text-red-500 hover:text-red-700"
          >
            {t('remove')}
          </button>
        </div>
      ))}

      <div className="border-t pt-4">
        <div className="flex justify-between text-lg font-bold">
          <span>{t('subtotal')}</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
      </div>
    </div>
  );
}
