import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Controller()
export class AuthController {
  constructor(private userService: UserService) {}

  @Post('register')
  async register(@Body() body) {
    const hashedPassword = await bcrypt.hash(body.password, 12);
    const newUser = { ...body, password: hashedPassword };
    return this.userService.create(newUser);
  }
}
