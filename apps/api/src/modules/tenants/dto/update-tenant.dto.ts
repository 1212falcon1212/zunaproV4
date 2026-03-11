import { IsString, IsOptional, IsObject } from 'class-validator';

export class UpdateTenantDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  domain?: string;

  @IsObject()
  @IsOptional()
  config?: Record<string, unknown>;
}
