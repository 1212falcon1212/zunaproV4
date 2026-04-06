'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { panelApi } from '@/lib/panel-api';
import { StatusBadge } from './status-badge';
import { RefundDialog } from './refund-dialog';

interface OrderDetailProps {
  order: {
    id: string;
    orderNumber: string;
    status: string;
    paymentStatus: string;
    paymentMethod?: string;
    totalAmount: string;
    subtotalAmount: string;
    taxAmount: string;
    shippingCost: string;
    discountAmount: string;
    currency: string;
    items: Array<{
      productId: string;
      name: Record<string, string>;
      slug: string;
      price: number;
      quantity: number;
      total: number;
      image?: string;
      variantName?: string;
      sku?: string;
    }>;
    shippingAddress?: Record<string, string>;
    billingAddress?: Record<string, string>;
    trackingNumber?: string;
    shippingMethod?: string;
    notes?: string;
    locale: string;
    createdAt: string;
    customer?: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      phone?: string;
    };
  };
  onStatusUpdate: () => void;
}

const statusOptions: Record<string, string[]> = {
  pending: ['preparing', 'cancelled'],
  preparing: ['shipped', 'cancelled'],
  shipped: ['delivered', 'cancelled'],
  delivered: ['completed', 'refunded'],
  completed: ['refunded'],
  cancelled: [],
  refunded: [],
};

export function OrderDetail({ order, onStatusUpdate }: OrderDetailProps) {
  const t = useTranslations('panel.orders');
  const [updating, setUpdating] = useState(false);
  const [showRefund, setShowRefund] = useState(false);

  const canRefund = ['confirmed', 'processing', 'shipped', 'delivered'].includes(order.status) && order.paymentStatus === 'paid';

  const handleStatusChange = async (newStatus: string) => {
    setUpdating(true);
    try {
      await panelApi.patch(`/orders/${order.id}/status`, { status: newStatus });
      onStatusUpdate();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update status';
      alert(message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDownloadInvoice = () => {
    window.open(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/orders/${order.id}/invoice`,
      '_blank',
    );
  };

  const nextStatuses = statusOptions[order.status] ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{order.orderNumber}</h2>
          <p className="text-sm text-slate-500">
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={order.status} />
          <StatusBadge status={order.paymentStatus} type="payment" />
        </div>
      </div>

      {/* Status actions */}
      {(nextStatuses.length > 0 || canRefund) && (
        <div className="flex gap-2">
          {nextStatuses.map((status) => (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              disabled={updating}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium capitalize hover:bg-slate-50 disabled:opacity-50"
            >
              {updating ? '...' : t(`actions.${status}`)}
            </button>
          ))}
          {canRefund && (
            <button
              onClick={() => setShowRefund(true)}
              className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-100"
            >
              {t('actions.refunded')}
            </button>
          )}
          <button
            onClick={handleDownloadInvoice}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            {t('downloadInvoice')}
          </button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-slate-200">
            <div className="border-b bg-slate-50 px-4 py-3">
              <h3 className="font-medium">{t('items')}</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4">
                  {item.image && (
                    <img
                      src={item.image}
                      alt=""
                      className="h-12 w-12 rounded-md object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">
                      {item.name[order.locale] || Object.values(item.name)[0]}
                    </p>
                    {item.variantName && (
                      <p className="text-sm text-slate-500">{item.variantName}</p>
                    )}
                    {item.sku && (
                      <p className="text-xs text-slate-400">SKU: {item.sku}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500">x{item.quantity}</p>
                    <p className="font-medium">
                      {order.currency} {item.total.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {/* Totals */}
            <div className="border-t bg-slate-50 px-4 py-3">
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('subtotal')}</span>
                  <span>
                    {order.currency} {parseFloat(order.subtotalAmount).toFixed(2)}
                  </span>
                </div>
                {parseFloat(order.taxAmount) > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">{t('tax')}</span>
                    <span>
                      {order.currency} {parseFloat(order.taxAmount).toFixed(2)}
                    </span>
                  </div>
                )}
                {parseFloat(order.shippingCost) > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">{t('shipping')}</span>
                    <span>
                      {order.currency} {parseFloat(order.shippingCost).toFixed(2)}
                    </span>
                  </div>
                )}
                {parseFloat(order.discountAmount) > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">{t('discount')}</span>
                    <span>
                      -{order.currency}{' '}
                      {parseFloat(order.discountAmount).toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between border-t pt-1 font-bold">
                  <span>{t('total')}</span>
                  <span>
                    {order.currency} {parseFloat(order.totalAmount).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Side info */}
        <div className="space-y-4">
          {/* Customer */}
          {order.customer && (
            <div className="rounded-lg border border-slate-200 p-4">
              <h3 className="mb-2 font-medium">{t('customer')}</h3>
              <p className="text-sm">
                {order.customer.firstName} {order.customer.lastName}
              </p>
              <p className="text-sm text-slate-500">{order.customer.email}</p>
              {order.customer.phone && (
                <p className="text-sm text-slate-500">{order.customer.phone}</p>
              )}
            </div>
          )}

          {/* Shipping */}
          {order.shippingAddress && (
            <div className="rounded-lg border border-slate-200 p-4">
              <h3 className="mb-2 font-medium">{t('shippingAddress')}</h3>
              <div className="text-sm text-slate-600">
                <p>
                  {order.shippingAddress.firstName}{' '}
                  {order.shippingAddress.lastName}
                </p>
                <p>{order.shippingAddress.address1}</p>
                {order.shippingAddress.address2 && (
                  <p>{order.shippingAddress.address2}</p>
                )}
                <p>
                  {order.shippingAddress.city}
                  {order.shippingAddress.state
                    ? `, ${order.shippingAddress.state}`
                    : ''}{' '}
                  {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
          )}

          {/* Tracking */}
          {(order.trackingNumber || order.shippingMethod) && (
            <div className="rounded-lg border border-slate-200 p-4">
              <h3 className="mb-2 font-medium">{t('trackingInfo')}</h3>
              {order.shippingMethod && (
                <p className="text-sm capitalize text-slate-600">
                  {order.shippingMethod}
                </p>
              )}
              {order.trackingNumber && (
                <p className="text-sm font-mono text-slate-600">
                  {order.trackingNumber}
                </p>
              )}
            </div>
          )}

          {/* Notes */}
          {order.notes && (
            <div className="rounded-lg border border-slate-200 p-4">
              <h3 className="mb-2 font-medium">{t('notes')}</h3>
              <p className="text-sm text-slate-600">{order.notes}</p>
            </div>
          )}
        </div>
      </div>

      {showRefund && (
        <RefundDialog
          orderId={order.id}
          orderNumber={order.orderNumber}
          totalAmount={parseFloat(order.totalAmount)}
          currency={order.currency}
          paymentMethod={order.paymentMethod}
          onClose={() => setShowRefund(false)}
          onRefundComplete={onStatusUpdate}
        />
      )}
    </div>
  );
}
