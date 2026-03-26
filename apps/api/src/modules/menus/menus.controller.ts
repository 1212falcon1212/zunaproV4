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
import { MenusService } from './menus.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ModuleGuard, RequireModule } from '../auth/guards/module.guard';
import { RoleGuard, RequireRoles } from '../auth/guards/role.guard';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Controller('menus')
@UseGuards(AuthGuard, ModuleGuard, RoleGuard)
@RequireModule('ecommerce')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Get()
  @RequireRoles('owner', 'admin', 'editor', 'viewer')
  findAll(@Req() req: Request) {
    return this.menusService.findAll(req.tenant!.slug);
  }

  @Get(':id')
  @RequireRoles('owner', 'admin', 'editor', 'viewer')
  findById(@Req() req: Request, @Param('id') id: string) {
    return this.menusService.findById(req.tenant!.slug, id);
  }

  @Post()
  @RequireRoles('owner', 'admin', 'editor')
  create(@Req() req: Request, @Body() dto: CreateMenuDto) {
    return this.menusService.create(req.tenant!.slug, dto);
  }

  @Put(':id')
  @RequireRoles('owner', 'admin', 'editor')
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateMenuDto,
  ) {
    return this.menusService.update(req.tenant!.slug, id, dto);
  }

  @Delete(':id')
  @RequireRoles('owner', 'admin')
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.menusService.remove(req.tenant!.slug, id);
  }
}
