import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/user.dto';
import { Permisions } from 'src/auth/decorators/permissions.decorator';

@Controller('user')
@Permisions('ADMIN')
export class UserController {
  constructor(private readonly _userService: UserService) {}
  
  @Get()
  getAllUsers() {
    return this._userService.getAllUsers();
  }
  
  @Get(':username')
  getOneUsers(@Param('username') username: string) {
    return this._userService.findOne(username);
  }

  @Post()
  createUser(@Body() user: CreateUserDto) {
    return this._userService.createUser(user);
  }
}
