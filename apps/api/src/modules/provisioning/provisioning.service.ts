import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ProvisioningService {
  private readonly logger = new Logger(ProvisioningService.name);

  async publishProvisioningJob(tenantId: string, config: Record<string, unknown>) {
    this.logger.log(`Publishing provisioning job for tenant ${tenantId}`);
    return { message: 'Provisioning service ready' };
  }

  async getProvisioningStatus(tenantId: string) {
    this.logger.log(`Getting provisioning status for tenant ${tenantId}`);
    return { tenantId, status: 'pending', jobs: [] };
  }
}
