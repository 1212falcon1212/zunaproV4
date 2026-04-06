import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { MarketplaceController } from './marketplace.controller';
import { MarketplaceSyncService } from './marketplace-sync.service';
import { TrendyolService } from './trendyol.service';
import { HepsiburadaService } from './hepsiburada.service';
import { CiceksepetiService } from './ciceksepeti.service';
import { CurrencyService } from './currency.service';
import { MarketplaceOrderCronService } from './marketplace-order-cron.service';
import { RedisModule } from '../../common/redis';

@Module({
  imports: [RedisModule, ScheduleModule.forRoot()],
  controllers: [MarketplaceController],
  providers: [
    MarketplaceSyncService,
    TrendyolService,
    HepsiburadaService,
    CiceksepetiService,
    CurrencyService,
    MarketplaceOrderCronService,
  ],
  exports: [
    MarketplaceSyncService,
    TrendyolService,
    HepsiburadaService,
    CiceksepetiService,
    CurrencyService,
  ],
})
export class MarketplaceModule {}
