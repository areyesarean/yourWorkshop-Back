import { Body, Controller, Post, Query, Get, Patch, Redirect } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ActivateUserDto } from './dto/activate-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RequestResetPasswordDto } from './dto/request-reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Redirect('http://localhost:5173/login?cause=activate-account')
  @Get('/activate-account')
  async activateAccount(@Query() query: ActivateUserDto) {
    return this.authService.activateUser(query);
  }

  @Patch('/request-reset-password')
  async requestResetPassword(@Body() body: RequestResetPasswordDto) {
    return this.authService.requestResetPassword(body);
  }

  @Patch('/reset-password')
  async resetPassword(@Body() body: ResetPasswordDto) {    
    return this.authService.resetPassword(body);
  }

  @Patch('/change-password')
  async changePassword(@Body() body: ChangePasswordDto) {
    return this.authService.changePassword(body)
  }


}
