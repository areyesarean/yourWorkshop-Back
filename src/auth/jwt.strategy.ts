import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { JWTPayload } from './jwt.payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private _configService: ConfigService,
    private _userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: _configService.get<string>('SECRET_KEY'),
    });
  }

  async validate(payload: JWTPayload) {
    const { email } = payload;
    try {
      const user = await this._userService.findOneUserByEmailAndActive(email);
      return user && payload;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
