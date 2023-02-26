import { IsString, MinLength, MaxLength, IsEmail } from 'class-validator';

export class LoginDto {

  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(16)
  password: string;
}
