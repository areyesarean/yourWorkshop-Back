import { Roles } from 'src/user/dto/user.dto';

export interface JWTPayload {
  email: string;
  rol: Roles;
  active: boolean;
  createOne: Date;
}
