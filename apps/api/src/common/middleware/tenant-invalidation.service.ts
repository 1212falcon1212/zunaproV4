import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class TenantCacheInvalidationService {
  private readonly logger = new Logger(TenantCacheInvalidationService.name);

  constructor(private readonly redis: RedisService) {}

  async invalidateTenant(slug: string): Promise<void> {
    await this.redis.del(`tenant:${slug}`);
    this.logger.log(`Invalidated tenant cache: ${slug}`);
  }

  async invalidateCustomDomain(domain: string): Promise<void> {
    await this.redis.del(`domain:${domain}`);
    this.logger.log(`Invalidated custom domain cache: ${domain}`);
  }

  async invalidateAll(slug: string, domain?: string): Promise<void> {
    await this.invalidateTenant(slug);
    if (domain) {
      await this.invalidateCustomDomain(domain);
    }
  }
}
