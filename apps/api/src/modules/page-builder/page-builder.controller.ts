import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { PageBuilderService } from './page-builder.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ModuleGuard, RequireModule } from '../auth/guards/module.guard';
import { RoleGuard, RequireRoles } from '../auth/guards/role.guard';
import {
  SavePageContentDto,
  CreatePageDto,
  UpdatePageMetaDto,
} from './dto/save-page-content.dto';
import { SaveGlobalSectionDto } from './dto/save-global-section.dto';

@Controller('pages')
@UseGuards(AuthGuard, ModuleGuard, RoleGuard)
@RequireModule('ecommerce')
export class PageBuilderController {
  constructor(private readonly pageBuilderService: PageBuilderService) {}

  @Get()
  @RequireRoles('owner', 'admin', 'editor', 'viewer')
  findAll(@Req() req: Request) {
    return this.pageBuilderService.findAllPages(req.tenant!.slug);
  }

  @Get(':id')
  @RequireRoles('owner', 'admin', 'editor', 'viewer')
  findOne(@Req() req: Request, @Param('id') id: string) {
    return this.pageBuilderService.findPageById(req.tenant!.slug, id);
  }

  @Post()
  @RequireRoles('owner', 'admin', 'editor')
  create(@Req() req: Request, @Body() dto: CreatePageDto) {
    return this.pageBuilderService.createPage(req.tenant!.slug, dto);
  }

  @Put(':id/content')
  @RequireRoles('owner', 'admin', 'editor')
  saveContent(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: SavePageContentDto,
  ) {
    return this.pageBuilderService.savePageContent(
      req.tenant!.slug,
      id,
      dto.blocks,
    );
  }

  @Put(':id')
  @RequireRoles('owner', 'admin', 'editor')
  updateMeta(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdatePageMetaDto,
  ) {
    return this.pageBuilderService.updatePageMeta(req.tenant!.slug, id, dto);
  }

  @Delete(':id')
  @RequireRoles('owner', 'admin')
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.pageBuilderService.deletePage(req.tenant!.slug, id);
  }

  @Post(':id/duplicate')
  @RequireRoles('owner', 'admin', 'editor')
  duplicate(@Req() req: Request, @Param('id') id: string) {
    return this.pageBuilderService.duplicatePage(req.tenant!.slug, id);
  }
}

@Controller('global-sections')
@UseGuards(AuthGuard, ModuleGuard, RoleGuard)
@RequireModule('ecommerce')
export class GlobalSectionController {
  constructor(private readonly pageBuilderService: PageBuilderService) {}

  @Get(':type')
  @RequireRoles('owner', 'admin', 'editor', 'viewer')
  getSection(@Req() req: Request, @Param('type') type: string) {
    return this.pageBuilderService.getGlobalSection(req.tenant!.slug, type);
  }

  @Put(':type')
  @RequireRoles('owner', 'admin', 'editor')
  saveSection(
    @Req() req: Request,
    @Param('type') type: string,
    @Body() dto: SaveGlobalSectionDto,
  ) {
    return this.pageBuilderService.saveGlobalSection(
      req.tenant!.slug,
      type,
      dto.blocks,
    );
  }
}

@Controller('storefront')
export class StorefrontPageController {
  constructor(private readonly pageBuilderService: PageBuilderService) {}

  @Get('pages/:slug')
  getPublishedPage(@Req() req: Request, @Param('slug') slug: string) {
    return this.pageBuilderService.getPublishedPage(req.tenant!.slug, slug);
  }

  @Get('global-sections/:type')
  getGlobalSection(@Req() req: Request, @Param('type') type: string) {
    return this.pageBuilderService.getGlobalSection(req.tenant!.slug, type);
  }
}
