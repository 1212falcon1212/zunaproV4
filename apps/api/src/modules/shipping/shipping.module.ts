import { Module } from '@nestjs/common';
import { ShippingController } from './shipping.controller';
import { ShippingService } from './shipping.service';
import { YurticiProvider } from './providers/yurtici.provider';
import { ArasProvider } from './providers/aras.provider';
import { MngProvider } from './providers/mng.provider';

@Module({
  controllers: [ShippingController],
  providers: [ShippingService, YurticiProvider, ArasProvider, MngProvider],
  exports: [ShippingService],
})
export class ShippingModule {}
