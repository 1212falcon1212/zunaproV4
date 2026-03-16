import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { connect, NatsConnection, StringCodec } from 'nats';
import { ProvisioningGateway } from './provisioning.gateway';
import { TenantSeederService } from './tenant-seeder.service';
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
    private readonly tenantSeeder: TenantSeederService,
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

    // Update status to provisioning
    await masterPrisma.tenant.update({
      where: { id: tenantId },
      data: { status: 'provisioning' },
    });

    if (!this.natsConnection) {
      this.logger.warn('NATS not connected, running dev provisioning locally');
      this.runDevProvisioning(tenantId, request.slug).catch((err) => {
        this.logger.error(`Dev provisioning failed: ${err}`);
      });
      return;
    }

    const data = JSON.stringify(request);
    this.natsConnection.publish('tenant.provision', this.sc.encode(data));
    this.logger.log(`Published provisioning job for tenant ${tenant.slug}`);
  }

  /**
   * Dev mode: simulate provisioning steps locally without Go engine.
   * Creates the tenant database and seeds schema via Prisma.
   */
  private async runDevProvisioning(tenantId: string, slug: string): Promise<void> {
    const jobs = [
      'CreateTenantDatabase',
      'ConfigureTenant',
      'SetupDomain',
      'SeedInitialData',
      'ProcessBranding',
      'HealthCheck',
      'FinalizeAndNotify',
    ];

    const totalSteps = jobs.length;

    for (let i = 0; i < jobs.length; i++) {
      const jobName = jobs[i];
      this.gateway.emitProgress(tenantId, {
        jobName,
        status: 'running',
        step: i,
        totalSteps,
        message: `Running ${jobName}...`,
      });

      try {
        if (jobName === 'CreateTenantDatabase') {
          // Create the tenant database
          const { execSync } = await import('child_process');
          const dbUrl = process.env.DATABASE_MASTER_URL ?? '';
          const match = dbUrl.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\//);
          if (match) {
            const [, user, password, host, port] = match;
            const dbName = `tenant_${slug}`;
            try {
              execSync(
                `PGPASSWORD=${password} psql -h ${host} -p ${port} -U ${user} -tc "SELECT 1 FROM pg_database WHERE datname='${dbName}'" | grep -q 1 || PGPASSWORD=${password} createdb -h ${host} -p ${port} -U ${user} ${dbName}`,
                { stdio: 'pipe' },
              );
              this.logger.log(`Created database: ${dbName}`);
            } catch {
              this.logger.warn(`Database ${dbName} may already exist, continuing...`);
            }
          }
        }

        if (jobName === 'ConfigureTenant') {
          // Push tenant schema
          const { execSync } = await import('child_process');
          const dbUrl = (process.env.DATABASE_TENANT_URL_TEMPLATE ?? '').replace('{slug}', slug);
          try {
            execSync(
              `DATABASE_URL="${dbUrl}" npx prisma db push --schema=packages/db/prisma/tenant.prisma --skip-generate --accept-data-loss`,
              { stdio: 'pipe', cwd: process.cwd().replace('/apps/api', '').replace('/dist', '') },
            );
            this.logger.log(`Pushed tenant schema for: ${slug}`);
          } catch (err) {
            this.logger.warn(`Schema push warning: ${err}`);
          }
        }

        if (jobName === 'SeedInitialData') {
          const tenant = await masterPrisma.tenant.findUnique({
            where: { id: tenantId },
          });
          if (tenant) {
            const config = (tenant.config ?? {}) as Record<string, unknown>;
            const sector = (config.sector as string) || 'genel';
            const theme =
              (config.theme as Record<string, string>) || {};
            await this.tenantSeeder.seedTenant(slug, sector, {
              primaryColor: theme.primary || '#6366f1',
              secondaryColor: theme.secondary || '#475569',
              accentColor: theme.accent || '#f59e0b',
            });
          }
        }

        // Small delay to simulate progress
        await new Promise((resolve) => setTimeout(resolve, 500));

        this.gateway.emitProgress(tenantId, {
          jobName,
          status: 'completed',
          step: i + 1,
          totalSteps,
          message: `${jobName} completed`,
        });
      } catch (err) {
        this.gateway.emitProgress(tenantId, {
          jobName,
          status: 'failed',
          step: i,
          totalSteps,
          message: `${jobName} failed: ${err}`,
        });

        await masterPrisma.tenant.update({
          where: { id: tenantId },
          data: { status: 'provisioning_failed' },
        });
        return;
      }
    }

    // Mark tenant as active
    await masterPrisma.tenant.update({
      where: { id: tenantId },
      data: { status: 'active' },
    });

    // Send completion event
    this.gateway.emitProgress(tenantId, {
      jobName: 'FinalizeAndNotify',
      status: 'completed',
      step: totalSteps,
      totalSteps,
      message: 'Provisioning complete',
      type: 'provisioning_complete',
      panelUrl: `http://localhost:3000/tr/panel`,
      storefrontUrl: `http://localhost:3000/store/tr`,
    });

    this.logger.log(`Dev provisioning completed for tenant: ${slug}`);
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
          const data = JSON.parse(this.sc.decode(msg.data)) as Record<string, unknown>;
          const tenantId = msg.subject.split('.').pop();
          if (tenantId) {
            this.gateway.emitProgress(tenantId, data);
            this.logger.debug(
              `Forwarded progress to WebSocket: ${String(data.jobName)} - ${String(data.status)}`,
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
