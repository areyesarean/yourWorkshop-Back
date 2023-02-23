import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private _userService: UserService,
    private _jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this._userService.findOne(username);

    if (!user) throw new HttpException('USER_NOT_FOUND', 403);

    if (user && user.password === password) {
      const { password, id,name, ...result } = user;
      return result;
    } else {
      throw new HttpException('PASSWORD_INCORRECT', 403);
    }
  }

  async login(user: LoginDto) {
    const payload = await this.validateUser(user.username, user.password);
    const { username } = payload;
    return {
      username,
      access_token: this._jwtService.sign(payload),
    };
  }
}
