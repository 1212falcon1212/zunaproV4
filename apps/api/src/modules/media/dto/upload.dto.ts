import { IsObject, IsOptional } from 'class-validator';

export class UploadDto {
  @IsOptional()
  @IsObject()
  alt?: Record<string, string>;
}
