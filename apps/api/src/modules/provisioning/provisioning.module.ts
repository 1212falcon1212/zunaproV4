import { Module } from '@nestjs/common';
import { ProvisioningGateway } from './provisioning.gateway';
import { ProvisioningService } from './provisioning.service';
import { TenantSeederService } from './tenant-seeder.service';

@Module({
  providers: [ProvisioningGateway, ProvisioningService, TenantSeederService],
  exports: [ProvisioningService],
})
export class ProvisioningModule {}
