import { Controller, Post, Body, RawBodyRequest, Req, Headers } from '@nestjs/common';
import { Request } from 'express';
import { PaymentsService } from './payments.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-checkout')
  createCheckout(@Body() dto: CreateCheckoutDto) {
    return this.paymentsService.createStripeCheckout(dto);
  }

  @Post('paytr-token')
  createPaytrToken(@Body() dto: CreateCheckoutDto) {
    return this.paymentsService.createPaytrToken(dto);
  }

  @Post('stripe-webhook')
  stripeWebhook(@Req() req: RawBodyRequest<Request>, @Headers('stripe-signature') signature: string) {
    return this.paymentsService.handleStripeWebhook(req, signature);
  }

  @Post('paytr-callback')
  paytrCallback(@Body() body: Record<string, string>) {
    return this.paymentsService.handlePaytrCallback(body);
  }
}
