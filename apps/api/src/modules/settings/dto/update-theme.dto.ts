import { IsString, IsOptional, IsIn, IsObject, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class FontsDto {
  @IsString()
  heading!: string;

  @IsString()
  body!: string;
}

class LayoutDto {
  @IsOptional()
  @IsIn(['standard', 'centered', 'minimal'])
  headerStyle?: string;

  @IsOptional()
  @IsIn([2, 3, 4])
  productGridColumns?: number;

  @IsOptional()
  @IsNumber()
  footerColumns?: number;
}

export class UpdateThemeDto {
  @IsOptional()
  @IsString()
  primary?: string;

  @IsOptional()
  @IsString()
  secondary?: string;

  @IsOptional()
  @IsString()
  accent?: string;

  @IsOptional()
  @IsString()
  background?: string;

  @IsOptional()
  @IsString()
  foreground?: string;

  @IsOptional()
  @IsString()
  muted?: string;

  @IsOptional()
  @IsString()
  border?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => FontsDto)
  fonts?: FontsDto;

  @IsOptional()
  @IsIn(['none', 'sm', 'md', 'lg', 'xl'])
  borderRadius?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => LayoutDto)
  layout?: LayoutDto;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsOptional()
  @IsString()
  faviconUrl?: string;

  @IsOptional()
  @IsString()
  customCss?: string;
}
