import { IsString, IsObject, IsOptional, IsArray, IsBoolean } from 'class-validator';

export class CreateMenuDto {
  @IsObject()
  name!: Record<string, string>;

  @IsString()
  slug!: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsArray()
  @IsOptional()
  items?: unknown[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
