import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UsePipes, ValidationPipe, Request, Response, Inject, Query, HttpStatus, HttpException, UnauthorizedException } from '@nestjs/common';
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
  constructor(private readonly userService: UserService,

    ) { }

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
    return this.userService.findOne(id);
  }

  @Patch('update/:id')
  @Roles(Role.ADMIN)
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard('jwt'))
  public async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto,
    @Response() response) {
      await this.userService.update(id, updateUserDto, response);
      throw new UnauthorizedException();
  }

  @Delete('delete/:id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard('jwt'))
  public async remove(@Param('id') id: string, @Response() response) {
    return await this.userService.remove(id, response);
  }
}
