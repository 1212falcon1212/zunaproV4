import {
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { getTenantClient } from '@zunapro/db';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function jsonInput(value: unknown): any {
  return JSON.parse(JSON.stringify(value));
}

@Injectable()
export class MenusService {
  private readonly logger = new Logger(MenusService.name);

  async findAll(tenantSlug: string) {
    const prisma = getTenantClient(tenantSlug);
    const menus = await prisma.menu.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    return menus;
  }

  async findById(tenantSlug: string, id: string) {
    const prisma = getTenantClient(tenantSlug);
    const menu = await prisma.menu.findUnique({ where: { id } });
    if (!menu) {
      throw new NotFoundException(`Menu with id "${id}" not found`);
    }
    return menu;
  }

  async findByLocation(tenantSlug: string, location: string) {
    const prisma = getTenantClient(tenantSlug);
    const menu = await prisma.menu.findFirst({
      where: { location, isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
    if (!menu) {
      throw new NotFoundException(`No active menu found for location "${location}"`);
    }
    return menu;
  }

  async create(tenantSlug: string, dto: CreateMenuDto) {
    const prisma = getTenantClient(tenantSlug);
    const menu = await prisma.menu.create({
      data: {
        name: jsonInput(dto.name),
        slug: dto.slug,
        location: dto.location ?? 'header',
        items: dto.items ? jsonInput(dto.items) : jsonInput([]),
        isActive: dto.isActive ?? true,
      },
    });

    this.logger.log(`Menu created: ${dto.slug} (tenant: ${tenantSlug})`);
    return menu;
  }

  async update(tenantSlug: string, id: string, dto: UpdateMenuDto) {
    const prisma = getTenantClient(tenantSlug);
    const menu = await prisma.menu.findUnique({ where: { id } });
    if (!menu) {
      throw new NotFoundException(`Menu with id "${id}" not found`);
    }

    const updateData: Record<string, unknown> = {};
    if (dto.name) updateData.name = jsonInput(dto.name);
    if (dto.location !== undefined) updateData.location = dto.location;
    if (dto.items !== undefined) updateData.items = jsonInput(dto.items);
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive;
    if (dto.sortOrder !== undefined) updateData.sortOrder = dto.sortOrder;

    const updated = await prisma.menu.update({
      where: { id },
      data: updateData,
    });

    this.logger.log(`Menu updated: ${id} (tenant: ${tenantSlug})`);
    return updated;
  }

  async remove(tenantSlug: string, id: string) {
    const prisma = getTenantClient(tenantSlug);
    const menu = await prisma.menu.findUnique({ where: { id } });
    if (!menu) {
      throw new NotFoundException(`Menu with id "${id}" not found`);
    }

    await prisma.menu.delete({ where: { id } });
    this.logger.log(`Menu deleted: ${id} (tenant: ${tenantSlug})`);
    return { message: 'Menu deleted successfully' };
  }
}
