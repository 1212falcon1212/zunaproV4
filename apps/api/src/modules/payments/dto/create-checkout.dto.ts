import { IsString, IsOptional, IsEmail } from 'class-validator';

export class CreateCheckoutDto {
  @IsString()
  planId!: string;

  @IsString()
  tenantSlug!: string;

  @IsString()
  @IsOptional()
  tenantId?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  successUrl?: string;

  @IsString()
  @IsOptional()
  cancelUrl?: string;
}
