import {
  IsObject,
  IsOptional,
  IsString,
  IsNumber,
  IsInt,
  IsBoolean,
  IsArray,
  IsIn,
  IsUUID,
  Min,
  Matches,
} from 'class-validator';

export class CreateProductDto {
  @IsObject()
  name!: Record<string, string>;

  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug must contain only lowercase letters, numbers, and hyphens',
  })
  slug?: string;

  @IsOptional()
  @IsObject()
  description?: Record<string, string>;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  compareAtPrice?: number;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsArray()
  variants?: Record<string, unknown>[];

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsObject()
  seoMeta?: Record<string, unknown>;

  @IsOptional()
  @IsIn(['draft', 'active', 'archived'])
  status?: string;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;
}
