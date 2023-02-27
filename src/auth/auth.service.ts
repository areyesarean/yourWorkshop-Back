import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import { EncodeService } from './encode.service';
import { ActivateUserDto } from './dto/activate-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private _userService: UserService,
    private _jwtService: JwtService,
    private _encodeService: EncodeService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this._userService.findOne(email);

    const comparedPassword = await this._encodeService.checkPassword(
      password,
      user.password,
    );

    if (user && comparedPassword) {
      const { password, id, name, ...payload } = user;

      return {
        access_token: this._jwtService.sign(payload),
      };
    }
    throw new UnauthorizedException();
  }

  async activateUser(data: ActivateUserDto): Promise<void> {
    return await this._userService.activateUser(data);
  }
}
