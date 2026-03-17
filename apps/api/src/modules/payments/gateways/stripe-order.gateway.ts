import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import type { PaymentGateway, CheckoutResult, VerifyResult, RefundResult } from './gateway.interface';

@Injectable()
export class StripeOrderGateway implements PaymentGateway {
  private readonly logger = new Logger(StripeOrderGateway.name);
  private readonly stripe: Stripe | null;

  constructor(private readonly configService: ConfigService) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    this.stripe = secretKey ? new Stripe(secretKey) : null;
  }

  async createCheckout(
    orderId: string,
    amount: number,
    currency: string,
    returnUrl: string,
    metadata?: Record<string, string>,
  ): Promise<CheckoutResult> {
    if (!this.stripe) {
      throw new Error('Stripe is not configured');
    }

    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: `Order ${orderId}`,
              metadata: metadata ?? {},
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      metadata: { orderId, ...metadata },
      success_url: `${returnUrl}?status=success&orderId=${orderId}`,
      cancel_url: `${returnUrl}?status=cancelled&orderId=${orderId}`,
    });

    this.logger.log(`Stripe checkout created for order ${orderId}: ${session.id}`);

    return {
      checkoutUrl: session.url!,
      sessionId: session.id,
    };
  }

  async verifyPayment(sessionId: string): Promise<VerifyResult> {
    if (!this.stripe) {
      throw new Error('Stripe is not configured');
    }

    const session = await this.stripe.checkout.sessions.retrieve(sessionId);

    return {
      success: session.payment_status === 'paid',
      ref: (session.payment_intent as string) ?? sessionId,
    };
  }

  async refund(paymentRef: string, amount: number): Promise<RefundResult> {
    if (!this.stripe) {
      throw new Error('Stripe is not configured');
    }

    const refund = await this.stripe.refunds.create({
      payment_intent: paymentRef,
      amount: Math.round(amount * 100),
    });

    this.logger.log(`Stripe refund created: ${refund.id} for ${paymentRef}`);

    return { success: refund.status === 'succeeded' };
  }
}
