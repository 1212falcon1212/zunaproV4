import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ReorderCategoriesDto } from './dto/reorder-categories.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ModuleGuard, RequireModule } from '../auth/guards/module.guard';
import { RoleGuard, RequireRoles } from '../auth/guards/role.guard';

@Controller('categories')
@UseGuards(AuthGuard, ModuleGuard, RoleGuard)
@RequireModule('ecommerce')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @RequireRoles('owner', 'admin', 'editor', 'viewer')
  findAll(@Req() req: Request) {
    return this.categoriesService.findAll(req.tenant!.slug);
  }

  @Get(':id')
  @RequireRoles('owner', 'admin', 'editor', 'viewer')
  findOne(@Req() req: Request, @Param('id') id: string) {
    return this.categoriesService.findOne(req.tenant!.slug, id);
  }

  @Post()
  @RequireRoles('owner', 'admin', 'editor')
  create(@Req() req: Request, @Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(req.tenant!.slug, dto);
  }

  @Patch('reorder')
  @RequireRoles('owner', 'admin', 'editor')
  reorder(@Req() req: Request, @Body() dto: ReorderCategoriesDto) {
    return this.categoriesService.reorder(req.tenant!.slug, dto);
  }

  @Patch(':id')
  @RequireRoles('owner', 'admin', 'editor')
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(req.tenant!.slug, id, dto);
  }

  @Delete(':id')
  @RequireRoles('owner', 'admin')
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.categoriesService.remove(req.tenant!.slug, id);
  }
}
