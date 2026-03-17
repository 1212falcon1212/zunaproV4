import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { BlockDto } from './save-page-content.dto';

export class SaveGlobalSectionDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BlockDto)
  blocks!: BlockDto[];
}
