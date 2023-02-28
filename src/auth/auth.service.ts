import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import { EncodeService } from './encode.service';
import { ActivateUserDto } from './dto/activate-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RequestResetPasswordDto } from './dto/request-reset-password.dto';
import { v4 } from 'uuid';
import { UserEntity } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private _userService: UserService,
    private _jwtService: JwtService,
    private _encodeService: EncodeService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    let user: UserEntity;
    try {
      user = await this._userService.findOneUserByEmailAndActive(email);
    } catch (error) {
      throw new UnauthorizedException()
    }

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
    await this._userService.activateUser(data);
  }

  async requestResetPassword({
    email,
  }: RequestResetPasswordDto): Promise<void> {
    await this._userService.findOne(email);
    const resetPasswordToken = v4();
    await this._userService.updateUser(email, { resetPasswordToken });
  }

  async resetPassword(data: ChangePasswordDto): Promise<void> {
    const { code, newPassword } = data;
    const user = await this._userService.findUserByResetPasswordToken(code);
    const password = await this._encodeService.encodePassword(newPassword);
    await this._userService.updateUser(user.email, {
      password,
      resetPasswordToken: null,
    });
  }
}
