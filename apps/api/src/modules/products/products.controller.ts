import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Req,
  Res,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ModuleGuard, RequireModule } from '../auth/guards/module.guard';
import { RoleGuard, RequireRoles } from '../auth/guards/role.guard';

@Controller('products')
@UseGuards(AuthGuard, ModuleGuard, RoleGuard)
@RequireModule('ecommerce')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @RequireRoles('owner', 'admin', 'editor', 'viewer')
  findAll(
    @Req() req: Request,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('status') status?: string,
    @Query('categoryId') categoryId?: string,
    @Query('search') search?: string,
  ) {
    return this.productsService.findAll(req.tenant!.slug, {
      page,
      limit,
      status,
      categoryId,
      search,
    });
  }

  @Get('export')
  @RequireRoles('owner', 'admin')
  async exportAll(@Req() req: Request, @Res() res: Response) {
    const data = await this.productsService.exportAll(req.tenant!.slug);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=products-export.json',
    );
    res.json(data);
  }

  @Get(':id')
  @RequireRoles('owner', 'admin', 'editor', 'viewer')
  findOne(@Req() req: Request, @Param('id') id: string) {
    return this.productsService.findOne(req.tenant!.slug, id);
  }

  @Post()
  @RequireRoles('owner', 'admin', 'editor')
  create(@Req() req: Request, @Body() dto: CreateProductDto) {
    return this.productsService.create(
      req.tenant!.slug,
      req.tenant!.planId,
      dto,
    );
  }

  @Post('bulk-import')
  @RequireRoles('owner', 'admin')
  bulkImport(@Req() req: Request, @Body() products: CreateProductDto[]) {
    return this.productsService.bulkImport(
      req.tenant!.slug,
      req.tenant!.planId,
      products,
    );
  }

  @Patch(':id')
  @RequireRoles('owner', 'admin', 'editor')
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.update(req.tenant!.slug, id, dto);
  }

  @Delete(':id')
  @RequireRoles('owner', 'admin')
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.productsService.remove(req.tenant!.slug, id);
  }

  @Post(':id/attributes')
  @RequireRoles('owner', 'admin', 'editor')
  addAttribute(
    @Req() req: Request,
    @Param('id') productId: string,
    @Body() body: { name: string; value: string },
  ) {
    return this.productsService.addAttribute(req.tenant!.slug, productId, body);
  }

  @Delete(':id/attributes/:name')
  @RequireRoles('owner', 'admin', 'editor')
  removeAttribute(
    @Req() req: Request,
    @Param('id') productId: string,
    @Param('name') name: string,
  ) {
    return this.productsService.removeAttribute(
      req.tenant!.slug,
      productId,
      name,
    );
  }
}
