import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  roles: string[];

  canActivate(context: ExecutionContext): boolean {
    this.roles = this.reflector.get<string[]>('roles', context.getHandler());
    
    if(!this.roles){
      this.roles = this.reflector.get<string[]>('roles', context.getClass());
    }
    
    //ESTE METODO RETORNA TRUE SI CUMPLE CON LOS ROLES
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    //El user viene del metodo validate de la estrategia que inyecta el payload del token en el request object

    const search = this.roles.find((rol) => rol === user.rol);
    return user.rol === search ? true : false;
  }
}
