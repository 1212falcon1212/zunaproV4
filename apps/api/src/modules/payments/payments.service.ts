import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import * as crypto from 'crypto';
import { masterPrisma } from '@zunapro/db';
import { ProvisioningService } from '../provisioning/provisioning.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';

interface PaytrTokenApiResponse {
  status: string;
  token?: string;
  reason?: string;
}

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
    const merchantId = this.configService.get<string>('PAYTR_MERCHANT_ID', '');
    const merchantKey = this.configService.get<string>('PAYTR_MERCHANT_KEY', '');
    const merchantSalt = this.configService.get<string>('PAYTR_MERCHANT_SALT', '');
    const testMode = this.configService.get<string>('PAYTR_TEST_MODE', '1');

    if (!merchantId || !merchantKey || !merchantSalt) {
      throw new BadRequestException('PayTR is not configured');
    }

    const plan = await masterPrisma.plan.findUnique({ where: { id: dto.planId } });
    if (!plan) {
      throw new BadRequestException('Plan not found');
    }

    const merchantOid = `sub_${dto.tenantSlug}_${Date.now()}`;
    const email = dto.email ?? 'customer@example.com';
    const paymentAmount = Math.round(Number(plan.price) * 100).toString();
    const userIp = '127.0.0.1';
    const paymentType = 'card';
    const installment = '0';
    const noInstallment = '1';
    const maxInstallment = '0';
    const currencyCode = plan.currency === 'TRY' ? 'TL' : plan.currency;

    const apiBaseUrl = this.configService.get<string>(
      'API_BASE_URL',
      'http://localhost:4000',
    );

    const basketItem = JSON.stringify([
      [`ZunaPro ${plan.name}`, paymentAmount, 1],
    ]);
    const userBasket = Buffer.from(basketItem).toString('base64');

    const hashStr = [
      merchantId,
      userIp,
      merchantOid,
      email,
      paymentAmount,
      paymentType,
      installment,
      currencyCode,
      testMode,
      noInstallment,
      maxInstallment,
      merchantSalt,
    ].join('');

    const paytrToken = crypto
      .createHmac('sha256', merchantKey)
      .update(hashStr)
      .digest('base64');

    const formData = new URLSearchParams({
      merchant_id: merchantId,
      user_ip: userIp,
      merchant_oid: merchantOid,
      email,
      payment_amount: paymentAmount,
      paytr_token: paytrToken,
      user_basket: userBasket,
      debug_on: testMode,
      no_installment: noInstallment,
      max_installment: maxInstallment,
      user_name: email.split('@')[0] ?? 'Customer',
      user_address: 'N/A',
      user_phone: '0000000000',
      merchant_ok_url: dto.successUrl ?? `${apiBaseUrl}/payment/success`,
      merchant_fail_url: dto.cancelUrl ?? `${apiBaseUrl}/payment/cancel`,
      timeout_limit: '30',
      currency: currencyCode,
      test_mode: testMode,
      lang: 'en',
      merchant_notify_url: `${apiBaseUrl}/payments/paytr/callback`,
    });

    const response = await fetch('https://www.paytr.com/odeme/api/get-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    });

    if (!response.ok) {
      throw new Error(`PayTR API error: ${response.status} ${response.statusText}`);
    }

    const result = (await response.json()) as PaytrTokenApiResponse;

    if (result.status !== 'success' || !result.token) {
      this.logger.error(
        `PayTR token creation failed for plan ${dto.planId}: ${result.reason ?? 'Unknown error'}`,
      );
      throw new BadRequestException(result.reason ?? 'PayTR token creation failed');
    }

    this.logger.log(
      `PayTR token created for tenant ${dto.tenantSlug}, plan ${dto.planId}: merchantOid=${merchantOid}`,
    );

    // Store merchant_oid mapping in tenant config for callback resolution
    const tenant = await masterPrisma.tenant.findUnique({
      where: { slug: dto.tenantSlug },
    });
    const existingConfig = (tenant?.config as Record<string, unknown>) ?? {};
    await masterPrisma.tenant.update({
      where: { slug: dto.tenantSlug },
      data: {
        config: {
          ...existingConfig,
          paytrMerchantOid: merchantOid,
          paytrPlanId: dto.planId,
        },
      },
    });

    return {
      token: result.token,
      iframeUrl: `https://www.paytr.com/odeme/guvenli/${result.token}`,
      merchantOid,
    };
  }

  async handlePaytrCallback(body: Record<string, string>) {
    const merchantKey = this.configService.get<string>('PAYTR_MERCHANT_KEY', '');
    const merchantSalt = this.configService.get<string>('PAYTR_MERCHANT_SALT', '');

    if (!merchantKey || !merchantSalt) {
      this.logger.error('PayTR callback received but PayTR is not configured');
      return 'OK';
    }

    const merchantOid = body.merchant_oid ?? '';
    const status = body.status ?? '';
    const totalAmount = body.total_amount ?? '';
    const hash = body.hash ?? '';

    // Verify callback hash
    const hashStr = [merchantOid, merchantSalt, status, totalAmount].join('');
    const expectedHash = crypto
      .createHmac('sha256', merchantKey)
      .update(hashStr)
      .digest('base64');

    if (hash !== expectedHash) {
      this.logger.error(
        `PayTR callback hash mismatch for merchantOid=${merchantOid}`,
      );
      return 'OK';
    }

    this.logger.log(
      `PayTR callback verified: merchantOid=${merchantOid}, status=${status}`,
    );

    if (status === 'success') {
      // Find tenant by paytr merchant_oid stored in metadata
      const tenants = await masterPrisma.tenant.findMany({
        where: { status: { in: ['pending', 'active'] } },
      });

      const matchedTenant = tenants.find((t) => {
        const config = t.config as Record<string, unknown> | null;
        return config?.paytrMerchantOid === merchantOid;
      });

      if (matchedTenant) {
        this.logger.log(
          `PayTR payment successful for tenant ${matchedTenant.slug}, triggering provisioning`,
        );
        await this.provisioningService.triggerProvisioning(matchedTenant.id);
      } else {
        this.logger.warn(
          `PayTR callback: no tenant found for merchantOid=${merchantOid}`,
        );
      }
    } else {
      this.logger.warn(
        `PayTR payment failed: merchantOid=${merchantOid}, status=${status}`,
      );
    }

    // PayTR requires exact "OK" response
    return 'OK';
  }
}
