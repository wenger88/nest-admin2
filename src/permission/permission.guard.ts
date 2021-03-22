import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { RoleService } from '../role/role.service';
import { User } from '../user/models/user.entity';
import { Role } from '../role/models/role.entity';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
    private userService: UserService,
    private roleService: RoleService
  ) {}
  async canActivate(context: ExecutionContext) {
    const access = this.reflector.get<string>('access', context.getHandler());

    if (!access) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const id: number = await this.authService.user(request);
    const user: User = await this.userService.findOne({ id }, ['role']);

    if (!user.role) {
      return true;
    }

    const role: Role = await this.roleService.findOne({ id: user.role.id }, ['permissions']);

    if (request.method === 'GET') {
      return role.permissions.some(p => p.name === `view_${access}` || p.name === `edit_${access}`);
    }
    return role.permissions.some(p => p.name === `edit_${access}`);
  }
}
