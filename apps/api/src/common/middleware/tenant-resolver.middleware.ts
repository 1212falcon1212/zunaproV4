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

export interface TenantContext {
  id: string;
  slug: string;
  dbUrl: string;
  config: Record<string, unknown>;
  planId: string;
  status: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      tenant?: TenantContext;
    }
  }
}

const TENANT_CACHE_TTL = 300; // 5 minutes

@Injectable()
export class TenantResolverMiddleware implements NestMiddleware {
  private readonly logger = new Logger(TenantResolverMiddleware.name);

  constructor(private readonly redis: RedisService) {}

  async use(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const host = req.headers.host || '';

    // Try subdomain first, then custom domain
    let slug = this.extractSubdomain(host);

    if (!slug) {
      slug = await this.resolveCustomDomain(host);
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

    req.tenant = tenant;
    next();
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

      const dbUrlTemplate =
        process.env.DATABASE_TENANT_URL_TEMPLATE || '';
      const tenantContext: TenantContext = {
        id: tenant.id,
        slug: tenant.slug,
        dbUrl: dbUrlTemplate.replace('{slug}', tenant.slug),
        config: tenant.config as Record<string, unknown>,
        planId: tenant.planId,
        status: tenant.status,
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
