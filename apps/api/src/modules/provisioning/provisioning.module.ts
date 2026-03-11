import { Module } from '@nestjs/common';
import { ProvisioningGateway } from './provisioning.gateway';
import { ProvisioningService } from './provisioning.service';

@Module({
  providers: [ProvisioningGateway, ProvisioningService],
  exports: [ProvisioningService],
})
export class ProvisioningModule {}
