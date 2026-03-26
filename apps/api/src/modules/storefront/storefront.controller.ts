import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Req,
  ParseIntPipe,
  DefaultValuePipe,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';
import { StorefrontService } from './storefront.service';
import { getAllThemes, getThemeBundleById } from '@zunapro/themes';
import { SettingsService } from '../settings/settings.service';

@Controller('storefront')
export class StorefrontController {
  constructor(
    private readonly storefrontService: StorefrontService,
    private readonly settingsService: SettingsService,
  ) {}

  @Get('settings/theme')
  getThemeConfig(@Req() req: Request) {
    return this.storefrontService.getThemeConfig(req.tenant!.slug);
  }

  @Get('settings/store-info')
  getStoreInfo(@Req() req: Request) {
    return this.storefrontService.getStoreInfo(req.tenant!.slug);
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

  @Get('blog/recent')
  findRecentBlogPosts(
    @Req() req: Request,
    @Query('limit', new DefaultValuePipe(4), ParseIntPipe) limit: number,
  ) {
    return this.storefrontService.findRecentBlogPosts(req.tenant!.slug, limit);
  }

  @Get('blog')
  findBlogPosts(
    @Req() req: Request,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(12), ParseIntPipe) limit: number,
  ) {
    return this.storefrontService.findBlogPosts(req.tenant!.slug, { page, limit });
  }

  @Get('blog/:slug')
  findBlogPostBySlug(@Req() req: Request, @Param('slug') slug: string) {
    return this.storefrontService.findBlogPostBySlug(req.tenant!.slug, slug);
  }

  @Get('products/featured')
  findFeaturedProducts(
    @Req() req: Request,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.storefrontService.findFeaturedProducts(req.tenant!.slug, limit);
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

  @Get('categories/featured')
  findFeaturedCategories(@Req() req: Request) {
    return this.storefrontService.findFeaturedCategories(req.tenant!.slug);
  }

  @Get('categories/:slug')
  findCategoryBySlug(
    @Req() req: Request,
    @Param('slug') slug: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('sort') sort?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
  ) {
    return this.storefrontService.findCategoryBySlug(
      req.tenant!.slug,
      slug,
      page,
      limit,
      sort,
      minPrice ? parseFloat(minPrice) : undefined,
      maxPrice ? parseFloat(maxPrice) : undefined,
    );
  }

  @Get('menus/:location')
  findMenuByLocation(
    @Req() req: Request,
    @Param('location') location: string,
  ) {
    return this.storefrontService.findMenuByLocation(req.tenant!.slug, location);
  }

  @Post('dev/apply-theme')
  async devApplyTheme(
    @Req() req: Request,
    @Body() body: { themeId: string; reseed?: boolean },
  ) {
    if (process.env.NODE_ENV === 'production') {
      throw new BadRequestException('Not available in production');
    }
    const slug = req.tenant?.slug;
    if (!slug) {
      throw new BadRequestException('Tenant slug required (x-tenant-slug header)');
    }
    return this.settingsService.applyTheme(slug, body.themeId, true, body.reseed ?? true);
  }
}
