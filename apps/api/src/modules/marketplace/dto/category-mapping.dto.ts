import { IsString, IsNotEmpty } from 'class-validator';

export class CategoryMappingDto {
  @IsString() @IsNotEmpty() localCategoryId!: string;
  @IsString() @IsNotEmpty() marketplaceCategoryId!: string;
}
