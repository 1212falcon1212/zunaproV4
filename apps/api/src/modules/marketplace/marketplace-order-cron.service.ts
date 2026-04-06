import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { masterPrisma, getTenantClient } from '@zunapro/db';
import { MarketplaceSyncService } from './marketplace-sync.service';
import { RedisService } from '../../common/redis';

@Injectable()
export class MarketplaceOrderCronService {
  private readonly logger = new Logger(MarketplaceOrderCronService.name);

  constructor(
    private readonly syncService: MarketplaceSyncService,
    private readonly redis: RedisService,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleOrderSync() {
    this.logger.log('Starting marketplace order sync cron...');

    try {
      // Get active tenants with marketplace module
      const tenants = await masterPrisma.tenant.findMany({
        where: { status: 'active' },
        include: {
          tenantModules: {
            where: { moduleSlug: 'marketplace', isActive: true },
          },
        },
      });

      const marketplaceTenants = tenants.filter(
        (t) => t.tenantModules.length > 0,
      );

      if (marketplaceTenants.length === 0) {
        this.logger.debug('No tenants with marketplace module, skipping.');
        return;
      }

      for (const tenant of marketplaceTenants) {
        const prisma = getTenantClient(tenant.slug);

        // Find connected marketplaces
        let integrations: Array<{ marketplace: string; isActive: boolean }>;
        try {
          integrations = await prisma.marketplaceIntegration.findMany({
            where: { isActive: true },
            select: { marketplace: true, isActive: true },
          });
        } catch {
          this.logger.warn(
            `Could not query integrations for ${tenant.slug}, skipping.`,
          );
          continue;
        }

        for (const integration of integrations) {
          const lockKey = `order_sync_lock:${tenant.slug}:${integration.marketplace}`;

          // Simple lock: check if already running
          const existing = await this.redis.get(lockKey);
          if (existing) {
            this.logger.debug(
              `Sync already running for ${tenant.slug}/${integration.marketplace}, skipping.`,
            );
            continue;
          }

          // Acquire lock (5 minute TTL)
          await this.redis.set(lockKey, '1', 300);

          try {
            // Fetch orders from last 30 minutes (overlap for safety)
            const endDate = Date.now();
            const startDate = endDate - 30 * 60 * 1000;

            const result = await this.syncService.syncOrders(
              tenant.slug,
              integration.marketplace,
              { startDate, endDate },
            );

            this.logger.log(
              `Order sync ${tenant.slug}/${integration.marketplace}: ${result.created} created, ${result.updated} updated`,
            );
          } catch (err) {
            this.logger.error(
              `Order sync failed for ${tenant.slug}/${integration.marketplace}: ${err instanceof Error ? err.message : String(err)}`,
            );
          } finally {
            await this.redis.del(lockKey);
          }
        }
      }

      this.logger.log('Marketplace order sync cron completed.');
    } catch (err) {
      this.logger.error(
        `Order sync cron error: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }
}
