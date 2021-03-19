import { Controller, Get } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { Permission } from './models/permission.entity';

@Controller('permissions')
export class PermissionController {
  constructor(private permissionService: PermissionService) {}

  @Get()
  async all(): Promise<Permission[]> {
    return this.permissionService.all();
  }
}
