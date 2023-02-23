import { IsString, MinLength, MaxLength } from 'class-validator';

export class LoginDto {
  @IsString()
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(16)
  password: string;
}
