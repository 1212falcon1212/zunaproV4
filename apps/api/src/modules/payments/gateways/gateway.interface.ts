export interface CheckoutResult {
  checkoutUrl: string;
  sessionId: string;
}

export interface VerifyResult {
  success: boolean;
  ref: string;
}

export interface RefundResult {
  success: boolean;
}

export interface PaymentGateway {
  createCheckout(
    orderId: string,
    amount: number,
    currency: string,
    returnUrl: string,
    metadata?: Record<string, string>,
  ): Promise<CheckoutResult>;

  verifyPayment(sessionId: string): Promise<VerifyResult>;

  refund(paymentRef: string, amount: number): Promise<RefundResult>;
}
