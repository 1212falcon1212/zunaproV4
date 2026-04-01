import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { VariantTypesController } from './variant-types.controller';
import { VariantTypesService } from './variant-types.service';
import { SearchModule } from '../search/search.module';

@Module({
  imports: [SearchModule],
  controllers: [ProductsController, VariantTypesController],
  providers: [ProductsService, VariantTypesService],
  exports: [ProductsService, VariantTypesService],
})
export class ProductsModule {}
