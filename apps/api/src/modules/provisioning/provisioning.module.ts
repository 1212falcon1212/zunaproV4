import { Module } from '@nestjs/common';
import { ProvisioningGateway } from './provisioning.gateway';
import { ProvisioningService } from './provisioning.service';
import { TenantSeederService } from './tenant-seeder.service';
import { RedisModule } from '../../common/redis';

@Module({
  imports: [RedisModule],
  providers: [ProvisioningGateway, ProvisioningService, TenantSeederService],
  exports: [ProvisioningService, TenantSeederService],
})
export class ProvisioningModule {}
