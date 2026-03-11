import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly jwtService: JwtService) {}

  async register(dto: RegisterDto) {
    this.logger.log(`Register attempt for ${dto.email}`);
    return { message: 'Registration endpoint ready' };
  }

  async login(dto: LoginDto) {
    this.logger.log(`Login attempt for ${dto.email}`);
    return { message: 'Login endpoint ready' };
  }

  async refresh() {
    return { message: 'Refresh endpoint ready' };
  }
}
