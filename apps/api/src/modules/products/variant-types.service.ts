import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { getTenantClient } from '@zunapro/db';

@Injectable()
export class VariantTypesService {
  private readonly logger = new Logger(VariantTypesService.name);

  async getAll(tenantSlug: string) {
    const prisma = getTenantClient(tenantSlug);

    const types = await prisma.variantType.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        options: {
          orderBy: { sortOrder: 'asc' },
        },
        _count: { select: { options: true } },
      },
    });

    return types;
  }

  async getById(tenantSlug: string, id: string) {
    const prisma = getTenantClient(tenantSlug);

    const type = await prisma.variantType.findUnique({
      where: { id },
      include: {
        options: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!type) {
      throw new NotFoundException(`VariantType with ID ${id} not found`);
    }

    return type;
  }

  async create(
    tenantSlug: string,
    data: { name: Record<string, string>; slug: string },
  ) {
    const prisma = getTenantClient(tenantSlug);

    const existing = await prisma.variantType.findUnique({
      where: { slug: data.slug },
    });
    if (existing) {
      throw new ConflictException(
        `VariantType with slug '${data.slug}' already exists`,
      );
    }

    const maxSort = await prisma.variantType.aggregate({
      _max: { sortOrder: true },
    });

    const type = await prisma.variantType.create({
      data: {
        name: data.name,
        slug: data.slug,
        sortOrder: (maxSort._max.sortOrder ?? -1) + 1,
      },
      include: { options: true },
    });

    this.logger.log(
      `VariantType created: ${data.slug} (tenant: ${tenantSlug})`,
    );
    return type;
  }

  async update(
    tenantSlug: string,
    id: string,
    data: { name?: Record<string, string>; slug?: string; sortOrder?: number },
  ) {
    const prisma = getTenantClient(tenantSlug);

    const type = await prisma.variantType.findUnique({ where: { id } });
    if (!type) {
      throw new NotFoundException(`VariantType with ID ${id} not found`);
    }

    if (data.slug && data.slug !== type.slug) {
      const existing = await prisma.variantType.findUnique({
        where: { slug: data.slug },
      });
      if (existing) {
        throw new ConflictException(
          `VariantType with slug '${data.slug}' already exists`,
        );
      }
    }

    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;

    const updated = await prisma.variantType.update({
      where: { id },
      data: updateData,
      include: { options: { orderBy: { sortOrder: 'asc' } } },
    });

    this.logger.log(
      `VariantType updated: ${updated.slug} (tenant: ${tenantSlug})`,
    );
    return updated;
  }

  async deleteType(tenantSlug: string, id: string) {
    const prisma = getTenantClient(tenantSlug);

    const type = await prisma.variantType.findUnique({ where: { id } });
    if (!type) {
      throw new NotFoundException(`VariantType with ID ${id} not found`);
    }

    await prisma.variantType.delete({ where: { id } });

    this.logger.log(
      `VariantType deleted: ${type.slug} (tenant: ${tenantSlug})`,
    );
    return { deleted: true, id };
  }

  async createOption(
    tenantSlug: string,
    typeId: string,
    data: { name: Record<string, string>; slug: string; colorCode?: string },
  ) {
    const prisma = getTenantClient(tenantSlug);

    const type = await prisma.variantType.findUnique({
      where: { id: typeId },
    });
    if (!type) {
      throw new NotFoundException(`VariantType with ID ${typeId} not found`);
    }

    const existing = await prisma.variantOption.findUnique({
      where: { variantTypeId_slug: { variantTypeId: typeId, slug: data.slug } },
    });
    if (existing) {
      throw new ConflictException(
        `VariantOption with slug '${data.slug}' already exists for this type`,
      );
    }

    const maxSort = await prisma.variantOption.aggregate({
      where: { variantTypeId: typeId },
      _max: { sortOrder: true },
    });

    const option = await prisma.variantOption.create({
      data: {
        variantTypeId: typeId,
        name: data.name,
        slug: data.slug,
        colorCode: data.colorCode ?? null,
        sortOrder: (maxSort._max.sortOrder ?? -1) + 1,
      },
    });

    this.logger.log(
      `VariantOption created: ${data.slug} for type ${typeId} (tenant: ${tenantSlug})`,
    );
    return option;
  }

  async updateOption(
    tenantSlug: string,
    optionId: string,
    data: {
      name?: Record<string, string>;
      slug?: string;
      colorCode?: string | null;
      sortOrder?: number;
    },
  ) {
    const prisma = getTenantClient(tenantSlug);

    const option = await prisma.variantOption.findUnique({
      where: { id: optionId },
    });
    if (!option) {
      throw new NotFoundException(
        `VariantOption with ID ${optionId} not found`,
      );
    }

    if (data.slug && data.slug !== option.slug) {
      const existing = await prisma.variantOption.findUnique({
        where: {
          variantTypeId_slug: {
            variantTypeId: option.variantTypeId,
            slug: data.slug,
          },
        },
      });
      if (existing) {
        throw new ConflictException(
          `VariantOption with slug '${data.slug}' already exists for this type`,
        );
      }
    }

    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.colorCode !== undefined) updateData.colorCode = data.colorCode;
    if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;

    const updated = await prisma.variantOption.update({
      where: { id: optionId },
      data: updateData,
    });

    this.logger.log(
      `VariantOption updated: ${updated.slug} (tenant: ${tenantSlug})`,
    );
    return updated;
  }

  async deleteOption(tenantSlug: string, optionId: string) {
    const prisma = getTenantClient(tenantSlug);

    const option = await prisma.variantOption.findUnique({
      where: { id: optionId },
    });
    if (!option) {
      throw new NotFoundException(
        `VariantOption with ID ${optionId} not found`,
      );
    }

    await prisma.variantOption.delete({ where: { id: optionId } });

    this.logger.log(
      `VariantOption deleted: ${option.slug} (tenant: ${tenantSlug})`,
    );
    return { deleted: true, id: optionId };
  }
}
