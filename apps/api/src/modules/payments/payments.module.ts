import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { OrderPaymentController } from './order-payment.controller';
import { OrderPaymentService } from './order-payment.service';
import { StripeOrderGateway } from './gateways/stripe-order.gateway';
import { IyzicoGateway } from './gateways/iyzico.gateway';
import { PaytrGateway } from './gateways/paytr.gateway';
import { ProvisioningModule } from '../provisioning/provisioning.module';
import { StorefrontModule } from '../storefront/storefront.module';

@Module({
  imports: [ProvisioningModule, StorefrontModule],
  controllers: [PaymentsController, OrderPaymentController],
  providers: [
    PaymentsService,
    OrderPaymentService,
    StripeOrderGateway,
    IyzicoGateway,
    PaytrGateway,
  ],
  exports: [PaymentsService, OrderPaymentService],
})
export class PaymentsModule {}
