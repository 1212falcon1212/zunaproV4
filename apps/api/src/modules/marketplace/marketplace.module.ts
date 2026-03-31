import { Module } from '@nestjs/common';
import { MarketplaceController } from './marketplace.controller';
import { MarketplaceSyncService } from './marketplace-sync.service';
import { TrendyolService } from './trendyol.service';
import { HepsiburadaService } from './hepsiburada.service';
import { CiceksepetiService } from './ciceksepeti.service';

@Module({
  controllers: [MarketplaceController],
  providers: [
    MarketplaceSyncService,
    TrendyolService,
    HepsiburadaService,
    CiceksepetiService,
  ],
  exports: [
    MarketplaceSyncService,
    TrendyolService,
    HepsiburadaService,
    CiceksepetiService,
  ],
})
export class MarketplaceModule {}
