import {
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { Request } from 'express';
import { SearchService } from './search.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ModuleGuard, RequireModule } from '../auth/guards/module.guard';
import { RoleGuard, RequireRoles } from '../auth/guards/role.guard';

@Controller('search')
@UseGuards(AuthGuard, ModuleGuard, RoleGuard)
@RequireModule('ecommerce')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @RequireRoles('owner', 'admin', 'editor', 'viewer')
  search(
    @Req() req: Request,
    @Query('q') q: string,
    @Query('categoryId') categoryId?: string,
    @Query('minPrice', new DefaultValuePipe(undefined))
    minPrice?: string,
    @Query('maxPrice', new DefaultValuePipe(undefined))
    maxPrice?: string,
    @Query('status') status?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
  ) {
    return this.searchService.search(req.tenant!.slug, {
      q: q || '',
      categoryId,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      status,
      page,
      limit,
    });
  }

  @Post('reindex')
  @RequireRoles('owner', 'admin')
  reindex(@Req() req: Request) {
    return this.searchService.reindex(req.tenant!.slug);
  }
}
