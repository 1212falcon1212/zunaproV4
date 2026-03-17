import {
  IsObject,
  IsOptional,
  IsString,
  IsBoolean,
  IsArray,
  IsIn,
  IsInt,
  Min,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class BlockStyleDto {
  @IsOptional()
  @IsString()
  padding?: string;

  @IsOptional()
  @IsString()
  margin?: string;

  @IsOptional()
  @IsString()
  backgroundColor?: string;

  @IsOptional()
  @IsString()
  textColor?: string;

  @IsOptional()
  @IsString()
  borderRadius?: string;

  @IsOptional()
  @IsString()
  maxWidth?: string;

  @IsOptional()
  @IsIn(['left', 'center', 'right'])
  textAlign?: 'left' | 'center' | 'right';

  @IsOptional()
  @IsString()
  customCss?: string;
}

export class BlockVisibilityDto {
  @IsBoolean()
  desktop!: boolean;

  @IsBoolean()
  tablet!: boolean;

  @IsBoolean()
  mobile!: boolean;
}

export class BlockDto {
  @IsString()
  id!: string;

  @IsString()
  type!: string;

  @IsObject()
  props!: Record<string, unknown>;

  @IsOptional()
  @ValidateNested()
  @Type(() => BlockStyleDto)
  style?: BlockStyleDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BlockDto)
  children?: BlockDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => BlockVisibilityDto)
  visibility?: BlockVisibilityDto;
}

export class SavePageContentDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BlockDto)
  blocks!: BlockDto[];
}

export class CreatePageDto {
  @IsObject()
  title!: Record<string, string>;

  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9-]+$/, { message: 'Slug must be lowercase alphanumeric with hyphens' })
  slug?: string;

  @IsOptional()
  @IsString()
  template?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @IsObject()
  seoMeta?: Record<string, unknown>;
}

export class UpdatePageMetaDto {
  @IsOptional()
  @IsObject()
  title?: Record<string, string>;

  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9-]+$/, { message: 'Slug must be lowercase alphanumeric with hyphens' })
  slug?: string;

  @IsOptional()
  @IsString()
  template?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @IsObject()
  seoMeta?: Record<string, unknown>;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
