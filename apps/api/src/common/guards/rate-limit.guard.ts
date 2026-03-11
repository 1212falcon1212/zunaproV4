import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Logger,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RedisService } from '../redis/redis.service';
import { Request } from 'express';

export const RATE_LIMIT_KEY = 'rateLimit';
export const RateLimit = (limit: number, windowSeconds: number) =>
  SetMetadata(RATE_LIMIT_KEY, { limit, windowSeconds });

interface RateLimitConfig {
  limit: number;
  windowSeconds: number;
}

@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly logger = new Logger(RateLimitGuard.name);
  private readonly defaultLimit: RateLimitConfig = { limit: 100, windowSeconds: 60 };

  constructor(
    private readonly reflector: Reflector,
    private readonly redis: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const config =
      this.reflector.getAllAndOverride<RateLimitConfig>(RATE_LIMIT_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || this.defaultLimit;

    const request = context.switchToHttp().getRequest<Request>();
    const ip = request.ip || request.socket.remoteAddress || 'unknown';
    const route = request.route?.path || request.path;
    const key = `ratelimit:${ip}:${route}`;

    const current = await this.redis.incr(key);

    if (current === 1) {
      await this.redis.expire(key, config.windowSeconds);
    }

    if (current > config.limit) {
      const ttl = await this.redis.ttl(key);
      this.logger.warn(`Rate limit exceeded for ${ip} on ${route}`);
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: 'Too many requests',
          retryAfter: ttl,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }
}
