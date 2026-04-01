'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { panelApi } from '@/lib/panel-api';

interface RefundDialogProps {
  orderId: string;
  orderNumber: string;
  totalAmount: number;
  currency: string;
  paymentMethod?: string;
  onClose: () => void;
  onRefundComplete: () => void;
}

type RefundType = 'full' | 'partial';
type RefundReason = 'customerRequest' | 'defective' | 'wrongItem' | 'lateDelivery' | 'other';

const REFUND_REASONS: RefundReason[] = [
  'customerRequest',
  'defective',
  'wrongItem',
  'lateDelivery',
  'other',
];

export function RefundDialog({
  orderId,
  orderNumber,
  totalAmount,
  currency,
  onClose,
  onRefundComplete,
}: RefundDialogProps) {
  const t = useTranslations('panel.orders.refund');

  const [refundType, setRefundType] = useState<RefundType>('full');
  const [amount, setAmount] = useState<string>(totalAmount.toFixed(2));
  const [reason, setReason] = useState<RefundReason>('customerRequest');
  const [notes, setNotes] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const refundAmount = refundType === 'full' ? totalAmount : parseFloat(amount) || 0;
  const isAmountValid = refundAmount > 0 && refundAmount <= totalAmount;

  const handleSubmit = async () => {
    if (!isAmountValid) return;

    setProcessing(true);
    setError(null);

    const reasonLabel = t(`reasons.${reason}`);
    const refundNotes = notes
      ? `${reasonLabel}: ${notes}`
      : reasonLabel;

    try {
      await panelApi.patch(`/orders/${orderId}/status`, {
        status: 'refunded',
        notes: refundNotes,
        refundAmount: refundAmount,
        refundType,
      });
      setSuccess(true);
      setTimeout(() => {
        onRefundComplete();
        onClose();
      }, 1500);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to process refund';
      setError(message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
        {/* Header */}
        <h3 className="text-lg font-semibold">
          {t('title')} — {orderNumber}
        </h3>

        {/* Warning */}
        <p className="mt-2 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
          {t('warning')}
        </p>

        {success ? (
          <div className="mt-6 rounded-lg bg-emerald-50 p-4 text-center text-sm font-medium text-emerald-700">
            {t('success')}
          </div>
        ) : (
          <>
            {/* Refund type */}
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setRefundType('full');
                  setAmount(totalAmount.toFixed(2));
                }}
                className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                  refundType === 'full'
                    ? 'border-rose-500 bg-rose-50 text-rose-700'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                {t('fullRefund')}
              </button>
              <button
                type="button"
                onClick={() => setRefundType('partial')}
                className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                  refundType === 'partial'
                    ? 'border-rose-500 bg-rose-50 text-rose-700'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                {t('partialRefund')}
              </button>
            </div>

            {/* Amount (partial only) */}
            {refundType === 'partial' && (
              <div className="mt-4">
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  {t('amount')} ({currency})
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={totalAmount}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={`w-full rounded-lg border px-3 py-2 text-sm ${
                    !isAmountValid
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                      : 'border-slate-200 focus:border-violet-500 focus:ring-violet-200'
                  } focus:outline-none focus:ring-2`}
                />
                <p className="mt-1 text-xs text-slate-500">
                  Max: {currency} {totalAmount.toFixed(2)}
                </p>
              </div>
            )}

            {/* Reason */}
            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium text-slate-700">
                {t('reason')}
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as RefundReason)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                {REFUND_REASONS.map((r) => (
                  <option key={r} value={r}>
                    {t(`reasons.${r}`)}
                  </option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium text-slate-700">
                {t('notes')}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t('notesPlaceholder')}
                rows={3}
                className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {/* Error */}
            {error && (
              <p className="mt-3 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
                {error}
              </p>
            )}

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={processing}
                className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
              >
                {t('cancel')}
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={processing || !isAmountValid}
                className="flex-1 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50"
              >
                {processing ? t('processing') : t('confirm')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
