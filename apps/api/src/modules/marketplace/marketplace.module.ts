import { Module } from '@nestjs/common';
import { MarketplaceController } from './marketplace.controller';
import { MarketplaceSyncService } from './marketplace-sync.service';
import { TrendyolService } from './trendyol.service';
import { HepsiburadaService } from './hepsiburada.service';
import { CiceksepetiService } from './ciceksepeti.service';
import { CurrencyService } from './currency.service';
import { RedisModule } from '../../common/redis';

@Module({
  imports: [RedisModule],
  controllers: [MarketplaceController],
  providers: [
    MarketplaceSyncService,
    TrendyolService,
    HepsiburadaService,
    CiceksepetiService,
    CurrencyService,
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
