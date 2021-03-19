import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../common/common.module';
import { Permission } from './models/permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Permission]), CommonModule],
  providers: [PermissionService],
  controllers: [PermissionController],
})
export class PermissionModule {}
