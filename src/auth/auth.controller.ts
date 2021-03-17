import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Post,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './models/register.dto';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';

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

  /*Return response cookie*/

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res() response: Response
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

  /*Return jwt token*/

  // @Post('login')
  // async login(
  //   @Body('email') email: string,
  //   @Body('password') password: string,
  // ) {
  //   const user = await this.userService.findOne({ email });
  //   if (!user) {
  //     throw new NotFoundException('User not found!');
  //   }
  //   if (!(await bcrypt.compare(password, user.password))) {
  //     throw new BadRequestException('Invalid credentials!');
  //   }
  //   const payload = { username: user.email, sub: user.id };
  //   return {
  //     access_token: this.jwtService.sign(payload),
  //   };
  // }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('user')
  async user(@Req() request: Request) {
    const cookie = request.cookies['jwt'];

    const data = await this.jwtService.verifyAsync(cookie);
    return this.userService.findOne({ id: data.id });
  }
}
