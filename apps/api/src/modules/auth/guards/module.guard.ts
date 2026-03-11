import { Injectable, CanActivate, ExecutionContext, ForbiddenException, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const REQUIRED_MODULE_KEY = 'requiredModule';
export const RequireModule = (moduleSlug: string) => SetMetadata(REQUIRED_MODULE_KEY, moduleSlug);

@Injectable()
export class ModuleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredModule = this.reflector.getAllAndOverride<string>(REQUIRED_MODULE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredModule) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user?.activeModules) {
      throw new ForbiddenException('No module access information available');
    }

    if (!user.activeModules.includes(requiredModule)) {
      throw new ForbiddenException(`Module '${requiredModule}' is not available in your plan`);
    }

    return true;
  }
}
