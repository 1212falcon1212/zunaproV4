import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { connect, NatsConnection, StringCodec } from 'nats';
import { ProvisioningGateway } from './provisioning.gateway';
import { masterPrisma } from '@zunapro/db';

interface ProvisionRequest {
  tenantId: string;
  slug: string;
  planId: string;
  sector: string;
  config: Record<string, unknown>;
}

interface ProgressEvent {
  jobName: string;
  status: string;
  step: number;
  totalSteps: number;
  message: string;
  type?: string;
}

@Injectable()
export class ProvisioningService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ProvisioningService.name);
  private natsConnection: NatsConnection | null = null;
  private readonly sc = StringCodec();

  constructor(
    private readonly configService: ConfigService,
    private readonly gateway: ProvisioningGateway,
  ) {}

  async onModuleInit() {
    const natsUrl = this.configService.get<string>('NATS_URL');
    if (!natsUrl) {
      this.logger.warn('NATS_URL not configured, provisioning events disabled');
      return;
    }

    try {
      this.natsConnection = await connect({ servers: natsUrl });
      this.logger.log(`Connected to NATS at ${natsUrl}`);
      this.subscribeToProgress();
    } catch (error) {
      this.logger.warn(`Could not connect to NATS: ${error}`);
    }
  }

  async onModuleDestroy() {
    if (this.natsConnection) {
      await this.natsConnection.close();
    }
  }

  /**
   * Publish a provisioning job to NATS for the Go engine to process.
   */
  async triggerProvisioning(tenantId: string): Promise<void> {
    const tenant = await masterPrisma.tenant.findUnique({
      where: { id: tenantId },
      include: { plan: true },
    });

    if (!tenant) {
      throw new Error(`Tenant ${tenantId} not found`);
    }

    const config = tenant.config as Record<string, unknown>;
    const request: ProvisionRequest = {
      tenantId: tenant.id,
      slug: tenant.slug,
      planId: tenant.planId,
      sector: (config.sector as string) || 'genel',
      config: {
        ...config,
        storeName: tenant.name,
        planSlug: tenant.plan.slug,
      },
    };

    if (!this.natsConnection) {
      this.logger.error('NATS not connected, cannot trigger provisioning');
      throw new Error('Provisioning service unavailable');
    }

    const data = JSON.stringify(request);
    this.natsConnection.publish('tenant.provision', this.sc.encode(data));
    this.logger.log(`Published provisioning job for tenant ${tenant.slug}`);

    // Update status to provisioning
    await masterPrisma.tenant.update({
      where: { id: tenantId },
      data: { status: 'provisioning' },
    });
  }

  /**
   * Subscribe to provisioning progress events from Go engine
   * and forward them to WebSocket clients.
   */
  private subscribeToProgress(): void {
    if (!this.natsConnection) return;

    const sub = this.natsConnection.subscribe('provisioning.progress.*');

    (async () => {
      for await (const msg of sub) {
        try {
          const data = JSON.parse(this.sc.decode(msg.data)) as ProgressEvent;
          const tenantId = msg.subject.split('.').pop();
          if (tenantId) {
            this.gateway.emitProgress(tenantId, data);
            this.logger.debug(
              `Forwarded progress to WebSocket: ${data.jobName} - ${data.status}`,
            );
          }
        } catch {
          this.logger.warn('Failed to parse provisioning progress event');
        }
      }
    })();
  }

  async getProvisioningStatus(tenantId: string) {
    const logs = await masterPrisma.provisioningLog.findMany({
      where: { tenantId },
      orderBy: { startedAt: 'desc' },
    });

    const tenant = await masterPrisma.tenant.findUnique({
      where: { id: tenantId },
      select: { status: true },
    });

    return {
      tenantId,
      status: tenant?.status || 'unknown',
      jobs: logs,
    };
  }
}
