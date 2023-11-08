import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import * as crypto from 'crypto';
import { LoginDto } from './dto/login.dto';

//通过crypro加密密码
function md5(str) {
  //创建hash
  const hash = crypto.createHash('md5');
  hash.update(str);
  return hash.digest('hex');
}
@Injectable()
export class UserService {
  @InjectRepository(User)
  private userRepository: Repository<User>;
  private logger = new Logger();
  //注册
  async register(user: RegisterDto) {
    //获取用户名
    const foundUser = await this.userRepository.findOneBy({
      username: user.username,
    });
    //判断是否存在：存在抛出问题，不存在创建新用户
    if (foundUser) {
      throw new HttpException('用户已存在', 200);
    }
    const newUser = new User();
    newUser.username = user.username;
    newUser.password = md5(user.password);
    try {
      //save创建新用户
      await this.userRepository.save(newUser);
      return '注册成功';
    } catch (error) {
      //打印失败日志
      this.logger.error(error, UserService);
      return '注册失败';
    }
  }
  //登陆
  async login(user: LoginDto) {
    const foundUser = await this.userRepository.findOneBy({
      username: user.username,
    });
    //检查是否有该user
    if (!foundUser) {
      throw new HttpException('用户不存在', 200);
    }
    //检查密码是否正确
    if (foundUser.password != md5(user.password)) {
      throw new HttpException('密码错误', 200);
    }
    return foundUser;
  }
}
