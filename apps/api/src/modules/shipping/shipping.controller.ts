import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Param,
  Req,
  UseGuards,
  ParseFloatPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { Request } from 'express';
import { ShippingService } from './shipping.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ModuleGuard, RequireModule } from '../auth/guards/module.guard';
import { RoleGuard, RequireRoles } from '../auth/guards/role.guard';

@Controller('shipping')
@UseGuards(AuthGuard, ModuleGuard, RoleGuard)
@RequireModule('ecommerce')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Get('rates')
  @RequireRoles('owner', 'admin', 'editor')
  calculateRates(
    @Query('weight', new DefaultValuePipe(1), ParseFloatPipe) weight: number,
    @Query('destination') destination: string,
  ) {
    return this.shippingService.calculateRates(weight, destination || 'Turkey');
  }

  @Post('shipments')
  @RequireRoles('owner', 'admin', 'editor')
  createShipment(
    @Req() req: Request,
    @Body() body: { orderId: string; provider: string },
  ) {
    return this.shippingService.createShipment(
      req.tenant!.slug,
      body.orderId,
      body.provider,
    );
  }

  @Get('track/:trackingNumber')
  @RequireRoles('owner', 'admin', 'editor', 'viewer')
  getTracking(
    @Param('trackingNumber') trackingNumber: string,
    @Query('provider') provider?: string,
  ) {
    return this.shippingService.getTracking(trackingNumber, provider);
  }
}
