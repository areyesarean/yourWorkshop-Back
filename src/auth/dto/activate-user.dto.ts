import { IsNotEmpty, IsUUID } from "class-validator";

export class ActivateUserDto{

  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsUUID()
  @IsNotEmpty()
  code: string;
}