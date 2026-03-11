import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class CsrfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const method = request.method.toUpperCase();

    // Only check state-changing methods
    if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
      return true;
    }

    // Check for X-Requested-With header (AJAX requests set this)
    const xRequestedWith = request.headers['x-requested-with'];
    if (xRequestedWith === 'XMLHttpRequest' || xRequestedWith === 'fetch') {
      return true;
    }

    // Check for Authorization header (API calls)
    if (request.headers.authorization) {
      return true;
    }

    // Check for content-type being JSON (browsers don't send JSON in simple requests)
    const contentType = request.headers['content-type'];
    if (contentType && contentType.includes('application/json')) {
      return true;
    }

    throw new ForbiddenException('CSRF validation failed');
  }
}
