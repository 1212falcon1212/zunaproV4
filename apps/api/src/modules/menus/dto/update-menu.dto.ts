import { IsString, IsObject, IsOptional, IsArray, IsBoolean, IsNumber } from 'class-validator';

export class UpdateMenuDto {
  @IsObject()
  @IsOptional()
  name?: Record<string, string>;

  @IsString()
  @IsOptional()
  location?: string;

  @IsArray()
  @IsOptional()
  items?: unknown[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNumber()
  @IsOptional()
  sortOrder?: number;
}
