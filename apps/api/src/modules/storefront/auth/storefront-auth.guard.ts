import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { StorefrontAuthService } from './storefront-auth.service';
import type { StorefrontJwtPayload } from '@zunapro/types';

@Injectable()
export class StorefrontAuthGuard implements CanActivate {
  constructor(private readonly authService: StorefrontAuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing authentication token');
    }

    const token = authHeader.slice(7);

    try {
      const payload = this.authService.verifyToken(token);

      if (payload.tenantSlug !== request.tenant?.slug) {
        throw new UnauthorizedException('Token does not match tenant');
      }

      request.customer = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
