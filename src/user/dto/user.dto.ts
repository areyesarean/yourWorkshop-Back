import {IsString, IsEnum, MinLength, MaxLength} from 'class-validator'

export enum Roles{
  'ADMIN' = "ADMIN",
  'USER' = "USER"
}

export class CreateUserDto{

  @IsString()
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(16)
  password: string;

  @IsString()
  name: string;

  @IsEnum(Roles)
  rol: Roles;
}

