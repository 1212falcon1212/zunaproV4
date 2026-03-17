import {
  IsString,
  IsOptional,
  IsObject,
  IsIn,
} from 'class-validator';

export class AddressDto {
  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsString()
  address1!: string;

  @IsOptional()
  @IsString()
  address2?: string;

  @IsString()
  city!: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsString()
  postalCode!: string;

  @IsString()
  country!: string;

  @IsOptional()
  @IsString()
  phone?: string;
}

export class CreateOrderDto {
  @IsObject()
  shippingAddress!: AddressDto;

  @IsOptional()
  @IsObject()
  billingAddress?: AddressDto;

  @IsOptional()
  @IsIn(['stripe', 'iyzico', 'bank_transfer'])
  paymentMethod?: string;

  @IsOptional()
  @IsIn(['yurtici', 'aras', 'mng'])
  shippingMethod?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  locale?: string;
}
