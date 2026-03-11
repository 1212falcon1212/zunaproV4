import {
  Injectable,
  Logger,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { masterPrisma } from '@zunapro/db';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly refreshSecret: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.refreshSecret = this.configService.get<string>(
      'JWT_REFRESH_SECRET',
      '',
    );
  }

  async register(dto: RegisterDto, tenantId: string) {
    // Check if user already exists for this tenant
    const existingUser = await masterPrisma.user.findFirst({
      where: { email: dto.email, tenantId },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await masterPrisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        tenantId,
        role: 'owner',
      },
    });

    // Get tenant info for token
    const tenant = await masterPrisma.tenant.findUnique({
      where: { id: tenantId },
      include: { tenantModules: { where: { isActive: true } } },
    });

    const tokens = this.generateTokens({
      userId: user.id,
      tenantId,
      planId: tenant?.planId || '',
      role: user.role,
      activeModules: tenant?.tenantModules.map((m) => m.moduleSlug) || [],
    });

    this.logger.log(`User registered: ${dto.email} for tenant ${tenantId}`);

    return {
      user: { id: user.id, email: user.email, role: user.role },
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
    // Find user across all tenants (email + tenant combo is unique)
    const user = await masterPrisma.user.findFirst({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Get tenant info
    const tenant = await masterPrisma.tenant.findUnique({
      where: { id: user.tenantId },
      include: { tenantModules: { where: { isActive: true } } },
    });

    if (!tenant || tenant.status !== 'active') {
      throw new UnauthorizedException('Tenant is not active');
    }

    const tokens = this.generateTokens({
      userId: user.id,
      tenantId: user.tenantId,
      planId: tenant.planId,
      role: user.role,
      activeModules: tenant.tenantModules.map((m) => m.moduleSlug),
    });

    this.logger.log(`User logged in: ${dto.email}`);

    return {
      user: { id: user.id, email: user.email, role: user.role },
      ...tokens,
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.refreshSecret,
      });

      // Verify user still exists and tenant is active
      const user = await masterPrisma.user.findUnique({
        where: { id: payload.userId as string },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const tenant = await masterPrisma.tenant.findUnique({
        where: { id: user.tenantId },
        include: { tenantModules: { where: { isActive: true } } },
      });

      if (!tenant || tenant.status !== 'active') {
        throw new UnauthorizedException('Tenant is not active');
      }

      const tokens = this.generateTokens({
        userId: user.id,
        tenantId: user.tenantId,
        planId: tenant.planId,
        role: user.role,
        activeModules: tenant.tenantModules.map((m) => m.moduleSlug),
      });

      return tokens;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async getProfile(userId: string) {
    const user = await masterPrisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        tenantId: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  private generateTokens(payload: {
    userId: string;
    tenantId: string;
    planId: string;
    role: string;
    activeModules: string[];
  }) {
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(
      { userId: payload.userId, tenantId: payload.tenantId },
      {
        secret: this.refreshSecret,
        expiresIn: '7d',
      },
    );

    return { accessToken, refreshToken };
  }
}
