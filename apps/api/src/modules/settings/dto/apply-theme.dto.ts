import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class ApplyThemeDto {
  @IsString()
  themeId!: string;

  @IsBoolean()
  @IsOptional()
  applyLayout?: boolean;

  @IsBoolean()
  @IsOptional()
  reseed?: boolean;
}
