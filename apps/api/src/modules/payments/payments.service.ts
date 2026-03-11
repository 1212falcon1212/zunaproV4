import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { masterPrisma } from '@zunapro/db';
import { ProvisioningService } from '../provisioning/provisioning.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly provisioningService: ProvisioningService,
  ) {}

  async createStripeCheckout(dto: CreateCheckoutDto) {
    const { tenantId, email, successUrl, cancelUrl } = dto;
    if (!tenantId || !email || !successUrl || !cancelUrl) {
      throw new BadRequestException('tenantId, email, successUrl, and cancelUrl are required');
    }

    const stripeKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      // Dev mode: skip payment, trigger provisioning directly
      this.logger.warn('STRIPE_SECRET_KEY not set, triggering provisioning directly (dev mode)');
      await this.provisioningService.triggerProvisioning(tenantId);
      return { checkoutUrl: successUrl, devMode: true };
    }

    // Production: create Stripe checkout session
    const stripe = new Stripe(stripeKey);

    const plan = await masterPrisma.plan.findUnique({ where: { id: dto.planId } });
    if (!plan) throw new Error('Plan not found');

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: email,
      line_items: [{
        price_data: {
          currency: plan.currency.toLowerCase(),
          product_data: { name: `ZunaPro ${plan.name}` },
          unit_amount: Math.round(Number(plan.price) * 100),
          recurring: { interval: 'month' },
        },
        quantity: 1,
      }],
      metadata: { tenantId, planId: dto.planId },
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return { checkoutUrl: session.url };
  }

  async handleStripeWebhook(payload: Buffer, signature: string) {
    const stripeKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    if (!stripeKey || !webhookSecret) return { received: true };

    const stripe = new Stripe(stripeKey);
    const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const tenantId = session.metadata?.tenantId;
      if (tenantId) {
        await this.provisioningService.triggerProvisioning(tenantId);
      }
    }

    return { received: true };
  }

  async createPaytrToken(dto: CreateCheckoutDto) {
    this.logger.log(`Creating PayTR token for plan ${dto.planId}`);
    return { message: 'PayTR token endpoint ready' };
  }

  async handlePaytrCallback(body: Record<string, string>) {
    this.logger.log('PayTR callback received');
    return { status: 'OK' };
  }
}
