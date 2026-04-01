import { IsArray, IsString, IsOptional } from 'class-validator';

export class ProductSendDto {
  @IsArray() @IsString({ each: true }) productIds!: string[];
}

export class ProductImportDto {
  @IsOptional() @IsArray() @IsString({ each: true }) productIds?: string[];
  @IsOptional() page?: number;
  @IsOptional() size?: number;
  @IsOptional() approved?: boolean;
  @IsOptional() onSale?: boolean;
  @IsOptional() barcode?: string;
}
