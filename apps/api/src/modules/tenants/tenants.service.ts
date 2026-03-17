import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { masterPrisma } from '@zunapro/db';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { TenantCacheInvalidationService } from '../../common/middleware/tenant-invalidation.service';

@Injectable()
export class TenantsService {
  private readonly logger = new Logger(TenantsService.name);
  private readonly refreshSecret: string;

  constructor(
    private readonly cacheInvalidation: TenantCacheInvalidationService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET', '');
  }

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [tenants, total] = await Promise.all([
      masterPrisma.tenant.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { plan: { select: { name: true, slug: true } } },
      }),
      masterPrisma.tenant.count(),
    ]);

    return {
      data: tenants,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const tenant = await masterPrisma.tenant.findUnique({
      where: { id },
      include: {
        plan: true,
        tenantModules: { include: { module: true } },
        customDomains: true,
      },
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }

    return tenant;
  }

  async findBySlug(slug: string) {
    const tenant = await masterPrisma.tenant.findUnique({
      where: { slug },
    });

    return tenant;
  }

  async checkSlugAvailability(slug: string) {
    const existing = await masterPrisma.tenant.findUnique({
      where: { slug },
      select: { id: true },
    });

    return { available: !existing, slug };
  }

  async create(dto: CreateTenantDto, userId?: string) {
    const existing = await masterPrisma.tenant.findUnique({
      where: { slug: dto.slug },
    });

    if (existing) {
      throw new ConflictException(`Slug '${dto.slug}' is already taken`);
    }

    const plan = await masterPrisma.plan.findUnique({
      where: { id: dto.planId },
    });

    if (!plan) {
      throw new NotFoundException(`Plan with ID ${dto.planId} not found`);
    }

    const tenant = await masterPrisma.tenant.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        planId: dto.planId,
        config: {
          sector: dto.sector,
          locales: dto.locales,
          defaultLocale: dto.defaultLocale,
          currencies: dto.currencies,
          defaultCurrency: dto.defaultCurrency,
          timezone: dto.timezone || 'Europe/Istanbul',
          theme: {
            primary: dto.branding?.primaryColor ?? '#2563eb',
            secondary: dto.branding?.secondaryColor ?? '#475569',
            accent: dto.branding?.accentColor ?? '#f59e0b',
            background: '#ffffff',
          },
        },
        domain: dto.domain,
        status: 'active',
        tenantModules: {
          create: (plan.moduleSlugs.length > 0
            ? plan.moduleSlugs
            : ['ecommerce']
          ).map((moduleSlug) => ({
            moduleSlug,
            isActive: true,
          })),
        },
      },
      include: {
        plan: true,
        tenantModules: true,
      },
    });

    this.logger.log(`Tenant created: ${tenant.slug} (${tenant.id})`);

    // If userId provided, reassign user to new tenant and return new tokens
    if (userId) {
      await masterPrisma.user.update({
        where: { id: userId },
        data: { tenantId: tenant.id },
      });

      const user = await masterPrisma.user.findUnique({ where: { id: userId } });
      const activeModules = tenant.tenantModules.map((m) => m.moduleSlug);

      const accessToken = this.jwtService.sign({
        userId,
        tenantId: tenant.id,
        planId: tenant.planId,
        role: user?.role || 'owner',
        activeModules: activeModules.length > 0 ? activeModules : ['ecommerce'],
      }, { expiresIn: '15m' });

      const refreshToken = this.jwtService.sign(
        { userId, tenantId: tenant.id },
        { secret: this.refreshSecret, expiresIn: '7d' },
      );

      return { ...tenant, accessToken, refreshToken };
    }

    return tenant;
  }

  async update(id: string, dto: UpdateTenantDto) {
    const tenant = await masterPrisma.tenant.findUnique({ where: { id } });

    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }

    const updated = await masterPrisma.tenant.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.domain !== undefined && { domain: dto.domain }),
        ...(dto.config && { config: dto.config as Record<string, string> }),
      },
    });

    await this.cacheInvalidation.invalidateAll(
      tenant.slug,
      tenant.domain || undefined,
    );

    this.logger.log(`Tenant updated: ${updated.slug}`);
    return updated;
  }

  async suspend(id: string) {
    const tenant = await masterPrisma.tenant.findUnique({ where: { id } });

    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }

    const updated = await masterPrisma.tenant.update({
      where: { id },
      data: { status: 'suspended' },
    });

    await this.cacheInvalidation.invalidateTenant(tenant.slug);
    this.logger.log(`Tenant suspended: ${tenant.slug}`);
    return updated;
  }
}
