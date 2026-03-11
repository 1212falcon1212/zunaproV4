import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ProvisioningModule } from './modules/provisioning/provisioning.module';
import { HealthModule } from './modules/health/health.module';
import { RedisModule } from './common/redis';
import { TenantResolverMiddleware } from './common/middleware/tenant-resolver.middleware';
import { TenantCacheInvalidationService } from './common/middleware/tenant-invalidation.service';
import { RateLimitGuard } from './common/guards/rate-limit.guard';
import { CsrfGuard } from './common/guards/csrf.guard';
import { validateConfig } from './config/config.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateConfig,
    }),
    RedisModule,
    AuthModule,
    TenantsModule,
    PaymentsModule,
    ProvisioningModule,
    HealthModule,
  ],
  providers: [
    TenantCacheInvalidationService,
    {
      provide: APP_GUARD,
      useClass: RateLimitGuard,
    },
    {
      provide: APP_GUARD,
      useClass: CsrfGuard,
    },
  ],
  exports: [TenantCacheInvalidationService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantResolverMiddleware)
      .exclude('health', 'auth/(.*)')
      .forRoutes('*');
  }
}
