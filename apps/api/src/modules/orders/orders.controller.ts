import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { Request } from 'express';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ModuleGuard, RequireModule } from '../auth/guards/module.guard';
import { RoleGuard, RequireRoles } from '../auth/guards/role.guard';
import { StorefrontAuthGuard } from '../storefront/auth/storefront-auth.guard';

// Panel endpoints
@Controller('orders')
@UseGuards(AuthGuard, ModuleGuard, RoleGuard)
@RequireModule('ecommerce')
export class OrdersPanelController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @RequireRoles('owner', 'admin', 'editor', 'viewer')
  findAll(
    @Req() req: Request,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('status') status?: string,
    @Query('customerId') customerId?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('search') search?: string,
    @Query('source') source?: string,
  ) {
    return this.ordersService.findAll(req.tenant!.slug, {
      page,
      limit,
      status,
      customerId,
      dateFrom,
      dateTo,
      search,
      source,
    });
  }

  @Get('stats')
  @RequireRoles('owner', 'admin')
  getStats(@Req() req: Request) {
    return this.ordersService.getStats(req.tenant!.slug);
  }

  @Get(':id')
  @RequireRoles('owner', 'admin', 'editor', 'viewer')
  findOne(@Req() req: Request, @Param('id') id: string) {
    return this.ordersService.findOne(req.tenant!.slug, id);
  }

  @Patch(':id/status')
  @RequireRoles('owner', 'admin', 'editor')
  updateStatus(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(req.tenant!.slug, id, dto);
  }

  @Delete(':id')
  @RequireRoles('owner', 'admin')
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.ordersService.remove(req.tenant!.slug, id);
  }
}

// Storefront endpoints
@Controller('storefront/orders')
export class OrdersStorefrontController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(StorefrontAuthGuard)
  createOrder(
    @Req() req: Request,
    @Body() dto: CreateOrderDto,
  ) {
    const sessionId = (req.headers['x-session-id'] as string) || '';
    return this.ordersService.createFromCart(
      req.tenant!.slug,
      req.customer!.customerId,
      sessionId,
      dto,
    );
  }

  @Get()
  @UseGuards(StorefrontAuthGuard)
  findMyOrders(
    @Req() req: Request,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.ordersService.findByCustomer(
      req.tenant!.slug,
      req.customer!.customerId,
      page,
      limit,
    );
  }

  @Get(':id')
  @UseGuards(StorefrontAuthGuard)
  findMyOrder(@Req() req: Request, @Param('id') id: string) {
    return this.ordersService.findOne(req.tenant!.slug, id);
  }
}
