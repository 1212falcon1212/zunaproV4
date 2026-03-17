import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { getTenantClient } from '@zunapro/db';
import { RedisService } from '../../common/redis/redis.service';
import type { Cart, CartItem } from '@zunapro/types';

const CART_TTL = 7 * 24 * 60 * 60; // 7 days in seconds

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);

  constructor(private readonly redis: RedisService) {}

  private cartKey(tenantSlug: string, sessionId: string): string {
    return `cart:${tenantSlug}:${sessionId}`;
  }

  async getCart(tenantSlug: string, sessionId: string): Promise<Cart> {
    const cart = await this.redis.getJson<Cart>(
      this.cartKey(tenantSlug, sessionId),
    );
    return cart ?? { items: [], updatedAt: new Date().toISOString() };
  }

  async addItem(
    tenantSlug: string,
    sessionId: string,
    productId: string,
    quantity: number,
    variantIndex?: number,
  ): Promise<Cart> {
    if (quantity < 1) {
      throw new BadRequestException('Quantity must be at least 1');
    }

    const prisma = getTenantClient(tenantSlug);
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || product.status !== 'active') {
      throw new NotFoundException('Product not found or not available');
    }

    const cart = await this.getCart(tenantSlug, sessionId);
    const existingIndex = cart.items.findIndex(
      (item) =>
        item.productId === productId && item.variantIndex === variantIndex,
    );

    const requestedQty =
      existingIndex >= 0 ? cart.items[existingIndex].quantity + quantity : quantity;

    if (requestedQty > product.stock) {
      throw new BadRequestException(
        `Insufficient stock. Available: ${product.stock}`,
      );
    }

    const images = product.images as string[];
    let variantName: string | undefined;
    if (variantIndex !== undefined) {
      const variants = product.variants as Array<{ name?: string }>;
      variantName = variants[variantIndex]?.name;
    }

    if (existingIndex >= 0) {
      cart.items[existingIndex].quantity = requestedQty;
      cart.items[existingIndex].price = Number(product.price);
    } else {
      const item: CartItem = {
        productId,
        name: product.name as Record<string, string>,
        slug: product.slug,
        price: Number(product.price),
        quantity,
        image: images[0],
        variantIndex,
        variantName,
      };
      cart.items.push(item);
    }

    cart.updatedAt = new Date().toISOString();
    await this.redis.setJson(this.cartKey(tenantSlug, sessionId), cart, CART_TTL);
    return cart;
  }

  async updateItemQuantity(
    tenantSlug: string,
    sessionId: string,
    productId: string,
    quantity: number,
  ): Promise<Cart> {
    if (quantity < 1) {
      throw new BadRequestException('Quantity must be at least 1');
    }

    const prisma = getTenantClient(tenantSlug);
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (product && quantity > product.stock) {
      throw new BadRequestException(
        `Insufficient stock. Available: ${product.stock}`,
      );
    }

    const cart = await this.getCart(tenantSlug, sessionId);
    const itemIndex = cart.items.findIndex(
      (item) => item.productId === productId,
    );

    if (itemIndex === -1) {
      throw new NotFoundException('Item not found in cart');
    }

    cart.items[itemIndex].quantity = quantity;
    if (product) {
      cart.items[itemIndex].price = Number(product.price);
    }

    cart.updatedAt = new Date().toISOString();
    await this.redis.setJson(this.cartKey(tenantSlug, sessionId), cart, CART_TTL);
    return cart;
  }

  async removeItem(
    tenantSlug: string,
    sessionId: string,
    productId: string,
  ): Promise<Cart> {
    const cart = await this.getCart(tenantSlug, sessionId);
    cart.items = cart.items.filter((item) => item.productId !== productId);
    cart.updatedAt = new Date().toISOString();
    await this.redis.setJson(this.cartKey(tenantSlug, sessionId), cart, CART_TTL);
    return cart;
  }

  async clearCart(tenantSlug: string, sessionId: string): Promise<void> {
    await this.redis.del(this.cartKey(tenantSlug, sessionId));
  }
}
