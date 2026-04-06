import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { getTenantClient } from '@zunapro/db';
import { RedisService } from '../../common/redis/redis.service';
import { CartService } from '../cart/cart.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import type { OrderItem, Cart } from '@zunapro/types';

const VALID_TRANSITIONS: Record<string, string[]> = {
  pending: ['preparing', 'cancelled'],
  preparing: ['shipped', 'cancelled', 'refunded'],
  shipped: ['delivered', 'cancelled', 'refunded'],
  delivered: ['completed', 'refunded'],
  completed: ['refunded'],
  cancelled: [],
  refunded: [],
};

interface FindOrdersOptions {
  page?: number;
  limit?: number;
  status?: string;
  customerId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  source?: string;
}

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private readonly redis: RedisService,
    private readonly cartService: CartService,
  ) {}

  private async generateOrderNumber(tenantSlug: string): Promise<string> {
    const num = await this.redis.incr(`order_number:${tenantSlug}`);
    return `ORD-${String(num).padStart(6, '0')}`;
  }

  async createFromCart(
    tenantSlug: string,
    customerId: string,
    sessionId: string,
    dto: CreateOrderDto,
  ) {
    const prisma = getTenantClient(tenantSlug);
    const cart = await this.cartService.getCart(tenantSlug, sessionId);

    if (cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Validate stock and build order items
    const orderItems: OrderItem[] = [];
    let subtotal = 0;

    for (const cartItem of cart.items) {
      const product = await prisma.product.findUnique({
        where: { id: cartItem.productId },
      });

      if (!product || product.status !== 'active') {
        throw new BadRequestException(
          `Product "${cartItem.slug}" is no longer available`,
        );
      }

      if (product.stock < cartItem.quantity) {
        throw new BadRequestException(
          `Insufficient stock for "${cartItem.slug}". Available: ${product.stock}`,
        );
      }

      const price = Number(product.price);
      const total = price * cartItem.quantity;
      subtotal += total;

      orderItems.push({
        productId: cartItem.productId,
        name: product.name as Record<string, string>,
        slug: product.slug,
        price,
        quantity: cartItem.quantity,
        total,
        image: (product.images as string[])[0],
        variantIndex: cartItem.variantIndex,
        variantName: cartItem.variantName,
        sku: product.sku ?? undefined,
      });
    }

    const taxAmount = 0; // Tax calculation placeholder — configured per tenant
    const shippingCost = 0; // Will be set after shipping method selection
    const discountAmount = 0;
    const totalAmount = subtotal + taxAmount + shippingCost - discountAmount;
    const orderNumber = await this.generateOrderNumber(tenantSlug);

    // Create order and decrement stock in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Decrement stock for each item
      for (const item of orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return tx.order.create({
        data: {
          orderNumber,
          customerId,
          status: 'pending',
          totalAmount,
          subtotalAmount: subtotal,
          taxAmount,
          discountAmount,
          shippingCost,
          currency: 'TRY',
          items: orderItems as unknown as Parameters<typeof tx.order.create>[0]['data']['items'],
          shippingAddress: dto.shippingAddress as unknown as Parameters<typeof tx.order.create>[0]['data']['shippingAddress'],
          billingAddress: (dto.billingAddress ?? dto.shippingAddress) as unknown as Parameters<typeof tx.order.create>[0]['data']['billingAddress'],
          paymentMethod: dto.paymentMethod,
          shippingMethod: dto.shippingMethod,
          notes: dto.notes,
          locale: dto.locale ?? 'en',
        },
        include: {
          customer: {
            select: { id: true, email: true, firstName: true, lastName: true },
          },
        },
      });
    });

    // Clear cart after successful order creation
    await this.cartService.clearCart(tenantSlug, sessionId);

    this.logger.log(
      `Order created: ${orderNumber} (tenant: ${tenantSlug})`,
    );

    return order;
  }

  async findAll(tenantSlug: string, options: FindOrdersOptions = {}) {
    const {
      page = 1,
      limit = 20,
      status,
      customerId,
      dateFrom,
      dateTo,
      search,
      source,
    } = options;
    const prisma = getTenantClient(tenantSlug);
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (customerId) where.customerId = customerId;
    if (dateFrom || dateTo) {
      const createdAt: Record<string, Date> = {};
      if (dateFrom) createdAt.gte = new Date(dateFrom);
      if (dateTo) createdAt.lte = new Date(dateTo);
      where.createdAt = createdAt;
    }
    if (source) where.source = source;
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: {
            select: { id: true, email: true, firstName: true, lastName: true },
          },
        },
      }),
      prisma.order.count({ where }),
    ]);

    return {
      data: orders,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(tenantSlug: string, id: string) {
    const prisma = getTenantClient(tenantSlug);

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async findByCustomer(tenantSlug: string, customerId: string, page = 1, limit = 20) {
    const prisma = getTenantClient(tenantSlug);
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { customerId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where: { customerId } }),
    ]);

    return {
      data: orders,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async updateStatus(
    tenantSlug: string,
    id: string,
    dto: UpdateOrderStatusDto,
  ) {
    const prisma = getTenantClient(tenantSlug);

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    const allowedTransitions = VALID_TRANSITIONS[order.status];
    if (!allowedTransitions?.includes(dto.status)) {
      throw new BadRequestException(
        `Cannot transition from '${order.status}' to '${dto.status}'`,
      );
    }

    const updateData: Record<string, unknown> = { status: dto.status };

    if (dto.trackingNumber) {
      updateData.trackingNumber = dto.trackingNumber;
    }
    if (dto.notes) {
      updateData.notes = dto.notes;
    }

    // Restore stock on cancellation or refund
    if (dto.status === 'cancelled' || dto.status === 'refunded') {
      const items = order.items as unknown as OrderItem[];
      await prisma.$transaction(async (tx) => {
        for (const item of items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }
      });

      if (dto.status === 'refunded') {
        updateData.paymentStatus = 'refunded';
      }
    }

    const updated = await prisma.order.update({
      where: { id },
      data: updateData as Parameters<typeof prisma.order.update>[0]['data'],
      include: {
        customer: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
      },
    });

    this.logger.log(
      `Order ${order.orderNumber} status: ${order.status} → ${dto.status} (tenant: ${tenantSlug})`,
    );

    return updated;
  }

  async remove(tenantSlug: string, id: string) {
    const prisma = getTenantClient(tenantSlug);
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }
    await prisma.order.delete({ where: { id } });
    this.logger.log(`Order deleted: ${id} (tenant: ${tenantSlug})`);
    return { deleted: true };
  }

  async getStats(tenantSlug: string) {
    const prisma = getTenantClient(tenantSlug);

    const [totalOrders, ordersByStatus, revenueResult] = await Promise.all([
      prisma.order.count(),
      prisma.order.groupBy({
        by: ['status'],
        _count: { id: true },
      }),
      prisma.order.aggregate({
        where: { paymentStatus: 'paid' },
        _sum: { totalAmount: true },
      }),
    ]);

    const statusCounts: Record<string, number> = {};
    for (const group of ordersByStatus) {
      statusCounts[group.status] = group._count.id;
    }

    return {
      totalOrders,
      totalRevenue: Number(revenueResult._sum.totalAmount ?? 0),
      byStatus: statusCounts,
    };
  }
}
