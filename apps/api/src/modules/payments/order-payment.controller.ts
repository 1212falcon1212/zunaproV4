import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Req,
  UseGuards,
  RawBodyRequest,
  Headers,
} from '@nestjs/common';
import { Request } from 'express';
import { OrderPaymentService } from './order-payment.service';
import { StorefrontAuthGuard } from '../storefront/auth/storefront-auth.guard';

@Controller('storefront/payments')
export class OrderPaymentController {
  constructor(private readonly orderPaymentService: OrderPaymentService) {}

  @Post('checkout')
  @UseGuards(StorefrontAuthGuard)
  createCheckout(
    @Req() req: Request,
    @Body() body: { orderId: string; gateway: string; returnUrl: string },
  ) {
    return this.orderPaymentService.createCheckout(
      req.tenant!.slug,
      body.orderId,
      body.gateway,
      body.returnUrl,
    );
  }

  @Post('webhook/stripe')
  handleStripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    return this.orderPaymentService.handleStripeWebhook(
      req.rawBody!,
      signature,
    );
  }

  @Post('webhook/iyzico')
  handleIyzicoCallback(@Body() body: Record<string, unknown>) {
    return this.orderPaymentService.handleIyzicoCallback(body);
  }

  @Post('webhook/paytr')
  handlePaytrCallback(@Body() body: Record<string, string>) {
    return this.orderPaymentService.handlePaytrOrderCallback(body);
  }

  @Get('verify/:orderId')
  @UseGuards(StorefrontAuthGuard)
  verifyPayment(@Req() req: Request, @Param('orderId') orderId: string) {
    return this.orderPaymentService.verifyPayment(req.tenant!.slug, orderId);
  }
}
