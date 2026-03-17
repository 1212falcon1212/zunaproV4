import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { getTenantClient } from '@zunapro/db';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

interface FindCustomersOptions {
  page?: number;
  limit?: number;
  search?: string;
  isGuest?: boolean;
}

@Injectable()
export class CustomersService {
  private readonly logger = new Logger(CustomersService.name);

  async findAll(tenantSlug: string, options: FindCustomersOptions = {}) {
    const { page = 1, limit = 20, search, isGuest } = options;
    const prisma = getTenantClient(tenantSlug);
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (isGuest !== undefined) where.isGuest = isGuest;
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          isGuest: true,
          locale: true,
          createdAt: true,
          _count: { select: { orders: true } },
        },
      }),
      prisma.customer.count({ where }),
    ]);

    return {
      data: customers,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(tenantSlug: string, id: string) {
    const prisma = getTenantClient(tenantSlug);

    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    // Calculate total spent
    const totalSpent = await prisma.order.aggregate({
      where: { customerId: id, paymentStatus: 'paid' },
      _sum: { totalAmount: true },
    });

    return {
      ...customer,
      totalSpent: Number(totalSpent._sum.totalAmount ?? 0),
      orderCount: customer.orders.length,
    };
  }

  async create(tenantSlug: string, dto: CreateCustomerDto) {
    const prisma = getTenantClient(tenantSlug);

    const existing = await prisma.customer.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('Customer with this email already exists');
    }

    const customer = await prisma.customer.create({
      data: {
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        locale: dto.locale ?? 'en',
        addresses: (dto.addresses as object[]) ?? [],
        isGuest: false,
      },
    });

    this.logger.log(`Customer created: ${dto.email} (tenant: ${tenantSlug})`);
    return customer;
  }

  async update(tenantSlug: string, id: string, dto: UpdateCustomerDto) {
    const prisma = getTenantClient(tenantSlug);

    const customer = await prisma.customer.findUnique({ where: { id } });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    if (dto.email && dto.email !== customer.email) {
      const existing = await prisma.customer.findUnique({
        where: { email: dto.email },
      });
      if (existing) {
        throw new ConflictException('Email already in use');
      }
    }

    const data: Record<string, unknown> = {};
    if (dto.email !== undefined) data.email = dto.email;
    if (dto.firstName !== undefined) data.firstName = dto.firstName;
    if (dto.lastName !== undefined) data.lastName = dto.lastName;
    if (dto.phone !== undefined) data.phone = dto.phone;
    if (dto.locale !== undefined) data.locale = dto.locale;
    if (dto.addresses !== undefined) data.addresses = dto.addresses;

    const updated = await prisma.customer.update({
      where: { id },
      data: data as Parameters<typeof prisma.customer.update>[0]['data'],
    });

    this.logger.log(`Customer updated: ${updated.email} (tenant: ${tenantSlug})`);
    return updated;
  }

  async remove(tenantSlug: string, id: string) {
    const prisma = getTenantClient(tenantSlug);

    const customer = await prisma.customer.findUnique({ where: { id } });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    // Soft delete: remove personal data but keep for order references
    await prisma.customer.update({
      where: { id },
      data: {
        email: `archived_${id}@deleted.local`,
        firstName: 'Archived',
        lastName: 'Customer',
        phone: null,
        passwordHash: null,
        addresses: [],
      },
    });

    this.logger.log(`Customer archived: ${id} (tenant: ${tenantSlug})`);
    return { archived: true };
  }

  async getStats(tenantSlug: string) {
    const prisma = getTenantClient(tenantSlug);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [total, newThisMonth, guests, registered] = await Promise.all([
      prisma.customer.count(),
      prisma.customer.count({
        where: { createdAt: { gte: startOfMonth } },
      }),
      prisma.customer.count({ where: { isGuest: true } }),
      prisma.customer.count({ where: { isGuest: false } }),
    ]);

    return { total, newThisMonth, guests, registered };
  }
}
