import {
  Controller,
  Get,
  Param,
  Query,
  Req,
  ParseIntPipe,
  DefaultValuePipe,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { StorefrontService } from './storefront.service';
import { getAllThemes, getThemeBundleById } from '@zunapro/themes';

@Controller('storefront')
export class StorefrontController {
  constructor(private readonly storefrontService: StorefrontService) {}

  @Get('settings/theme')
  getThemeConfig(@Req() req: Request) {
    return this.storefrontService.getThemeConfig(req.tenant!.slug);
  }

  @Get('settings/theme/preview')
  getThemePreview(@Query('themeId') themeId: string) {
    const bundle = getThemeBundleById(themeId);
    if (!bundle) {
      throw new NotFoundException(`Theme "${themeId}" not found`);
    }
    return bundle.manifest.config;
  }

  @Get('theme-preview/:themeId')
  getThemeBundle(@Param('themeId') themeId: string) {
    const bundle = getThemeBundleById(themeId);
    if (!bundle) {
      throw new NotFoundException(`Theme "${themeId}" not found`);
    }
    return {
      config: bundle.manifest.config,
      homePage: bundle.homePage,
      header: bundle.header,
      footer: bundle.footer,
    };
  }

  @Get('themes')
  getThemes() {
    return getAllThemes();
  }

  @Get('active-theme')
  getActiveTheme(@Req() req: Request) {
    return this.storefrontService.getActiveThemeId(req.tenant!.slug);
  }

  @Get('products')
  findProducts(
    @Req() req: Request,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('category') categorySlug?: string,
    @Query('minPrice', new DefaultValuePipe(undefined)) minPrice?: string,
    @Query('maxPrice', new DefaultValuePipe(undefined)) maxPrice?: string,
    @Query('search') search?: string,
    @Query('sort') sort?: string,
  ) {
    return this.storefrontService.findProducts(req.tenant!.slug, {
      page,
      limit,
      categorySlug,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      search,
      sort,
    });
  }

  @Get('products/:slug')
  findProductBySlug(@Req() req: Request, @Param('slug') slug: string) {
    return this.storefrontService.findProductBySlug(req.tenant!.slug, slug);
  }

  @Get('categories')
  findCategories(@Req() req: Request) {
    return this.storefrontService.findCategories(req.tenant!.slug);
  }

  @Get('categories/:slug')
  findCategoryBySlug(
    @Req() req: Request,
    @Param('slug') slug: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.storefrontService.findCategoryBySlug(
      req.tenant!.slug,
      slug,
      page,
      limit,
    );
  }
}
