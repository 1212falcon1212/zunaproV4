import { Module } from '@nestjs/common';
import { MarketplaceController } from './marketplace.controller';
import { TrendyolService } from './trendyol.service';

@Module({
  controllers: [MarketplaceController],
  providers: [TrendyolService],
  exports: [TrendyolService],
})
export class MarketplaceModule {}
