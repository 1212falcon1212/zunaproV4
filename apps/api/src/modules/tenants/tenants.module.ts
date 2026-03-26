import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TenantsController } from './tenants.controller';
import { TenantsService } from './tenants.service';
import { TenantCacheInvalidationService } from '../../common/middleware/tenant-invalidation.service';
import { RedisModule } from '../../common/redis';
import { ProvisioningModule } from '../provisioning/provisioning.module';

@Module({
  imports: [
    RedisModule,
    ProvisioningModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_ACCESS_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
    }),
  ],
  controllers: [TenantsController],
  providers: [TenantsService, TenantCacheInvalidationService],
  exports: [TenantsService],
})
export class TenantsModule {}
