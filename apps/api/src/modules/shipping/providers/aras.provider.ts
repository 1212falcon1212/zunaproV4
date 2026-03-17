import { Injectable, Logger } from '@nestjs/common';
import type {
  ShippingProvider,
  ShippingRate,
  ShipmentResult,
  TrackingResult,
} from './provider.interface';

@Injectable()
export class ArasProvider implements ShippingProvider {
  private readonly logger = new Logger(ArasProvider.name);
  readonly name = 'aras';

  async calculateRate(weight: number, destination: string): Promise<ShippingRate> {
    const baseCost = 22;
    const perKg = 4.5;
    const cost = baseCost + weight * perKg;
    const estimatedDays = destination.toLowerCase().includes('istanbul') ? 1 : 2;

    return { cost, estimatedDays };
  }

  async createShipment(order: {
    orderNumber: string;
    shippingAddress: Record<string, unknown>;
    weight?: number;
  }): Promise<ShipmentResult> {
    const trackingNumber = `AR${Date.now()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    this.logger.log(
      `Aras shipment created: ${trackingNumber} for order ${order.orderNumber}`,
    );
    return { trackingNumber };
  }

  async getTracking(trackingNumber: string): Promise<TrackingResult> {
    return {
      status: 'in_transit',
      events: [
        {
          status: 'picked_up',
          location: 'Ankara Distribution Center',
          timestamp: new Date().toISOString(),
          description: 'Package received at distribution center',
        },
      ],
    };
  }
}
