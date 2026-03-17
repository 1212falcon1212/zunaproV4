import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import type { PaymentGateway, CheckoutResult, VerifyResult, RefundResult } from './gateway.interface';

interface IyzicoResponse {
  status: string;
  errorCode?: string;
  errorMessage?: string;
  errorGroup?: string;
  token?: string;
  checkoutFormContent?: string;
  tokenExpireTime?: number;
  paymentPageUrl?: string;
  paymentId?: string;
  paymentTransactionId?: string;
  price?: number;
  paidPrice?: number;
  currency?: string;
  installment?: number;
  paymentStatus?: string;
}

@Injectable()
export class IyzicoGateway implements PaymentGateway {
  private readonly logger = new Logger(IyzicoGateway.name);
  private readonly apiKey: string;
  private readonly secretKey: string;
  private readonly baseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('IYZICO_API_KEY', '');
    this.secretKey = this.configService.get<string>('IYZICO_SECRET_KEY', '');
    this.baseUrl = this.configService.get<string>(
      'IYZICO_BASE_URL',
      'https://sandbox-api.iyzipay.com',
    );
  }

  private generateAuthorizationHeader(requestBody: string): string {
    const randomHeaderValue = `${Date.now()}${Math.random().toString(36).substring(2)}`;
    const hashStr = `${this.apiKey}${randomHeaderValue}${this.secretKey}${requestBody}`;
    const hash = crypto.createHash('sha1').update(hashStr).digest('base64');
    const authorizationParams = `apiKey:${this.apiKey}&randomHeaderValue:${randomHeaderValue}&signature:${hash}`;
    return `IYZWS ${Buffer.from(authorizationParams).toString('base64')}`;
  }

  private async apiRequest<T extends IyzicoResponse>(path: string, body: Record<string, unknown>): Promise<T> {
    const requestBody = JSON.stringify(body);
    const authorization = this.generateAuthorizationHeader(requestBody);

    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authorization,
        'x-iyzi-rnd': `${Date.now()}`,
      },
      body: requestBody,
    });

    if (!response.ok) {
      throw new Error(`Iyzico API error: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  }

  async createCheckout(
    orderId: string,
    amount: number,
    currency: string,
    returnUrl: string,
    metadata?: Record<string, string>,
  ): Promise<CheckoutResult> {
    if (!this.apiKey || !this.secretKey) {
      throw new Error('Iyzico is not configured');
    }

    const conversationId = `order_${orderId}_${Date.now()}`;

    const buyerName = metadata?.customerName ?? 'Customer';
    const buyerSurname = metadata?.customerSurname ?? 'Customer';
    const buyerEmail = metadata?.customerEmail ?? 'customer@example.com';

    const requestBody = {
      locale: 'en',
      conversationId,
      price: amount.toFixed(2),
      paidPrice: amount.toFixed(2),
      currency: currency === 'TRY' ? 'TRY' : currency,
      basketId: orderId,
      paymentGroup: 'PRODUCT',
      callbackUrl: returnUrl,
      enabledInstallments: [1, 2, 3, 6, 9],
      buyer: {
        id: metadata?.customerId ?? 'guest',
        name: buyerName,
        surname: buyerSurname,
        email: buyerEmail,
        identityNumber: '00000000000',
        registrationAddress: metadata?.address ?? 'N/A',
        city: metadata?.city ?? 'Istanbul',
        country: metadata?.country ?? 'Turkey',
        ip: metadata?.ip ?? '127.0.0.1',
      },
      shippingAddress: {
        contactName: `${buyerName} ${buyerSurname}`,
        city: metadata?.city ?? 'Istanbul',
        country: metadata?.country ?? 'Turkey',
        address: metadata?.address ?? 'N/A',
      },
      billingAddress: {
        contactName: `${buyerName} ${buyerSurname}`,
        city: metadata?.city ?? 'Istanbul',
        country: metadata?.country ?? 'Turkey',
        address: metadata?.address ?? 'N/A',
      },
      basketItems: [
        {
          id: orderId,
          name: `Order ${orderId}`,
          category1: 'Order',
          itemType: 'PHYSICAL',
          price: amount.toFixed(2),
        },
      ],
    };

    const result = await this.apiRequest<IyzicoResponse>(
      '/payment/iyzipos/checkoutform/initialize/auth/ecom',
      requestBody,
    );

    if (result.status !== 'success') {
      this.logger.error(
        `Iyzico checkout failed for order ${orderId}: ${result.errorCode} - ${result.errorMessage}`,
      );
      throw new Error(result.errorMessage ?? 'Iyzico checkout initialization failed');
    }

    this.logger.log(
      `Iyzico checkout created for order ${orderId}: token=${result.token}`,
    );

    return {
      checkoutUrl: result.paymentPageUrl ?? `${this.baseUrl}/checkout?token=${result.token}`,
      sessionId: result.token!,
    };
  }

  async verifyPayment(token: string): Promise<VerifyResult> {
    if (!this.apiKey || !this.secretKey) {
      throw new Error('Iyzico is not configured');
    }

    const result = await this.apiRequest<IyzicoResponse>(
      '/payment/iyzipos/checkoutform/auth/ecom/detail',
      { locale: 'en', conversationId: token, token },
    );

    if (result.status !== 'success') {
      this.logger.warn(
        `Iyzico payment verification failed for token ${token}: ${result.errorCode} - ${result.errorMessage}`,
      );
      return { success: false, ref: token };
    }

    const paymentSuccess = result.paymentStatus === 'SUCCESS';

    this.logger.log(
      `Iyzico payment verified: token=${token}, paymentId=${result.paymentId}, status=${result.paymentStatus}`,
    );

    return {
      success: paymentSuccess,
      ref: result.paymentId ?? token,
    };
  }

  async refund(paymentTransactionId: string, amount: number): Promise<RefundResult> {
    if (!this.apiKey || !this.secretKey) {
      throw new Error('Iyzico is not configured');
    }

    const conversationId = `refund_${paymentTransactionId}_${Date.now()}`;

    const result = await this.apiRequest<IyzicoResponse>(
      '/payment/refund',
      {
        locale: 'en',
        conversationId,
        paymentTransactionId,
        price: amount.toFixed(2),
        currency: 'TRY',
        ip: '127.0.0.1',
      },
    );

    if (result.status !== 'success') {
      this.logger.error(
        `Iyzico refund failed for ${paymentTransactionId}: ${result.errorCode} - ${result.errorMessage}`,
      );
      return { success: false };
    }

    this.logger.log(
      `Iyzico refund successful: transactionId=${paymentTransactionId}, amount=${amount}`,
    );

    return { success: true };
  }
}
