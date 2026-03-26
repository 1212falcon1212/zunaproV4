import {
  IsObject,
  IsOptional,
  IsString,
  IsNumber,
  IsInt,
  IsArray,
  IsIn,
  IsUUID,
  Min,
  Matches,
} from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsObject()
  name?: Record<string, string>;

  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug must contain only lowercase letters, numbers, and hyphens',
  })
  slug?: string;

  @IsOptional()
  @IsObject()
  description?: Record<string, string>;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  compareAtPrice?: number | null;

  @IsOptional()
  @IsString()
  sku?: string | null;

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
  categoryId?: string | null;

  @IsOptional()
  @IsObject()
  seoMeta?: Record<string, unknown>;

  @IsOptional()
  @IsIn(['draft', 'active', 'archived'])
  status?: string;

  @IsOptional()
  isFeatured?: boolean;
}
