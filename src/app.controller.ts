import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { RolesGuard } from './auth/roles.guard';
import { Roles } from './users/role.decorator';
import { Role } from './users/role.enum';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
    private readonly authService: AuthService) { }

  @Roles(Role.ADMIN,Role.USER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(AuthGuard('local'))
  @Post('api/login')
  async login(@Request() request) {
    return this.authService.login(request.user)
  }
  @Post('api/register')
  async register(@Request() request) {

  }
}
