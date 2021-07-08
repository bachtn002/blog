import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UsePipes, ValidationPipe, Request, Response, Inject, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from './entities/role.decorator';
import { AuthGuard } from '@nestjs/passport';
import { Role } from './entities/role.enum';
import { AuthService } from 'src/auth/auth.service';
import { forwardRef } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { jwtConstants } from 'src/auth/constants';
import { JwtService } from '@nestjs/jwt';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService
    , private readonly authService: AuthService,
    private readonly jwtService: JwtService) { }

  @Post('sign-up')
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
  @Get('show')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard('jwt'))
  findAll() {
    return this.userService.findAll();
  }

  @Get('show/:id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch('update/:id')
  @Roles(Role.ADMIN)
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard('jwt'))
  public async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto,
    @Response() response, @Request() request) {
    const userUpdate = await this.userService.update(+id, updateUserDto);
    if (userUpdate !== null) {

      //Logout token old
      response.setHeader('Set-Cookie', this.authService.logOutTokenFromCookie());
      //Created refresh token
      const refreshTokenCookie = await this.authService.getCookieWithRefreshToken(request.user);
      request.res.setHeader('Set-Cookie', [ refreshTokenCookie]);
      const payload={ Mobile: updateUserDto.Mobile, UserId: id, Role: updateUserDto.Role };
      const refreshToken = this.jwtService.sign(payload,{
        secret: jwtConstants.secret,
        expiresIn: '3000s'
      });
      console.log(payload);
      const cookieRefreshToken = `RefreshToken=${refreshToken};HttpOnly;Path=/;Max-Age=${3000}`;
      response.setHeader('Set-Cookie',cookieRefreshToken);
      response.send('Updated !!!');
    } else {
      response.send('Failed!!!');
    }
  }

  @Delete('delete/:id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
