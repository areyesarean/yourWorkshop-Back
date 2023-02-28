import {  IsNotEmpty, IsString, IsUUID, MaxLength, MinLength } from "class-validator";

export class ChangePasswordDto{
  @IsNotEmpty()
  @IsUUID('4')
  code: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(16)
  newPassword: string;
}