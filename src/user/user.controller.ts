import {
  Controller,
  Post,
  Body,
  Inject,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Inject()
  private jwtService: JwtService;
  // login 是根据 username 和 password 取匹配是否有这个 user
  @Post('login')
  async login(
    @Body(ValidationPipe) user: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const foundUser = await this.userService.login(user);
    if (foundUser) {
      const token = await this.jwtService.signAsync({
        user: {
          id: foundUser.id,
          username: foundUser.username,
        },
      });
      //添加给头
      res.setHeader('token', token);
      return '登陆成功';
    } else {
      return '登陆失败';
    }
  }
  // register 是把用户信息存到数据库里
  @Post('register')
  async register(@Body(ValidationPipe) user: RegisterDto) {
    await this.userService.register(user);
  }
}
