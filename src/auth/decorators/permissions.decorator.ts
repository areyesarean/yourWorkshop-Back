import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from 'src/user/dto/user.dto';

export function Permisions(...roles: string[]) {

  if(roles.length === 0)
    throw new Error("Debe especificar almenos un rol en el decorador Permisions")


  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(JwtAuthGuard, RolesGuard),
  );
}
