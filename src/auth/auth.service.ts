import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import { EncodeService } from './encode.service';
import { ActivateUserDto } from './dto/activate-user.dto';
import { v4 } from 'uuid';
import { UserEntity } from 'src/user/entities/user.entity';
import { RequestResetPasswordDto } from './dto/request-reset-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');
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
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    const comparedPassword = await this._encodeService.checkPassword(
      password,
      user.password,
    );

    if (user && comparedPassword) {
      const {
        password,
        resetPasswordToken,
        createOne,
        activationToken,
        ...payload
      } = user;
      this.logger.log(`Login successful by user "${user.email}"`);
      return {
        access_token: this._jwtService.sign(payload),
      };
    }
    throw new UnauthorizedException('Usuario o contraseña incorrectos');
  }

  async activateUser(data: ActivateUserDto): Promise<void> {
    await this._userService.activateUser(data);
    this.logger.log(`User activate successful`);
  }
  //? REVISAR ESTE METODO
  async requestResetPassword({ email }: RequestResetPasswordDto): Promise<any> {
    const user = await this._userService.findOne(email);
    if (!user.resetPasswordToken && user.active) {
      const resetPasswordToken = v4();
      await this._userService.updateUser(email, { resetPasswordToken });
      this.logger.log(`Password change request by user ${email} successful`);
      return {
        resetPasswordToken,
        url: `http://localhost:5173/change-password/${resetPasswordToken}`,
      };
    } else {
      throw new HttpException(
        'Su solicitud de recuperación de contraseña ya fue enviada. Revise su correo electrónico',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async resetPassword(data: ResetPasswordDto): Promise<void> {
    const { resetPasswordToken, newPassword } = data;
    const user = await this._userService.findUserByResetPasswordToken(
      resetPasswordToken,
    );
    const password = await this._encodeService.encodePassword(newPassword);
    await this._userService.updateUser(user.email, {
      password,
      resetPasswordToken: null,
    });
    this.logger.log(`Password change successful by user ${user.email} `);
  }

  async changePassword(data: ChangePasswordDto): Promise<void> {
    const { email, newPassword, oldPassword } = data;
    const user = await this._userService.findOne(email);
    const passOk = await this._encodeService.checkPassword(
      oldPassword,
      user.password,
    );
    if (!passOk) throw new UnprocessableEntityException();
    const hashPassword = await this._encodeService.encodePassword(newPassword);
    await this._userService.changePassword(email, hashPassword);
    this.logger.log(`Change password successful by user "${user.email}"`);
  }
}
