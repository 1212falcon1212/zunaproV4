import { Injectable, CanActivate, ExecutionContext, ForbiddenException, SetMetadata, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const REQUIRED_MODULE_KEY = 'requiredModule';
export const RequireModule = (moduleSlug: string) => SetMetadata(REQUIRED_MODULE_KEY, moduleSlug);

@Injectable()
export class ModuleGuard implements CanActivate {
  private readonly logger = new Logger(ModuleGuard.name);

  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredModule = this.reflector.getAllAndOverride<string>(REQUIRED_MODULE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredModule) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Build effective module list with ecommerce always included as base module
    const userModules: string[] = Array.isArray(user?.activeModules)
      ? user.activeModules
      : [];
    const modules = new Set([...userModules, 'ecommerce']);

    if (!modules.has(requiredModule)) {
      this.logger.warn(
        `Module '${requiredModule}' denied for user. Modules: ${JSON.stringify([...modules])}`,
      );
      throw new ForbiddenException(`Module '${requiredModule}' is not available in your plan`);
    }

    return true;
  }
}
