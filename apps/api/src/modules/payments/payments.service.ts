import { Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import { CreateCheckoutDto } from './dto/create-checkout.dto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  async createStripeCheckout(dto: CreateCheckoutDto) {
    this.logger.log(`Creating Stripe checkout for plan ${dto.planId}`);
    return { message: 'Stripe checkout endpoint ready' };
  }

  async createPaytrToken(dto: CreateCheckoutDto) {
    this.logger.log(`Creating PayTR token for plan ${dto.planId}`);
    return { message: 'PayTR token endpoint ready' };
  }

  async handleStripeWebhook(req: Request, signature: string) {
    this.logger.log('Stripe webhook received');
    return { received: true };
  }

  async handlePaytrCallback(body: Record<string, string>) {
    this.logger.log('PayTR callback received');
    return { status: 'OK' };
  }
}
