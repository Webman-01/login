import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class LoginGuard implements CanActivate {
  //注入jwtService
  @Inject(JwtService)
  private jwtService: JwtService;
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    //从 context 对象中切换到 HTTP 上下文，并最终获取到 HTTP 请求对象。通过调用 getRequest() 方法，我们可以获得当前请求的 Request 对象，以便在处理请求的代码中对其进行操作
    const authorization = request.header('authorization') || ''; //获取请求头中的authorization
    const bearer = authorization.split(' '); //根据空格拆分成数组
    if (!bearer || bearer.length < 2) {
      throw new UnauthorizedException('登陆的token错误');
    }
    const token = bearer[1];
    //bearer[0]：表示 Bearer 方案的标识，即 "Bearer"。
    //bearer[1]：表示真正的身份验证令牌，即 <token>.
    try {
      const info = this.jwtService.verify(token); //返回解码后的令牌对象
      (request as any).user = info.user; //将身份验证成功的用户信息添加到请求对象中，这样可以在controller中用
      return true;
    } catch (error) {
      throw new UnauthorizedException('登录 token 失效，请重新登录');
    }
  }
}
