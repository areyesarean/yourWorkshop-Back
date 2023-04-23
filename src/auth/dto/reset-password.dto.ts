import {  IsNotEmpty, IsString, IsUUID, MaxLength, MinLength } from "class-validator";

export class ResetPasswordDto{
  @IsNotEmpty()
  @IsUUID('4')
  resetPasswordToken: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(16)
  newPassword: string;
}