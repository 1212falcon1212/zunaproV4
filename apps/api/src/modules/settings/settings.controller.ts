import {
  Controller,
  Get,
  Put,
  Post,
  Param,
  Body,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { SettingsService } from './settings.service';
import { UpdateThemeDto } from './dto/update-theme.dto';
import { ApplyThemeDto } from './dto/apply-theme.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { masterPrisma } from '@zunapro/db';

@Controller('settings')
@UseGuards(AuthGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  /** Get tenant site config (locales, currencies, domain, name) */
  @Get('site-config')
  async getSiteConfig(@Req() req: Request) {
    const tenant = await masterPrisma.tenant.findUnique({
      where: { id: req.tenant!.id },
      select: { name: true, domain: true, config: true, slug: true },
    });
    if (!tenant) return {};
    const config = (tenant.config ?? {}) as Record<string, unknown>;
    return {
      name: tenant.name,
      slug: tenant.slug,
      domain: tenant.domain,
      locales: config.locales ?? ['tr', 'en'],
      defaultLocale: config.defaultLocale ?? 'tr',
      currencies: config.currencies ?? ['TRY'],
      defaultCurrency: config.defaultCurrency ?? 'TRY',
      timezone: config.timezone ?? 'Europe/Istanbul',
    };
  }

  /** Update tenant site config */
  @Put('site-config')
  async updateSiteConfig(@Req() req: Request, @Body() body: Record<string, unknown>) {
    const tenant = await masterPrisma.tenant.findUnique({
      where: { id: req.tenant!.id },
    });
    if (!tenant) return { error: 'Tenant not found' };

    const existingConfig = (tenant.config ?? {}) as Record<string, unknown>;
    const updatedConfig = { ...existingConfig };

    if (body.locales) updatedConfig.locales = body.locales;
    if (body.defaultLocale) updatedConfig.defaultLocale = body.defaultLocale;
    if (body.currencies) updatedConfig.currencies = body.currencies;
    if (body.defaultCurrency) updatedConfig.defaultCurrency = body.defaultCurrency;
    if (body.timezone) updatedConfig.timezone = body.timezone;

    const updated = await masterPrisma.tenant.update({
      where: { id: req.tenant!.id },
      data: {
        name: typeof body.name === 'string' ? body.name : undefined,
        domain: typeof body.domain === 'string' ? body.domain : undefined,
        config: updatedConfig as Record<string, unknown> as never,
      },
    });

    return { success: true, name: updated.name, domain: updated.domain };
  }

  @Get()
  findAll(@Req() req: Request, @Query('group') group?: string) {
    return this.settingsService.getSettingsByGroup(req.tenant!.slug, group);
  }

  @Get(':key')
  findByKey(@Req() req: Request, @Param('key') key: string) {
    return this.settingsService.getSetting(req.tenant!.slug, key);
  }

  @Put(':key')
  update(
    @Req() req: Request,
    @Param('key') key: string,
    @Body() body: { value: unknown; group?: string },
  ) {
    return this.settingsService.upsertSetting(
      req.tenant!.slug,
      key,
      body.value,
      body.group,
    );
  }

  @Put('theme/config')
  updateTheme(@Req() req: Request, @Body() dto: UpdateThemeDto) {
    return this.settingsService.updateThemeConfig(req.tenant!.slug, dto as Record<string, unknown>);
  }

  @Post('theme/apply')
  applyTheme(@Req() req: Request, @Body() dto: ApplyThemeDto) {
    return this.settingsService.applyTheme(
      req.tenant!.slug,
      dto.themeId,
      dto.applyLayout ?? true,
      dto.reseed ?? false,
    );
  }

  @Post('reseed')
  reseed(@Req() req: Request, @Body() body: { sector?: string }) {
    return this.settingsService.reseedTenant(
      req.tenant!.slug,
      body.sector ?? 'genel',
    );
  }
}
