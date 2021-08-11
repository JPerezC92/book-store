import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../entities/role.entity';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly _reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles: string[] = this._reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const { user } = request;

    const hasRole = () =>
      user.roles.some((role: Role) => roles.includes(role.name));

    return user && user.roles && hasRole();
  }
}
