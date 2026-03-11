import {
  IsString,
  IsOptional,
  IsArray,
  MinLength,
  MaxLength,
  Matches,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class BrandingDto {
  @IsString()
  primaryColor!: string;

  @IsString()
  secondaryColor!: string;

  @IsString()
  accentColor!: string;
}

export class CreateTenantDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^[a-z0-9-]+$/, {
    message:
      'Slug must contain only lowercase letters, numbers, and hyphens',
  })
  slug!: string;

  @IsString()
  planId!: string;

  @IsString()
  sector!: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  locales!: string[];

  @IsString()
  defaultLocale!: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  currencies!: string[];

  @IsString()
  defaultCurrency!: string;

  @IsString()
  @IsOptional()
  timezone?: string;

  @IsString()
  @IsOptional()
  domain?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => BrandingDto)
  branding?: BrandingDto;
}
