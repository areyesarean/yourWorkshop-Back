import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/user.dto';
import { Permisions } from 'src/auth/decorators/permissions.decorator';
import { UpdateUserDto } from './dto/updateUser.dto';

@Controller('user')
@Permisions('ADMIN')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Get()
  getAllUsers() {
    return this._userService.getAllUsers();
  }

  @Get(':email')
  getOneUsers(@Param('email') email: string) {
    return this._userService.findOne(email);
  }

  @Post()
  createUser(@Body() user: CreateUserDto) {
    return this._userService.createUser(user);
  }

  @Patch(':email')
  updateUser(@Param('email') email: string, @Body() updateUser: UpdateUserDto) {
    return this._userService.updateUser(email, updateUser);
  }

  @Delete(':id')
  removeUser(@Param() id: string) {
    return this._userService.removeUser(id);
  }
}
