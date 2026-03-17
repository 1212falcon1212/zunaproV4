import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { StorefrontAuthService } from './storefront-auth.service';
import { StorefrontAuthGuard } from './storefront-auth.guard';
import { StorefrontRegisterDto } from './dto/register.dto';
import { StorefrontLoginDto } from './dto/login.dto';

@Controller('storefront/auth')
export class StorefrontAuthController {
  constructor(private readonly authService: StorefrontAuthService) {}

  @Post('register')
  register(@Req() req: Request, @Body() dto: StorefrontRegisterDto) {
    return this.authService.register(req.tenant!.slug, dto);
  }

  @Post('login')
  login(@Req() req: Request, @Body() dto: StorefrontLoginDto) {
    return this.authService.login(req.tenant!.slug, dto);
  }

  @Post('guest')
  guest(@Req() req: Request, @Body() body: { email?: string }) {
    return this.authService.createGuest(req.tenant!.slug, body.email);
  }

  @Get('me')
  @UseGuards(StorefrontAuthGuard)
  getProfile(@Req() req: Request) {
    return this.authService.getProfile(
      req.tenant!.slug,
      req.customer!.customerId,
    );
  }

  @Patch('me')
  @UseGuards(StorefrontAuthGuard)
  updateProfile(
    @Req() req: Request,
    @Body()
    body: {
      firstName?: string;
      lastName?: string;
      phone?: string;
      locale?: string;
      addresses?: unknown;
    },
  ) {
    return this.authService.updateProfile(
      req.tenant!.slug,
      req.customer!.customerId,
      body,
    );
  }
}
