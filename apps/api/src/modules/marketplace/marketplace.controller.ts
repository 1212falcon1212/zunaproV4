import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Query,
  Req,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { Request } from 'express';
import { TrendyolService } from './trendyol.service';
import { TrendyolConfigDto, TrendyolImportDto } from './dto/trendyol-config.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ModuleGuard, RequireModule } from '../auth/guards/module.guard';
import { RoleGuard, RequireRoles } from '../auth/guards/role.guard';

@Controller('marketplace')
@UseGuards(AuthGuard, ModuleGuard, RoleGuard)
@RequireModule('marketplace')
export class MarketplaceController {
  constructor(private readonly trendyolService: TrendyolService) {}

  /** Save Trendyol API credentials */
  @Post('trendyol/connect')
  @RequireRoles('owner', 'admin')
  async connect(@Req() req: Request, @Body() dto: TrendyolConfigDto) {
    const credentials = {
      supplierId: dto.supplierId,
      apiKey: dto.apiKey,
      apiSecret: dto.apiSecret,
    };

    const isValid = await this.trendyolService.testConnection(credentials);
    if (!isValid) {
      return {
        success: false,
        message: 'Connection failed. Check your credentials.',
      };
    }

    await this.trendyolService.saveCredentials(req.tenant!.slug, credentials);

    return {
      success: true,
      message: 'Trendyol connected successfully.',
    };
  }

  /** Disconnect Trendyol */
  @Delete('trendyol/disconnect')
  @RequireRoles('owner', 'admin')
  async disconnect(@Req() req: Request) {
    await this.trendyolService.removeCredentials(req.tenant!.slug);
    return { success: true, message: 'Trendyol disconnected.' };
  }

  /** Get connection status */
  @Get('trendyol/status')
  @RequireRoles('owner', 'admin', 'editor', 'viewer')
  async status(@Req() req: Request) {
    const creds = await this.trendyolService.getCredentials(req.tenant!.slug);
    if (!creds) {
      return { connected: false };
    }

    const isAlive = await this.trendyolService.testConnection(creds);
    return {
      connected: isAlive,
      supplierId: creds.supplierId,
    };
  }

  /** List products from Trendyol (preview before import) */
  @Get('trendyol/products')
  @RequireRoles('owner', 'admin', 'editor')
  async listProducts(
    @Req() req: Request,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(50), ParseIntPipe) size: number,
    @Query('approved') approved?: string,
    @Query('onSale') onSale?: string,
    @Query('barcode') barcode?: string,
    @Query('stockCode') stockCode?: string,
  ) {
    const creds = await this.trendyolService.getCredentials(req.tenant!.slug);
    if (!creds) {
      return { error: 'Trendyol not connected', connected: false };
    }

    return this.trendyolService.getProducts(creds, {
      page,
      size,
      approved: approved ? approved === 'true' : undefined,
      onSale: onSale ? onSale === 'true' : undefined,
      barcode,
      stockCode,
    });
  }

  /** Import products from Trendyol into tenant's store */
  @Post('trendyol/import')
  @RequireRoles('owner', 'admin')
  async importProducts(@Req() req: Request, @Body() dto: TrendyolImportDto) {
    const creds = await this.trendyolService.getCredentials(req.tenant!.slug);
    if (!creds) {
      return { error: 'Trendyol not connected', connected: false };
    }

    return this.trendyolService.importProductsToStore(req.tenant!.slug, creds, {
      page: dto.page ?? 0,
      size: dto.size ?? 50,
      approved: dto.approved,
      onSale: dto.onSale,
      barcode: dto.barcode,
      stockCode: dto.stockCode,
    });
  }
}
