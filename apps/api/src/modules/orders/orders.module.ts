import { Module } from '@nestjs/common';
import { OrdersPanelController, OrdersStorefrontController } from './orders.controller';
import { OrdersService } from './orders.service';
import { CartModule } from '../cart/cart.module';
import { StorefrontModule } from '../storefront/storefront.module';

@Module({
  imports: [CartModule, StorefrontModule],
  controllers: [OrdersPanelController, OrdersStorefrontController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
