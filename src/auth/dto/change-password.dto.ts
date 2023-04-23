import {IsEmail, IsNotEmpty, IsString, MaxLength, MinLength} from "class-validator";

export class ChangePasswordDto{

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  newPassword: string;
}