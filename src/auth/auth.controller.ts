import { Body, Controller, Post, Query, Get, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ActivateUserDto } from './dto/activate-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RequestResetPasswordDto } from './dto/request-reset-password.dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  //@Redirect('http://localhost:4000/login?code=account-active')
  @Get('/activate-account')
  async activateAccount(@Query() query: ActivateUserDto) {
    return this.authService.activateUser(query);
  }

  @Patch('/request-reset-password')
  async requestResetPassword(@Body() body: RequestResetPasswordDto) {
    return this.authService.requestResetPassword(body);
  }

  @Patch('/reset-password')
  async changePassword(@Body() body: ChangePasswordDto) {    
    return this.authService.resetPassword(body);
  }


}
