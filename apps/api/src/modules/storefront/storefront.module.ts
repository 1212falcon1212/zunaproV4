import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { StorefrontController } from './storefront.controller';
import { StorefrontService } from './storefront.service';
import { StorefrontAuthController } from './auth/storefront-auth.controller';
import { StorefrontAuthService } from './auth/storefront-auth.service';
import { StorefrontAuthGuard } from './auth/storefront-auth.guard';

@Module({
  imports: [JwtModule.register({})],
  controllers: [StorefrontController, StorefrontAuthController],
  providers: [StorefrontService, StorefrontAuthService, StorefrontAuthGuard],
  exports: [StorefrontAuthService, StorefrontAuthGuard],
})
export class StorefrontModule {}
