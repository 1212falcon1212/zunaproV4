import {
  IsObject,
  IsOptional,
  IsString,
  IsInt,
  IsUUID,
  Matches,
  Min,
} from 'class-validator';

export class CreateCategoryDto {
  @IsObject()
  name!: Record<string, string>;

  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug must contain only lowercase letters, numbers, and hyphens',
  })
  slug?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsUUID()
  parentId?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @IsOptional()
  @IsObject()
  seoMeta?: Record<string, unknown>;
}
