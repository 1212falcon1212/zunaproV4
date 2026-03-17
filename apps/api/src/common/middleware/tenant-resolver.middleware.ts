import {
  Injectable,
  NestMiddleware,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RedisService } from '../redis/redis.service';
import { masterPrisma } from '@zunapro/db';

export interface TenantLocaleConfig {
  locales: string[];
  defaultLocale: string;
  currencies: string[];
  defaultCurrency: string;
}

export interface TenantContext {
  id: string;
  slug: string;
  dbUrl: string;
  config: Record<string, unknown>;
  planId: string;
  status: string;
  localeConfig: TenantLocaleConfig;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      tenant?: TenantContext;
      locale?: string;
      customer?: import('@zunapro/types').StorefrontJwtPayload;
    }
  }
}

const TENANT_CACHE_TTL = 300; // 5 minutes

const DEFAULT_LOCALE_CONFIG: TenantLocaleConfig = {
  locales: ['tr', 'en'],
  defaultLocale: 'tr',
  currencies: ['TRY'],
  defaultCurrency: 'TRY',
};

@Injectable()
export class TenantResolverMiddleware implements NestMiddleware {
  private readonly logger = new Logger(TenantResolverMiddleware.name);

  constructor(private readonly redis: RedisService) {}

  async use(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const host = req.headers.host || '';

    // Try subdomain first, then custom domain, then x-tenant-slug header
    let slug = this.extractSubdomain(host);

    if (!slug) {
      slug = await this.resolveCustomDomain(host);
    }

    if (!slug) {
      // Fallback: check x-tenant-slug header (used by panel on localhost)
      const headerSlug = req.headers['x-tenant-slug'] as string | undefined;
      if (headerSlug) {
        slug = headerSlug;
      }
    }

    if (!slug) {
      // Last resort: extract tenantId from JWT and resolve slug
      slug = await this.resolveFromJwt(req);
    }

    if (!slug) {
      // No tenant context needed (e.g., main platform endpoints)
      next();
      return;
    }

    const tenant = await this.resolveTenant(slug);

    if (!tenant) {
      throw new HttpException('Store not found', HttpStatus.NOT_FOUND);
    }

    if (tenant.status === 'suspended') {
      throw new HttpException(
        'This store has been suspended',
        HttpStatus.FORBIDDEN,
      );
    }

    if (tenant.status === 'payment_overdue') {
      throw new HttpException(
        'This store has a payment issue',
        HttpStatus.PAYMENT_REQUIRED,
      );
    }

    if (
      tenant.status === 'provisioning' ||
      tenant.status === 'provisioning_failed'
    ) {
      throw new HttpException(
        'This store is being set up',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    // Resolve request locale from Accept-Language header
    req.locale = this.resolveLocale(req, tenant.localeConfig);
    req.tenant = tenant;
    next();
  }

  private resolveLocale(
    req: Request,
    localeConfig: TenantLocaleConfig,
  ): string {
    // 1. Check explicit query param: ?locale=en
    const queryLocale = req.query.locale as string | undefined;
    if (queryLocale && localeConfig.locales.includes(queryLocale)) {
      return queryLocale;
    }

    // 2. Check Accept-Language header
    const acceptLang = req.headers['accept-language'];
    if (acceptLang) {
      const preferred = acceptLang.split(',')[0]?.split('-')[0]?.trim();
      if (preferred && localeConfig.locales.includes(preferred)) {
        return preferred;
      }
    }

    // 3. Fall back to tenant default
    return localeConfig.defaultLocale;
  }

  private extractSubdomain(host: string): string | null {
    // Remove port if present
    const hostname = host.split(':')[0];

    // Check if it's a zunapro subdomain
    const zunaproDomain = 'zunapro.com';
    if (hostname.endsWith(`.${zunaproDomain}`)) {
      const subdomain = hostname.replace(`.${zunaproDomain}`, '');
      // Ignore platform-level subdomains
      if (['www', 'admin', 'api', 'mail'].includes(subdomain)) {
        return null;
      }
      return subdomain;
    }

    // localhost development: no subdomain extraction
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return null;
    }

    return null;
  }

  private async resolveFromJwt(req: Request): Promise<string | null> {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) return null;

    try {
      const token = auth.slice(7);
      const payloadB64 = token.split('.')[1];
      if (!payloadB64) return null;

      const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString());
      const tenantId = payload.tenantId as string | undefined;
      if (!tenantId) return null;

      // Skip platform tenant
      if (tenantId === '00000000-0000-0000-0000-000000000000') return null;

      // Check cache first
      const cacheKey = `tenant-id:${tenantId}`;
      const cached = await this.redis.get(cacheKey);
      if (cached) return cached;

      // Query master DB
      const tenant = await masterPrisma.tenant.findUnique({
        where: { id: tenantId },
        select: { slug: true },
      });

      if (tenant) {
        await this.redis.set(cacheKey, tenant.slug, TENANT_CACHE_TTL);
        return tenant.slug;
      }
    } catch {
      // JWT parse failure is not critical — fall through
    }

    return null;
  }

  private async resolveCustomDomain(host: string): Promise<string | null> {
    const hostname = host.split(':')[0];

    // Skip known platform domains and local dev
    if (
      hostname.endsWith('zunapro.com') ||
      hostname === 'localhost' ||
      hostname === '127.0.0.1'
    ) {
      return null;
    }

    // Check Redis cache for custom domain → slug mapping
    const cacheKey = `domain:${hostname}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      this.logger.debug(`Custom domain cache hit: ${hostname}`);
      return cached;
    }

    // Query custom_domains table
    try {
      const customDomain = await masterPrisma.customDomain.findUnique({
        where: { domain: hostname },
        include: { tenant: { select: { slug: true } } },
      });

      if (customDomain?.tenant) {
        await this.redis.set(
          cacheKey,
          customDomain.tenant.slug,
          TENANT_CACHE_TTL,
        );
        this.logger.debug(
          `Custom domain cache miss, cached: ${hostname} → ${customDomain.tenant.slug}`,
        );
        return customDomain.tenant.slug;
      }
    } catch (error) {
      this.logger.error(`Error resolving custom domain ${hostname}`, error);
    }

    return null;
  }

  private async resolveTenant(slug: string): Promise<TenantContext | null> {
    // Check Redis cache
    const cacheKey = `tenant:${slug}`;
    const cached = await this.redis.getJson<TenantContext>(cacheKey);
    if (cached) {
      this.logger.debug(`Tenant cache hit: ${slug}`);
      return cached;
    }

    // Query master DB
    try {
      const tenant = await masterPrisma.tenant.findUnique({
        where: { slug },
      });

      if (!tenant) {
        return null;
      }

      const config = tenant.config as Record<string, unknown>;
      const dbUrlTemplate =
        process.env.DATABASE_TENANT_URL_TEMPLATE || '';

      // Extract locale config from tenant config
      const localeConfig: TenantLocaleConfig = {
        locales: Array.isArray(config.locales)
          ? (config.locales as string[])
          : DEFAULT_LOCALE_CONFIG.locales,
        defaultLocale:
          typeof config.defaultLocale === 'string'
            ? config.defaultLocale
            : DEFAULT_LOCALE_CONFIG.defaultLocale,
        currencies: Array.isArray(config.currencies)
          ? (config.currencies as string[])
          : DEFAULT_LOCALE_CONFIG.currencies,
        defaultCurrency:
          typeof config.defaultCurrency === 'string'
            ? config.defaultCurrency
            : DEFAULT_LOCALE_CONFIG.defaultCurrency,
      };

      const tenantContext: TenantContext = {
        id: tenant.id,
        slug: tenant.slug,
        dbUrl: dbUrlTemplate.replace('{slug}', tenant.slug),
        config,
        planId: tenant.planId,
        status: tenant.status,
        localeConfig,
      };

      // Cache in Redis
      await this.redis.setJson(cacheKey, tenantContext, TENANT_CACHE_TTL);
      this.logger.debug(`Tenant cache miss, cached: ${slug}`);

      return tenantContext;
    } catch (error) {
      this.logger.error(`Error resolving tenant ${slug}`, error);
      return null;
    }
  }
}
