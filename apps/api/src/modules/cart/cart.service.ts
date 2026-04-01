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
    variantId?: string,
    variantIndex?: number,
  ): Promise<Cart> {
    if (quantity < 1) {
      throw new BadRequestException('Quantity must be at least 1');
    }

    const prisma = getTenantClient(tenantSlug);
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        productVariants: variantId
          ? {
              where: { id: variantId, isActive: true },
              include: {
                optionValues: {
                  include: {
                    variantOption: { include: { variantType: true } },
                  },
                },
              },
            }
          : false,
      },
    });

    if (!product || product.status !== 'active') {
      throw new NotFoundException('Product not found or not available');
    }

    let itemPrice = Number(product.price);
    let availableStock = product.stock;
    let variantName: string | undefined;
    let resolvedVariantId: string | undefined;
    let itemImage: string | undefined = (product.images as string[])[0];

    if (variantId && 'productVariants' in product) {
      const variants = (product as unknown as { productVariants: Array<{
        id: string;
        price: unknown;
        stock: number;
        images: unknown;
        optionValues: Array<{
          variantOption: { name: Record<string, string>; variantType: { name: Record<string, string> } };
        }>;
      }> }).productVariants;
      const pv = variants[0];
      if (!pv) {
        throw new NotFoundException('Variant not found or not active');
      }
      itemPrice = Number(pv.price);
      availableStock = pv.stock;
      resolvedVariantId = pv.id;
      const pvImages = pv.images as string[];
      if (pvImages.length > 0) {
        itemImage = pvImages[0];
      }
      variantName = pv.optionValues
        .map((ov) => {
          const optName = ov.variantOption.name.en || Object.values(ov.variantOption.name)[0] || '';
          return optName;
        })
        .join(' / ');
    } else if (variantIndex !== undefined) {
      const legacyVariants = product.variants as Array<{ name?: string; price?: number; stock?: number }>;
      const legacy = legacyVariants[variantIndex];
      if (legacy) {
        variantName = legacy.name;
        if (legacy.price !== undefined) itemPrice = legacy.price;
        if (legacy.stock !== undefined) availableStock = legacy.stock;
      }
    }

    const cart = await this.getCart(tenantSlug, sessionId);
    const existingIndex = cart.items.findIndex(
      (item) =>
        item.productId === productId &&
        (resolvedVariantId ? item.variantId === resolvedVariantId : item.variantIndex === variantIndex),
    );

    const requestedQty =
      existingIndex >= 0 ? cart.items[existingIndex].quantity + quantity : quantity;

    if (requestedQty > availableStock) {
      throw new BadRequestException(
        `Insufficient stock. Available: ${availableStock}`,
      );
    }

    if (existingIndex >= 0) {
      cart.items[existingIndex].quantity = requestedQty;
      cart.items[existingIndex].price = itemPrice;
    } else {
      const item: CartItem = {
        productId,
        name: product.name as Record<string, string>,
        slug: product.slug,
        price: itemPrice,
        quantity,
        image: itemImage,
        variantId: resolvedVariantId,
        variantName,
        variantIndex: resolvedVariantId ? undefined : variantIndex,
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
