export interface ShippingRate {
  cost: number;
  estimatedDays: number;
}

export interface ShipmentResult {
  trackingNumber: string;
  labelUrl?: string;
}

export interface TrackingEvent {
  status: string;
  location?: string;
  timestamp: string;
  description?: string;
}

export interface TrackingResult {
  status: string;
  events: TrackingEvent[];
}

export interface ShippingProvider {
  name: string;
  calculateRate(weight: number, destination: string): Promise<ShippingRate>;
  createShipment(order: {
    orderNumber: string;
    shippingAddress: Record<string, unknown>;
    weight?: number;
  }): Promise<ShipmentResult>;
  getTracking(trackingNumber: string): Promise<TrackingResult>;
}
