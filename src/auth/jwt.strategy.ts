import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private _configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: _configService.get<string>('SECRET_KEY'),
    });
  }

  async validate(payload: any) {
    console.log(
      '🚀 ~ file: jwt.strategy.ts:17 ~ JwtStrategy ~ validate ~ payload',
      payload,
    );

    return {
      userId: payload.userId,
      username: payload.username,
      hello: 'hello',
    };
  }
}
