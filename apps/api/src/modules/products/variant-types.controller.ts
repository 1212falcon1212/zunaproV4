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
import { VariantTypesService } from './variant-types.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ModuleGuard, RequireModule } from '../auth/guards/module.guard';
import { RoleGuard, RequireRoles } from '../auth/guards/role.guard';

@Controller('variant-types')
@UseGuards(AuthGuard, ModuleGuard, RoleGuard)
@RequireModule('ecommerce')
export class VariantTypesController {
  constructor(private readonly variantTypesService: VariantTypesService) {}

  @Get()
  @RequireRoles('owner', 'admin', 'editor', 'viewer')
  getAll(@Req() req: Request) {
    return this.variantTypesService.getAll(req.tenant!.slug);
  }

  @Get(':id')
  @RequireRoles('owner', 'admin', 'editor', 'viewer')
  getById(@Req() req: Request, @Param('id') id: string) {
    return this.variantTypesService.getById(req.tenant!.slug, id);
  }

  @Post()
  @RequireRoles('owner', 'admin', 'editor')
  create(
    @Req() req: Request,
    @Body() body: { name: Record<string, string>; slug: string },
  ) {
    return this.variantTypesService.create(req.tenant!.slug, body);
  }

  @Patch(':id')
  @RequireRoles('owner', 'admin', 'editor')
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body()
    body: {
      name?: Record<string, string>;
      slug?: string;
      sortOrder?: number;
    },
  ) {
    return this.variantTypesService.update(req.tenant!.slug, id, body);
  }

  @Delete(':id')
  @RequireRoles('owner', 'admin')
  deleteType(@Req() req: Request, @Param('id') id: string) {
    return this.variantTypesService.deleteType(req.tenant!.slug, id);
  }

  @Post(':id/options')
  @RequireRoles('owner', 'admin', 'editor')
  createOption(
    @Req() req: Request,
    @Param('id') typeId: string,
    @Body()
    body: { name: Record<string, string>; slug: string; colorCode?: string },
  ) {
    return this.variantTypesService.createOption(req.tenant!.slug, typeId, body);
  }

  @Patch('options/:optionId')
  @RequireRoles('owner', 'admin', 'editor')
  updateOption(
    @Req() req: Request,
    @Param('optionId') optionId: string,
    @Body()
    body: {
      name?: Record<string, string>;
      slug?: string;
      colorCode?: string | null;
      sortOrder?: number;
    },
  ) {
    return this.variantTypesService.updateOption(
      req.tenant!.slug,
      optionId,
      body,
    );
  }

  @Delete('options/:optionId')
  @RequireRoles('owner', 'admin')
  deleteOption(@Req() req: Request, @Param('optionId') optionId: string) {
    return this.variantTypesService.deleteOption(req.tenant!.slug, optionId);
  }
}
