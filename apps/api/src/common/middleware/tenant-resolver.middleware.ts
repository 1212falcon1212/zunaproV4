import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export interface TenantContext {
  id: string;
  slug: string;
  dbUrl: string;
}

@Injectable()
export class TenantResolverMiddleware implements NestMiddleware {
  private readonly logger = new Logger(TenantResolverMiddleware.name);

  async use(req: Request, _res: Response, next: NextFunction) {
    const host = req.headers.host || '';
    const subdomain = this.extractSubdomain(host);

    if (subdomain) {
      this.logger.debug(`Tenant slug extracted: ${subdomain}`);
      (req as any).tenantSlug = subdomain;
    }

    next();
  }

  private extractSubdomain(host: string): string | null {
    const parts = host.split('.');
    if (parts.length >= 3) {
      return parts[0];
    }
    return null;
  }
}
