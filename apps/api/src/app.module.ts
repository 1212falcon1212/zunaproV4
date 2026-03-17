import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ProvisioningModule } from './modules/provisioning/provisioning.module';
import { HealthModule } from './modules/health/health.module';
import { PlansModule } from './modules/plans/plans.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductsModule } from './modules/products/products.module';
import { MediaModule } from './modules/media/media.module';
import { SearchModule } from './modules/search/search.module';
import { CartModule } from './modules/cart/cart.module';
import { StorefrontModule } from './modules/storefront/storefront.module';
import { OrdersModule } from './modules/orders/orders.module';
import { CustomersModule } from './modules/customers/customers.module';
import { ShippingModule } from './modules/shipping/shipping.module';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { SettingsModule } from './modules/settings/settings.module';
import { PageBuilderModule } from './modules/page-builder/page-builder.module';
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
    PlansModule,
    CategoriesModule,
    ProductsModule,
    MediaModule,
    SearchModule,
    CartModule,
    StorefrontModule,
    OrdersModule,
    CustomersModule,
    ShippingModule,
    InvoicesModule,
    SettingsModule,
    PageBuilderModule,
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
