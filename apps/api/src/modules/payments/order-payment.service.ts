import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getTenantClient, masterPrisma } from '@zunapro/db';
import { StripeOrderGateway } from './gateways/stripe-order.gateway';
import { IyzicoGateway } from './gateways/iyzico.gateway';
import { PaytrGateway } from './gateways/paytr.gateway';
import type { PaymentGateway } from './gateways/gateway.interface';
import Stripe from 'stripe';

@Injectable()
export class OrderPaymentService {
  private readonly logger = new Logger(OrderPaymentService.name);
  private readonly gateways: Record<string, PaymentGateway>;
  private readonly stripe: Stripe | null;
  private readonly webhookSecret: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly stripeGateway: StripeOrderGateway,
    private readonly iyzicoGateway: IyzicoGateway,
    private readonly paytrGateway: PaytrGateway,
  ) {
    this.gateways = {
      stripe: this.stripeGateway,
      iyzico: this.iyzicoGateway,
      paytr: this.paytrGateway,
    };

    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    this.stripe = secretKey ? new Stripe(secretKey) : null;
    this.webhookSecret = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET',
      '',
    );
  }

  private getGateway(name: string): PaymentGateway {
    const gateway = this.gateways[name];
    if (!gateway) {
      throw new BadRequestException(`Payment gateway '${name}' not supported`);
    }
    return gateway;
  }

  async createCheckout(
    tenantSlug: string,
    orderId: string,
    gateway: string,
    returnUrl: string,
  ) {
    const prisma = getTenantClient(tenantSlug);

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customer: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.paymentStatus === 'paid') {
      throw new BadRequestException('Order is already paid');
    }

    const paymentGateway = this.getGateway(gateway);

    const metadata: Record<string, string> = {
      tenantSlug,
      orderId: order.id,
      orderNumber: order.orderNumber,
    };

    if (order.customer) {
      metadata.customerId = order.customer.id;
      metadata.customerName = order.customer.firstName;
      metadata.customerSurname = order.customer.lastName;
      metadata.customerEmail = order.customer.email;
    }

    // For Iyzico & PayTR: extract address info from order
    if (gateway === 'iyzico' || gateway === 'paytr') {
      const shippingAddr = order.shippingAddress as Record<string, string> | null;
      if (shippingAddr) {
        metadata.address = shippingAddr.address1 ?? 'N/A';
        metadata.city = shippingAddr.city ?? 'Istanbul';
        metadata.country = shippingAddr.country ?? 'Turkey';
      }
    }

    // Iyzico needs its webhook endpoint as callback, not the client return URL
    if (gateway === 'iyzico') {
      const apiBaseUrl = this.configService.get<string>('API_BASE_URL', 'http://localhost:4000');
      metadata.iyzicoCallbackUrl = `${apiBaseUrl}/storefront/payments/webhook/iyzico`;
      metadata.clientReturnUrl = returnUrl;
    }

    const result = await paymentGateway.createCheckout(
      order.orderNumber,
      Number(order.totalAmount),
      order.currency,
      gateway === 'iyzico'
        ? metadata.iyzicoCallbackUrl!
        : returnUrl,
      metadata,
    );

    // Store payment reference
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentMethod: gateway,
        paymentRef: result.sessionId,
      },
    });

    return result;
  }

  async handleStripeWebhook(payload: Buffer, signature: string) {
    if (!this.stripe || !this.webhookSecret) {
      throw new BadRequestException('Stripe webhook not configured');
    }

    const event = this.stripe.webhooks.constructEvent(
      payload,
      signature,
      this.webhookSecret,
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const tenantSlug = session.metadata?.tenantSlug;
      const orderId = session.metadata?.orderId;

      if (!tenantSlug || !orderId) {
        this.logger.warn('Stripe webhook missing metadata');
        return { received: true };
      }

      const prisma = getTenantClient(tenantSlug);
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'paid',
          paymentRef: (session.payment_intent as string) ?? session.id,
          status: 'confirmed',
        },
      });

      this.logger.log(
        `Payment confirmed for order ${orderId} (tenant: ${tenantSlug})`,
      );
    }

    return { received: true };
  }

  async handleIyzicoCallback(body: Record<string, unknown>) {
    const token = body.token as string;
    if (!token) {
      throw new BadRequestException('Missing iyzico token');
    }

    this.logger.log(`Iyzico callback received: token=${token}`);

    // Verify payment with Iyzico API
    const verification = await this.iyzicoGateway.verifyPayment(token);

    if (!verification.success) {
      this.logger.warn(`Iyzico payment failed for token: ${token}`);
      // Find order by paymentRef (token) and mark as failed
      await this.updateOrderByPaymentRef(token, 'failed', null);
      return { received: true, status: 'failed' };
    }

    // Payment successful — find and update the order
    const updated = await this.updateOrderByPaymentRef(token, 'paid', verification.ref);

    if (updated) {
      this.logger.log(
        `Iyzico payment confirmed: token=${token}, paymentId=${verification.ref}, order=${updated.orderNumber}`,
      );
    } else {
      this.logger.warn(`Iyzico payment verified but no matching order found for token: ${token}`);
    }

    return { received: true, status: 'success' };
  }

  async handlePaytrOrderCallback(body: Record<string, string>) {
    const merchantOid = body.merchant_oid ?? '';
    const status = body.status ?? '';
    const totalAmount = body.total_amount ?? '';
    const hash = body.hash ?? '';

    // Verify callback hash
    const isValid = this.paytrGateway.verifyCallbackHash(
      merchantOid,
      status,
      totalAmount,
      hash,
    );

    if (!isValid) {
      this.logger.error(
        `PayTR order callback hash mismatch for merchantOid=${merchantOid}`,
      );
      return 'OK';
    }

    this.logger.log(
      `PayTR order callback verified: merchantOid=${merchantOid}, status=${status}`,
    );

    if (status === 'success') {
      // merchantOid format: "{orderNumber}_{timestamp}"
      // Extract the order number portion (everything before the last underscore + timestamp)
      const lastUnderscoreIdx = merchantOid.lastIndexOf('_');
      const orderNumber =
        lastUnderscoreIdx > 0
          ? merchantOid.substring(0, lastUnderscoreIdx)
          : merchantOid;

      const updated = await this.updateOrderByPaymentRef(
        merchantOid,
        'paid',
        merchantOid,
      );

      if (updated) {
        this.logger.log(
          `PayTR payment confirmed: merchantOid=${merchantOid}, order=${updated.orderNumber}`,
        );
      } else {
        // Fallback: search by orderNumber in paymentRef
        this.logger.warn(
          `PayTR: no order found by paymentRef=${merchantOid}, searching by orderNumber=${orderNumber}`,
        );
        await this.updateOrderByOrderNumber(orderNumber, merchantOid);
      }
    } else {
      this.logger.warn(
        `PayTR order payment failed: merchantOid=${merchantOid}, status=${status}`,
      );
      await this.updateOrderByPaymentRef(merchantOid, 'failed', null);
    }

    // PayTR requires exact "OK" response
    return 'OK';
  }

  private async updateOrderByOrderNumber(
    orderNumber: string,
    merchantOid: string,
  ) {
    const tenants = await masterPrisma.tenant.findMany({
      where: { status: 'active' },
      select: { slug: true },
    });

    for (const tenant of tenants) {
      const prisma = getTenantClient(tenant.slug);
      const order = await prisma.order.findFirst({
        where: { orderNumber, paymentMethod: 'paytr' },
      });

      if (!order) continue;

      if (order.paymentStatus === 'paid') {
        this.logger.log(
          `Order ${order.orderNumber} already marked as paid, skipping`,
        );
        return;
      }

      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: 'paid',
          paymentRef: merchantOid,
          status: 'confirmed',
        },
      });

      this.logger.log(
        `PayTR payment confirmed by orderNumber: ${orderNumber}, tenant: ${tenant.slug}`,
      );
      return;
    }

    this.logger.warn(
      `PayTR: no order found by orderNumber=${orderNumber} across tenants`,
    );
  }

  private async updateOrderByPaymentRef(
    paymentRef: string,
    paymentStatus: 'paid' | 'failed',
    newRef: string | null,
  ) {
    // Search across tenants via master DB to find the right tenant
    // The paymentRef (iyzico token) was stored during createCheckout
    const tenants = await masterPrisma.tenant.findMany({
      where: { status: 'active' },
      select: { slug: true },
    });

    for (const tenant of tenants) {
      const prisma = getTenantClient(tenant.slug);
      const order = await prisma.order.findFirst({
        where: { paymentRef, paymentMethod: { in: ['iyzico', 'paytr'] } },
      });

      if (!order) continue;

      // Idempotency: skip if already processed
      if (order.paymentStatus === 'paid' && paymentStatus === 'paid') {
        this.logger.log(`Order ${order.orderNumber} already marked as paid, skipping`);
        return order;
      }

      const updateData: Record<string, unknown> = { paymentStatus };

      if (paymentStatus === 'paid') {
        updateData.status = 'confirmed';
        if (newRef) updateData.paymentRef = newRef;
      }

      const updated = await prisma.order.update({
        where: { id: order.id },
        data: updateData,
      });

      return updated;
    }

    return null;
  }

  async verifyPayment(tenantSlug: string, orderId: string) {
    const prisma = getTenantClient(tenantSlug);

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return {
      orderId: order.id,
      orderNumber: order.orderNumber,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
    };
  }
}
