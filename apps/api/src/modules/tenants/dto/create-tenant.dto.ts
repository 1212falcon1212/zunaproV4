import { IsString, IsOptional, IsEnum, MinLength, MaxLength, Matches } from 'class-validator';

export class CreateTenantDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^[a-z0-9-]+$/, { message: 'Slug must contain only lowercase letters, numbers, and hyphens' })
  slug!: string;

  @IsString()
  planId!: string;

  @IsString()
  @IsEnum(['mobilya', 'teknoloji', 'giyim', 'kozmetik', 'gida', 'ev-yasam'])
  sector!: string;

  @IsString()
  @IsOptional()
  domain?: string;
}
