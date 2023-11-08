import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  @Matches(/^[a-zA-Z0-9#$%_-]+$/, {
    message: '限定用户名字符',
  })
  username: string;
  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message: '密码至少同时包含一个字母和一个数字且至少8位',
  })
  password: string;
}
