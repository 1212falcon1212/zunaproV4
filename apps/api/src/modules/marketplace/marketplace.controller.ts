import {
  Controller,
  Get,
  Post,
  Put,
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
import { MarketplaceSyncService } from './marketplace-sync.service';
import { MarketplaceConnectDto } from './dto/connect.dto';
import { CategoryMappingDto } from './dto/category-mapping.dto';
import { ProductSendDto, ProductImportDto } from './dto/product-send.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ModuleGuard, RequireModule } from '../auth/guards/module.guard';
import { RoleGuard, RequireRoles } from '../auth/guards/role.guard';
import { CurrencyService } from './currency.service';

@Controller('marketplace')
@UseGuards(AuthGuard, ModuleGuard, RoleGuard)
@RequireModule('marketplace')
export class MarketplaceController {
  constructor(
    private readonly syncService: MarketplaceSyncService,
    private readonly currencyService: CurrencyService,
  ) {}

  /** Get live exchange rates (TRY base) */
  @Get('currency/rates')
  @RequireRoles('owner', 'admin', 'editor', 'viewer')
  async getCurrencyRates() {
    return this.currencyService.getRates();
  }

  /** Convert TRY amount to target currency */
  @Get('currency/convert')
  @RequireRoles('owner', 'admin', 'editor', 'viewer')
  async convertCurrency(
    @Query('amount') amount: string,
    @Query('to') to: string,
  ) {
    const result = await this.currencyService.convert(parseFloat(amount), to);
    return { from: 'TRY', to, amount: parseFloat(amount), converted: result };
  }

  @Post(':marketplace/connect')
  @RequireRoles('owner', 'admin')
  async connect(
    @Req() req: Request,
    @Param('marketplace') marketplace: string,
    @Body() dto: MarketplaceConnectDto,
  ) {
    return this.syncService.connect(req.tenant!.slug, marketplace, dto);
  }

  @Delete(':marketplace/disconnect')
  @RequireRoles('owner', 'admin')
  async disconnect(
    @Req() req: Request,
    @Param('marketplace') marketplace: string,
  ) {
    return this.syncService.disconnect(req.tenant!.slug, marketplace);
  }

  @Get(':marketplace/status')
  @RequireRoles('owner', 'admin', 'editor', 'viewer')
  async status(
    @Req() req: Request,
    @Param('marketplace') marketplace: string,
  ) {
    return this.syncService.getStatus(req.tenant!.slug, marketplace);
  }

  @Post(':marketplace/sync-categories')
  @RequireRoles('owner', 'admin')
  async syncCategories(
    @Req() req: Request,
    @Param('marketplace') marketplace: string,
  ) {
    return this.syncService.syncCategories(req.tenant!.slug, marketplace);
  }

  @Get(':marketplace/categories')
  @RequireRoles('owner', 'admin', 'editor')
  async getCategories(
    @Req() req: Request,
    @Param('marketplace') marketplace: string,
    @Query('search') search?: string,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit?: number,
  ) {
    return this.syncService.getCategories(
      req.tenant!.slug,
      marketplace,
      search,
      page,
      limit,
    );
  }

  @Get(':marketplace/categories/:id/attributes')
  @RequireRoles('owner', 'admin', 'editor')
  async getCategoryAttributes(
    @Req() req: Request,
    @Param('marketplace') marketplace: string,
    @Param('id') categoryId: string,
  ) {
    return this.syncService.getCategoryAttributes(
      req.tenant!.slug,
      marketplace,
      categoryId,
    );
  }

  @Get(':marketplace/category-mappings')
  @RequireRoles('owner', 'admin', 'editor')
  async getCategoryMappings(
    @Req() req: Request,
    @Param('marketplace') marketplace: string,
  ) {
    return this.syncService.getCategoryMappings(req.tenant!.slug, marketplace);
  }

  @Put(':marketplace/category-mappings')
  @RequireRoles('owner', 'admin')
  async saveCategoryMapping(
    @Req() req: Request,
    @Param('marketplace') marketplace: string,
    @Body() dto: CategoryMappingDto,
  ) {
    return this.syncService.saveCategoryMapping(
      req.tenant!.slug,
      marketplace,
      dto,
    );
  }

  @Post(':marketplace/auto-match-categories')
  @RequireRoles('owner', 'admin')
  async autoMatchCategories(
    @Req() req: Request,
    @Param('marketplace') marketplace: string,
  ) {
    return this.syncService.autoMatchCategories(req.tenant!.slug, marketplace);
  }

  @Get(':marketplace/products')
  @RequireRoles('owner', 'admin', 'editor')
  async getMarketplaceProducts(
    @Req() req: Request,
    @Param('marketplace') marketplace: string,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page?: number,
    @Query('size', new DefaultValuePipe(50), ParseIntPipe) size?: number,
    @Query('approved') approved?: string,
    @Query('onSale') onSale?: string,
    @Query('barcode') barcode?: string,
  ) {
    return this.syncService.getMarketplaceProducts(
      req.tenant!.slug,
      marketplace,
      {
        page,
        size,
        approved: approved ? approved === 'true' : undefined,
        onSale: onSale ? onSale === 'true' : undefined,
        barcode,
      },
    );
  }

  @Post(':marketplace/import')
  @RequireRoles('owner', 'admin')
  async importProducts(
    @Req() req: Request,
    @Param('marketplace') marketplace: string,
    @Body() dto: ProductImportDto,
  ) {
    return this.syncService.importProducts(req.tenant!.slug, marketplace, {
      productIds: dto.productIds,
      page: dto.page ?? 0,
      size: dto.size ?? 50,
      approved: dto.approved,
      onSale: dto.onSale,
      barcode: dto.barcode,
    });
  }

  @Get(':marketplace/local-products')
  @RequireRoles('owner', 'admin', 'editor')
  async getLocalProducts(
    @Req() req: Request,
    @Param('marketplace') marketplace: string,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit?: number,
  ) {
    return this.syncService.getLocalProducts(
      req.tenant!.slug,
      marketplace,
      page,
      limit,
    );
  }

  @Post(':marketplace/products/send')
  @RequireRoles('owner', 'admin')
  async sendProducts(
    @Req() req: Request,
    @Param('marketplace') marketplace: string,
    @Body() dto: ProductSendDto,
  ) {
    return this.syncService.sendProducts(
      req.tenant!.slug,
      marketplace,
      dto.productIds,
    );
  }

  @Post(':marketplace/sync-stock')
  @RequireRoles('owner', 'admin')
  async syncPriceAndStock(
    @Req() req: Request,
    @Param('marketplace') marketplace: string,
    @Body() body?: { productIds?: string[] },
  ) {
    return this.syncService.syncPriceAndStock(
      req.tenant!.slug,
      marketplace,
      body?.productIds,
    );
  }

  @Get(':marketplace/sync-logs')
  @RequireRoles('owner', 'admin', 'editor', 'viewer')
  async getSyncLogs(
    @Req() req: Request,
    @Param('marketplace') marketplace: string,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit?: number,
  ) {
    return this.syncService.getSyncLogs(
      req.tenant!.slug,
      marketplace,
      page,
      limit,
    );
  }

  @Get(':marketplace/batch/:batchId')
  @RequireRoles('owner', 'admin', 'editor')
  async getBatchStatus(
    @Req() req: Request,
    @Param('marketplace') marketplace: string,
    @Param('batchId') batchId: string,
  ) {
    return this.syncService.getBatchStatus(
      req.tenant!.slug,
      marketplace,
      batchId,
    );
  }

  @Post(':marketplace/products/prepare-send')
  @RequireRoles('owner', 'admin', 'editor')
  async prepareSend(
    @Req() req: Request,
    @Param('marketplace') mp: string,
    @Body() body: { productIds: string[] },
  ) {
    return this.syncService.prepareSend(req.tenant!.slug, mp, body.productIds);
  }

  @Post(':marketplace/products/save-attributes')
  @RequireRoles('owner', 'admin', 'editor')
  async saveAttributes(
    @Req() req: Request,
    @Param('marketplace') mp: string,
    @Body() body: { productId: string; attributes: Array<{ attributeId: string; attributeName: string; value: string; valueId?: string }> },
  ) {
    return this.syncService.saveProductAttributes(req.tenant!.slug, mp, body.productId, body.attributes);
  }

  @Post(':marketplace/sync-brands')
  @RequireRoles('owner', 'admin')
  async syncBrands(
    @Req() req: Request,
    @Param('marketplace') mp: string,
  ) {
    return this.syncService.syncBrands(req.tenant!.slug, mp);
  }

  @Get(':marketplace/brands')
  @RequireRoles('owner', 'admin', 'editor', 'viewer')
  async searchBrands(
    @Req() req: Request,
    @Param('marketplace') mp: string,
    @Query('q') query?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.syncService.searchBrands(req.tenant!.slug, mp, query, parseInt(page ?? '0'), parseInt(limit ?? '50'));
  }

  @Get(':marketplace/batch/:batchId/check')
  @RequireRoles('owner', 'admin', 'editor')
  async checkBatch(
    @Req() req: Request,
    @Param('marketplace') mp: string,
    @Param('batchId') batchId: string,
  ) {
    return this.syncService.checkBatch(req.tenant!.slug, mp, batchId);
  }

  @Get(':marketplace/brand-mappings')
  @RequireRoles('owner', 'admin', 'editor', 'viewer')
  async getBrandMappings(
    @Req() req: Request,
    @Param('marketplace') mp: string,
  ) {
    return this.syncService.getBrandMappings(req.tenant!.slug, mp);
  }

  @Post(':marketplace/brand-mappings')
  @RequireRoles('owner', 'admin')
  async saveBrandMapping(
    @Req() req: Request,
    @Param('marketplace') mp: string,
    @Body() body: { localBrand: string; marketplaceBrandId: string },
  ) {
    return this.syncService.saveBrandMapping(req.tenant!.slug, mp, body.localBrand, body.marketplaceBrandId);
  }

  @Post(':marketplace/auto-match-brands')
  @RequireRoles('owner', 'admin')
  async autoMatchBrands(
    @Req() req: Request,
    @Param('marketplace') mp: string,
  ) {
    return this.syncService.autoMatchBrands(req.tenant!.slug, mp);
  }
}
