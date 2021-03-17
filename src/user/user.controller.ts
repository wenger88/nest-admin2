import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './models/user.entity';
import * as bcrypt from 'bcrypt';
import { UserCreateDto } from '../auth/models/user-create.dto';
import { AuthGuard } from '../auth/auth.guard';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  async all(): Promise<User[]> {
    return await this.userService.all();
  }

  @Post()
  async create(@Body() body: UserCreateDto): Promise<User> {
    const hashedPassword = await bcrypt.hash('1234', 12);
    return this.userService.create({ ...body, password: hashedPassword });
  }

  @Get(':id')
  async get(@Param('id') id: number) {
    return this.userService.findOne({ id });
  }
}
