import { Body, Controller, Post, Query, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ActivateUserDto } from './dto/activate-user.dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Get('/activate-account')
  async activateAccount(@Query() query: ActivateUserDto) {
    return this.authService.activateUser(query);
  }
}
