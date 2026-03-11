import { Injectable, Logger } from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';

@Injectable()
export class TenantsService {
  private readonly logger = new Logger(TenantsService.name);

  async findAll() {
    this.logger.log('Finding all tenants');
    return [];
  }

  async findOne(id: string) {
    this.logger.log(`Finding tenant ${id}`);
    return { id };
  }

  async create(dto: CreateTenantDto) {
    this.logger.log(`Creating tenant: ${dto.name}`);
    return { message: 'Tenant creation endpoint ready', name: dto.name };
  }
}
