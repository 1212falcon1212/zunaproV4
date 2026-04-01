export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type OrderPaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export type ShippingProvider = 'yurtici' | 'aras' | 'mng';

export type PaymentMethod = 'stripe' | 'iyzico' | 'bank_transfer';

export interface CartItem {
  productId: string;
  name: Record<string, string>;
  slug: string;
  price: number;
  quantity: number;
  image?: string;
  variantId?: string;
  variantName?: string;
  /** @deprecated Use variantId instead */
  variantIndex?: number;
}

export interface Cart {
  items: CartItem[];
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  name: Record<string, string>;
  slug: string;
  price: number;
  quantity: number;
  total: number;
  image?: string;
  variantIndex?: number;
  variantName?: string;
  sku?: string;
}

export interface Address {
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

export interface TrackingEvent {
  status: string;
  location?: string;
  timestamp: string;
  description?: string;
}

export interface StorefrontJwtPayload {
  customerId: string;
  tenantSlug: string;
  isGuest: boolean;
}
