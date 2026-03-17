import { Injectable, Logger } from '@nestjs/common';
import type {
  ShippingProvider,
  ShippingRate,
  ShipmentResult,
  TrackingResult,
} from './provider.interface';

@Injectable()
export class YurticiProvider implements ShippingProvider {
  private readonly logger = new Logger(YurticiProvider.name);
  readonly name = 'yurtici';

  async calculateRate(weight: number, destination: string): Promise<ShippingRate> {
    // Stub: realistic rate calculation
    const baseCost = 25;
    const perKg = 5;
    const cost = baseCost + weight * perKg;
    const estimatedDays = destination.toLowerCase().includes('istanbul') ? 1 : 3;

    return { cost, estimatedDays };
  }

  async createShipment(order: {
    orderNumber: string;
    shippingAddress: Record<string, unknown>;
    weight?: number;
  }): Promise<ShipmentResult> {
    const trackingNumber = `YK${Date.now()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    this.logger.log(
      `Yurtici shipment created: ${trackingNumber} for order ${order.orderNumber}`,
    );
    return { trackingNumber };
  }

  async getTracking(trackingNumber: string): Promise<TrackingResult> {
    return {
      status: 'in_transit',
      events: [
        {
          status: 'picked_up',
          location: 'Istanbul Sort Center',
          timestamp: new Date().toISOString(),
          description: 'Package picked up from sender',
        },
      ],
    };
  }
}
