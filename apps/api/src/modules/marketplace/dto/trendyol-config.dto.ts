import { IsString, IsNotEmpty } from 'class-validator';

export class TrendyolConfigDto {
  @IsString()
  @IsNotEmpty()
  supplierId!: string;

  @IsString()
  @IsNotEmpty()
  apiKey!: string;

  @IsString()
  @IsNotEmpty()
  apiSecret!: string;
}

export class TrendyolImportDto {
  @IsString()
  supplierId?: string;

  page?: number;
  size?: number;
  approved?: boolean;
  onSale?: boolean;
  barcode?: string;
  stockCode?: string;
}
