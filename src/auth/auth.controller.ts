import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Post,
  Res,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './models/register.dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Controller()
export class AuthController {
  constructor(private userService: UserService, private jwtService: JwtService) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    if (body.password !== body.password_confirm) {
      throw new BadRequestException('Passwords do not match!');
    }
    const hashedPassword = await bcrypt.hash(body.password, 12);
    const newUser = { ...body, password: hashedPassword };
    return this.userService.create(newUser);
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response
  ) {
    const user = await this.userService.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Invalid credentials!');
    }

    const jwt = await this.jwtService.signAsync({ id: user.id });

    response.cookie('jwt', jwt, { httpOnly: true });

    return user;
  }
}
