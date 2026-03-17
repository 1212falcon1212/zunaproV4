import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { getTenantClient } from '@zunapro/db';
import { RedisService } from '../../common/redis';
import type { ThemeConfig } from '@zunapro/types';
import { getThemeBundleById } from '@zunapro/themes';
import { TenantSeederService } from '../provisioning/tenant-seeder.service';

const THEME_CACHE_TTL = 300; // 5 minutes

@Injectable()
export class SettingsService {
  private readonly logger = new Logger(SettingsService.name);

  constructor(
    private readonly redis: RedisService,
    private readonly tenantSeeder: TenantSeederService,
  ) {}

  async getSettingsByGroup(tenantSlug: string, group?: string) {
    const prisma = getTenantClient(tenantSlug);
    const where = group ? { group } : {};
    return prisma.setting.findMany({ where });
  }

  async getSetting(tenantSlug: string, key: string) {
    const prisma = getTenantClient(tenantSlug);
    return prisma.setting.findUnique({ where: { key } });
  }

  async upsertSetting(tenantSlug: string, key: string, value: unknown, group = 'general') {
    const prisma = getTenantClient(tenantSlug);
    const result = await prisma.setting.upsert({
      where: { key },
      update: { value: value as object },
      create: { key, value: value as object, group },
    });

    // Invalidate cache if theme-related
    if (key === 'theme') {
      await this.redis.del(`theme:${tenantSlug}`);
    }

    return result;
  }

  async getThemeConfig(tenantSlug: string): Promise<ThemeConfig | null> {
    // Check cache first
    const cacheKey = `theme:${tenantSlug}`;
    const cached = await this.redis.getJson<ThemeConfig>(cacheKey);
    if (cached) return cached;

    const prisma = getTenantClient(tenantSlug);
    const setting = await prisma.setting.findUnique({ where: { key: 'theme' } });

    if (!setting) return null;

    const config = setting.value as unknown as ThemeConfig;
    await this.redis.setJson(cacheKey, config, THEME_CACHE_TTL);
    return config;
  }

  async updateThemeConfig(tenantSlug: string, themeData: Partial<ThemeConfig>): Promise<ThemeConfig> {
    const existing = await this.getThemeConfig(tenantSlug);
    const merged: ThemeConfig = {
      primary: themeData.primary ?? existing?.primary ?? '#2563eb',
      secondary: themeData.secondary ?? existing?.secondary ?? '#64748b',
      accent: themeData.accent ?? existing?.accent ?? '#f59e0b',
      background: themeData.background ?? existing?.background ?? '#ffffff',
      foreground: themeData.foreground ?? existing?.foreground,
      muted: themeData.muted ?? existing?.muted,
      border: themeData.border ?? existing?.border,
      fonts: themeData.fonts ?? existing?.fonts,
      borderRadius: themeData.borderRadius ?? existing?.borderRadius,
      layout: themeData.layout ?? existing?.layout,
      logoUrl: themeData.logoUrl ?? existing?.logoUrl,
      faviconUrl: themeData.faviconUrl ?? existing?.faviconUrl,
      customCss: themeData.customCss ?? existing?.customCss,
    };

    await this.upsertSetting(tenantSlug, 'theme', merged, 'appearance');
    return merged;
  }

  async reseedTenant(tenantSlug: string, sector: string) {
    const themeConfig = await this.getThemeConfig(tenantSlug);
    const branding = {
      primaryColor: themeConfig?.primary ?? '#2563eb',
      secondaryColor: themeConfig?.secondary ?? '#64748b',
      accentColor: themeConfig?.accent ?? '#f59e0b',
    };

    await this.tenantSeeder.reseedTenant(tenantSlug, sector, branding);
    this.logger.log(`Reseed complete for tenant "${tenantSlug}" (sector: ${sector})`);
    return { success: true, sector };
  }

  async applyTheme(tenantSlug: string, themeId: string, applyLayout: boolean, reseed = false) {
    const bundle = getThemeBundleById(themeId);
    if (!bundle) {
      throw new BadRequestException(`Theme "${themeId}" not found`);
    }

    const prisma = getTenantClient(tenantSlug);

    try {
      // Save theme config
      await this.upsertSetting(tenantSlug, 'theme', bundle.manifest.config, 'appearance');
      await this.upsertSetting(tenantSlug, 'active_theme_id', { value: themeId }, 'appearance');

      if (applyLayout) {
        // Overwrite homepage
        await prisma.page.upsert({
          where: { slug: 'home' },
          update: { content: bundle.homePage as object },
          create: {
            slug: 'home',
            title: { en: 'Home', tr: 'Ana Sayfa', de: 'Startseite', fr: 'Accueil', es: 'Inicio' } as object,
            content: bundle.homePage as object,
            isPublished: true,
          },
        });

        // Overwrite header
        await prisma.globalSection.upsert({
          where: { type: 'header' },
          update: { content: bundle.header as object },
          create: {
            type: 'header',
            content: bundle.header as object,
          },
        });

        // Overwrite footer
        await prisma.globalSection.upsert({
          where: { type: 'footer' },
          update: { content: bundle.footer as object },
          create: {
            type: 'footer',
            content: bundle.footer as object,
          },
        });

        this.logger.log(`Theme "${themeId}" applied with layout for tenant "${tenantSlug}"`);
      } else {
        this.logger.log(`Theme "${themeId}" colors/fonts applied for tenant "${tenantSlug}"`);
      }

      // Reseed demo data if requested
      if (reseed) {
        const sector = bundle.manifest.sector ?? 'genel';
        const branding = {
          primaryColor: bundle.manifest.config.primary,
          secondaryColor: bundle.manifest.config.secondary,
          accentColor: bundle.manifest.config.accent,
        };
        await this.tenantSeeder.reseedTenant(tenantSlug, sector, branding);
        this.logger.log(`Reseeded demo data for tenant "${tenantSlug}" (sector: ${sector})`);
      }

      // Clear all related caches (both settings and page-builder cache keys)
      await this.redis.del(`theme:${tenantSlug}`);
      await this.redis.del(`storefront:header:${tenantSlug}`);
      await this.redis.del(`storefront:footer:${tenantSlug}`);
      // Page-builder uses different cache keys
      await this.redis.del(`global-section:${tenantSlug}:header`);
      await this.redis.del(`global-section:${tenantSlug}:footer`);
      await this.redis.del(`page:${tenantSlug}:home`);

      return { success: true, themeId, layoutApplied: applyLayout, reseeded: reseed };
    } catch (error) {
      this.logger.error(`Failed to apply theme "${themeId}" for tenant "${tenantSlug}"`, error);
      throw new BadRequestException(`Failed to apply theme: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
