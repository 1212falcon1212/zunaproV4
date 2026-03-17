import {
  Injectable,
  Logger,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { getTenantClient } from '@zunapro/db';
import { StorefrontRegisterDto } from './dto/register.dto';
import { StorefrontLoginDto } from './dto/login.dto';
import type { StorefrontJwtPayload } from '@zunapro/types';

@Injectable()
export class StorefrontAuthService {
  private readonly logger = new Logger(StorefrontAuthService.name);
  private readonly jwtSecret: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.jwtSecret = this.configService.get<string>(
      'STOREFRONT_JWT_SECRET',
      this.configService.get<string>('JWT_ACCESS_SECRET', '') + '_storefront',
    );
  }

  private generateToken(payload: StorefrontJwtPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.jwtSecret,
      expiresIn: '30d',
    });
  }

  verifyToken(token: string): StorefrontJwtPayload {
    return this.jwtService.verify<StorefrontJwtPayload>(token, {
      secret: this.jwtSecret,
    });
  }

  async register(tenantSlug: string, dto: StorefrontRegisterDto) {
    const prisma = getTenantClient(tenantSlug);

    const existing = await prisma.customer.findUnique({
      where: { email: dto.email },
    });

    if (existing && !existing.isGuest) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const customer = existing
      ? await prisma.customer.update({
          where: { id: existing.id },
          data: {
            firstName: dto.firstName,
            lastName: dto.lastName,
            phone: dto.phone,
            passwordHash,
            isGuest: false,
            lastLoginAt: new Date(),
          },
        })
      : await prisma.customer.create({
          data: {
            email: dto.email,
            firstName: dto.firstName,
            lastName: dto.lastName,
            phone: dto.phone,
            passwordHash,
            isGuest: false,
            lastLoginAt: new Date(),
          },
        });

    const token = this.generateToken({
      customerId: customer.id,
      tenantSlug,
      isGuest: false,
    });

    this.logger.log(`Customer registered: ${dto.email} (tenant: ${tenantSlug})`);

    return {
      customer: {
        id: customer.id,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
      },
      token,
    };
  }

  async login(tenantSlug: string, dto: StorefrontLoginDto) {
    const prisma = getTenantClient(tenantSlug);

    const customer = await prisma.customer.findUnique({
      where: { email: dto.email },
    });

    if (!customer || !customer.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(dto.password, customer.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await prisma.customer.update({
      where: { id: customer.id },
      data: { lastLoginAt: new Date() },
    });

    const token = this.generateToken({
      customerId: customer.id,
      tenantSlug,
      isGuest: false,
    });

    this.logger.log(`Customer logged in: ${dto.email} (tenant: ${tenantSlug})`);

    return {
      customer: {
        id: customer.id,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
      },
      token,
    };
  }

  async createGuest(tenantSlug: string, email?: string) {
    const prisma = getTenantClient(tenantSlug);

    const guestEmail = email || `guest_${Date.now()}@${tenantSlug}.zunapro.com`;

    const customer = await prisma.customer.create({
      data: {
        email: guestEmail,
        firstName: 'Guest',
        lastName: 'Customer',
        isGuest: true,
      },
    });

    const token = this.generateToken({
      customerId: customer.id,
      tenantSlug,
      isGuest: true,
    });

    return { customer: { id: customer.id, email: customer.email }, token };
  }

  async getProfile(tenantSlug: string, customerId: string) {
    const prisma = getTenantClient(tenantSlug);

    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        locale: true,
        addresses: true,
        isGuest: true,
        createdAt: true,
      },
    });

    if (!customer) {
      throw new UnauthorizedException('Customer not found');
    }

    return customer;
  }

  async updateProfile(
    tenantSlug: string,
    customerId: string,
    data: { firstName?: string; lastName?: string; phone?: string; locale?: string; addresses?: unknown },
  ) {
    const prisma = getTenantClient(tenantSlug);

    const updateData: Record<string, unknown> = {};
    if (data.firstName !== undefined) updateData.firstName = data.firstName;
    if (data.lastName !== undefined) updateData.lastName = data.lastName;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.locale !== undefined) updateData.locale = data.locale;
    if (data.addresses !== undefined) updateData.addresses = data.addresses;

    const customer = await prisma.customer.update({
      where: { id: customerId },
      data: updateData as Parameters<typeof prisma.customer.update>[0]['data'],
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        locale: true,
        addresses: true,
        isGuest: true,
      },
    });

    return customer;
  }
}
