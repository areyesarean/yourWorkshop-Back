import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Get()
  getAllUsers(@Request() req) {
    console.log(
      '🚀 ~ file: user.controller.ts:11 ~ UserController ~ getAllUsers ~ req',
      req.user,
    );

    return this._userService.getAllUsers();
  }
}
