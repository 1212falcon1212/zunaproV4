import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class MarketplaceConnectDto {
  @IsString() @IsNotEmpty() apiKey!: string;
  @IsString() @IsNotEmpty() apiSecret!: string;
  @IsString() @IsOptional() supplierId?: string;  // required for Trendyol/HB
  @IsString() @IsOptional() merchantId?: string;   // used by HB
}
