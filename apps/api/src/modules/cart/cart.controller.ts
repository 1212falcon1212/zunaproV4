import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CartService } from './cart.service';
import { randomUUID } from 'crypto';

@Controller('storefront/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  private getSessionId(req: Request, res: Response): string {
    let sessionId = req.headers['x-session-id'] as string;
    if (!sessionId) {
      sessionId = randomUUID();
    }
    res.setHeader('X-Session-Id', sessionId);
    return sessionId;
  }

  @Get()
  getCart(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const sessionId = this.getSessionId(req, res);
    return this.cartService.getCart(req.tenant!.slug, sessionId);
  }

  @Post('items')
  addItem(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() body: { productId: string; quantity: number; variantIndex?: number },
  ) {
    const sessionId = this.getSessionId(req, res);
    return this.cartService.addItem(
      req.tenant!.slug,
      sessionId,
      body.productId,
      body.quantity,
      body.variantIndex,
    );
  }

  @Patch('items/:productId')
  updateItem(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Param('productId') productId: string,
    @Body() body: { quantity: number },
  ) {
    const sessionId = this.getSessionId(req, res);
    return this.cartService.updateItemQuantity(
      req.tenant!.slug,
      sessionId,
      productId,
      body.quantity,
    );
  }

  @Delete('items/:productId')
  removeItem(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Param('productId') productId: string,
  ) {
    const sessionId = this.getSessionId(req, res);
    return this.cartService.removeItem(req.tenant!.slug, sessionId, productId);
  }

  @Delete()
  clearCart(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const sessionId = this.getSessionId(req, res);
    return this.cartService.clearCart(req.tenant!.slug, sessionId);
  }
}
