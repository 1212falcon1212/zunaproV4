import { Injectable, Logger } from '@nestjs/common';
import type {
  ShippingProvider,
  ShippingRate,
  ShipmentResult,
  TrackingResult,
} from './provider.interface';

@Injectable()
export class MngProvider implements ShippingProvider {
  private readonly logger = new Logger(MngProvider.name);
  readonly name = 'mng';

  async calculateRate(weight: number, destination: string): Promise<ShippingRate> {
    const baseCost = 20;
    const perKg = 4;
    const cost = baseCost + weight * perKg;
    const estimatedDays = destination.toLowerCase().includes('istanbul') ? 2 : 3;

    return { cost, estimatedDays };
  }

  async createShipment(order: {
    orderNumber: string;
    shippingAddress: Record<string, unknown>;
    weight?: number;
  }): Promise<ShipmentResult> {
    const trackingNumber = `MNG${Date.now()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    this.logger.log(
      `MNG shipment created: ${trackingNumber} for order ${order.orderNumber}`,
    );
    return { trackingNumber };
  }

  async getTracking(trackingNumber: string): Promise<TrackingResult> {
    return {
      status: 'in_transit',
      events: [
        {
          status: 'picked_up',
          location: 'Izmir Sort Center',
          timestamp: new Date().toISOString(),
          description: 'Package in transit',
        },
      ],
    };
  }
}
