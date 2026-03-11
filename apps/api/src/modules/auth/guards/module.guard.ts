import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const REQUIRED_MODULE_KEY = 'requiredModule';
export const RequireModule = (moduleSlug: string) =>
  (target: object, key?: string, descriptor?: PropertyDescriptor): PropertyDescriptor | void => {
    Reflect.defineMetadata(REQUIRED_MODULE_KEY, moduleSlug, descriptor?.value || target);
    return descriptor || undefined;
  };

@Injectable()
export class ModuleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredModule = this.reflector.get<string>(REQUIRED_MODULE_KEY, context.getHandler());
    if (!requiredModule) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user as { activeModules?: string[] } | undefined;
    if (!user?.activeModules) return false;

    if (!user.activeModules.includes(requiredModule)) {
      throw new ForbiddenException(`Module '${requiredModule}' is not available in your plan`);
    }

    return true;
  }
}
