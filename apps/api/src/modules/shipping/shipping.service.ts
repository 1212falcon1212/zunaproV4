import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { getTenantClient } from '@zunapro/db';
import { YurticiProvider } from './providers/yurtici.provider';
import { ArasProvider } from './providers/aras.provider';
import { MngProvider } from './providers/mng.provider';
import type { ShippingProvider } from './providers/provider.interface';

@Injectable()
export class ShippingService {
  private readonly logger = new Logger(ShippingService.name);
  private readonly providers: Record<string, ShippingProvider>;

  constructor(
    private readonly yurtici: YurticiProvider,
    private readonly aras: ArasProvider,
    private readonly mng: MngProvider,
  ) {
    this.providers = {
      yurtici: this.yurtici,
      aras: this.aras,
      mng: this.mng,
    };
  }

  async calculateRates(weight: number, destination: string) {
    const rates = await Promise.all(
      Object.entries(this.providers).map(async ([key, provider]) => {
        const rate = await provider.calculateRate(weight, destination);
        return { provider: key, name: provider.name, ...rate };
      }),
    );

    return rates.sort((a, b) => a.cost - b.cost);
  }

  async createShipment(
    tenantSlug: string,
    orderId: string,
    providerName: string,
  ) {
    const provider = this.providers[providerName];
    if (!provider) {
      throw new BadRequestException(
        `Shipping provider '${providerName}' not supported`,
      );
    }

    const prisma = getTenantClient(tenantSlug);
    const order = await prisma.order.findUnique({ where: { id: orderId } });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const result = await provider.createShipment({
      orderNumber: order.orderNumber,
      shippingAddress: order.shippingAddress as Record<string, unknown>,
    });

    await prisma.order.update({
      where: { id: orderId },
      data: {
        trackingNumber: result.trackingNumber,
        shippingMethod: providerName,
      },
    });

    this.logger.log(
      `Shipment created: ${result.trackingNumber} via ${providerName} for order ${order.orderNumber}`,
    );

    return result;
  }

  async getTracking(trackingNumber: string, providerName?: string) {
    if (providerName) {
      const provider = this.providers[providerName];
      if (!provider) {
        throw new BadRequestException(`Provider '${providerName}' not found`);
      }
      return provider.getTracking(trackingNumber);
    }

    // Try all providers
    for (const provider of Object.values(this.providers)) {
      const result = await provider.getTracking(trackingNumber);
      if (result.events.length > 0) {
        return { provider: provider.name, ...result };
      }
    }

    throw new NotFoundException('Tracking information not found');
  }
}
