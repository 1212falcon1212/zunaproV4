import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import type {
  PaymentGateway,
  CheckoutResult,
  VerifyResult,
  RefundResult,
} from './gateway.interface';

interface PaytrTokenResponse {
  status: string;
  token?: string;
  reason?: string;
}

interface PaytrRefundResponse {
  status: string;
  is_test?: number;
  err_no?: string;
  err_msg?: string;
}

@Injectable()
export class PaytrGateway implements PaymentGateway {
  private readonly logger = new Logger(PaytrGateway.name);
  private readonly merchantId: string;
  private readonly merchantKey: string;
  private readonly merchantSalt: string;
  private readonly testMode: string;

  constructor(private readonly configService: ConfigService) {
    this.merchantId = this.configService.get<string>('PAYTR_MERCHANT_ID', '');
    this.merchantKey = this.configService.get<string>('PAYTR_MERCHANT_KEY', '');
    this.merchantSalt = this.configService.get<string>('PAYTR_MERCHANT_SALT', '');
    this.testMode = this.configService.get<string>('PAYTR_TEST_MODE', '1');
  }

  async createCheckout(
    orderId: string,
    amount: number,
    currency: string,
    returnUrl: string,
    metadata?: Record<string, string>,
  ): Promise<CheckoutResult> {
    if (!this.merchantId || !this.merchantKey || !this.merchantSalt) {
      throw new Error('PayTR is not configured');
    }

    const merchantOid = `${orderId}_${Date.now()}`;
    const email = metadata?.customerEmail ?? 'customer@example.com';
    const paymentAmount = Math.round(amount * 100).toString();
    const userIp = metadata?.ip ?? '127.0.0.1';
    const paymentType = 'card';
    const installment = '0';
    const noInstallment = '1';
    const maxInstallment = '0';
    const currencyCode = this.mapCurrency(currency);

    const userName = metadata?.customerName
      ? `${metadata.customerName} ${metadata.customerSurname ?? ''}`.trim()
      : 'Customer';

    const userAddress = metadata?.address ?? 'N/A';
    const userPhone = metadata?.phone ?? '0000000000';

    const apiBaseUrl = this.configService.get<string>(
      'API_BASE_URL',
      'http://localhost:4000',
    );
    const merchantOkUrl = returnUrl;
    const merchantFailUrl = returnUrl;

    // Basket: JSON array of [name, price, quantity]
    const basketItem = JSON.stringify([[`Order ${orderId}`, paymentAmount, 1]]);
    const userBasket = Buffer.from(basketItem).toString('base64');

    // Hash string per PayTR documentation
    const hashStr = [
      this.merchantId,
      userIp,
      merchantOid,
      email,
      paymentAmount,
      paymentType,
      installment,
      currencyCode,
      this.testMode,
      noInstallment,
      maxInstallment,
      this.merchantSalt,
    ].join('');

    const paytrToken = crypto
      .createHmac('sha256', this.merchantKey)
      .update(hashStr)
      .digest('base64');

    const formData = new URLSearchParams({
      merchant_id: this.merchantId,
      user_ip: userIp,
      merchant_oid: merchantOid,
      email,
      payment_amount: paymentAmount,
      paytr_token: paytrToken,
      user_basket: userBasket,
      debug_on: this.testMode,
      no_installment: noInstallment,
      max_installment: maxInstallment,
      user_name: userName,
      user_address: userAddress,
      user_phone: userPhone,
      merchant_ok_url: merchantOkUrl,
      merchant_fail_url: merchantFailUrl,
      timeout_limit: '30',
      currency: currencyCode,
      test_mode: this.testMode,
      lang: 'en',
      merchant_notify_url: `${apiBaseUrl}/storefront/payments/webhook/paytr`,
    });

    const response = await fetch('https://www.paytr.com/odeme/api/get-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    });

    if (!response.ok) {
      throw new Error(`PayTR API error: ${response.status} ${response.statusText}`);
    }

    const result = (await response.json()) as PaytrTokenResponse;

    if (result.status !== 'success' || !result.token) {
      this.logger.error(
        `PayTR token creation failed for order ${orderId}: ${result.reason ?? 'Unknown error'}`,
      );
      throw new Error(result.reason ?? 'PayTR token creation failed');
    }

    this.logger.log(
      `PayTR checkout created for order ${orderId}: merchantOid=${merchantOid}`,
    );

    return {
      checkoutUrl: `https://www.paytr.com/odeme/guvenli/${result.token}`,
      sessionId: merchantOid,
    };
  }

  async verifyPayment(sessionId: string): Promise<VerifyResult> {
    // PayTR does not have a verify endpoint.
    // Payment verification happens exclusively via the callback (merchant_notify_url).
    // Return a pending result indicating callback-based verification.
    this.logger.warn(
      `PayTR does not support direct verification. SessionId: ${sessionId}. Use callback instead.`,
    );
    return {
      success: false,
      ref: sessionId,
    };
  }

  async refund(merchantOid: string, amount: number): Promise<RefundResult> {
    if (!this.merchantId || !this.merchantKey || !this.merchantSalt) {
      throw new Error('PayTR is not configured');
    }

    const returnAmount = Math.round(amount * 100).toString();

    const hashStr = [
      this.merchantId,
      merchantOid,
      returnAmount,
      this.merchantSalt,
    ].join('');

    const paytrToken = crypto
      .createHmac('sha256', this.merchantKey)
      .update(hashStr)
      .digest('base64');

    const formData = new URLSearchParams({
      merchant_id: this.merchantId,
      merchant_oid: merchantOid,
      return_amount: returnAmount,
      paytr_token: paytrToken,
    });

    const response = await fetch('https://www.paytr.com/odeme/iade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    });

    if (!response.ok) {
      throw new Error(`PayTR refund API error: ${response.status} ${response.statusText}`);
    }

    const result = (await response.json()) as PaytrRefundResponse;

    if (result.status !== 'success') {
      this.logger.error(
        `PayTR refund failed for ${merchantOid}: ${result.err_no} - ${result.err_msg}`,
      );
      return { success: false };
    }

    this.logger.log(
      `PayTR refund successful: merchantOid=${merchantOid}, amount=${amount}`,
    );

    return { success: true };
  }

  verifyCallbackHash(
    merchantOid: string,
    status: string,
    totalAmount: string,
    hash: string,
  ): boolean {
    const hashStr = [
      merchantOid,
      this.merchantSalt,
      status,
      totalAmount,
    ].join('');

    const expectedHash = crypto
      .createHmac('sha256', this.merchantKey)
      .update(hashStr)
      .digest('base64');

    return hash === expectedHash;
  }

  private mapCurrency(currency: string): string {
    const currencyMap: Record<string, string> = {
      TRY: 'TL',
      USD: 'USD',
      EUR: 'EUR',
      GBP: 'GBP',
    };
    return currencyMap[currency.toUpperCase()] ?? currency;
  }
}
