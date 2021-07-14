import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UsePipes, ValidationPipe, Request, Response, Inject, Query, HttpStatus, HttpException, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from './entities/role.decorator';
import { AuthGuard } from '@nestjs/passport';
import { Role } from './entities/role.enum';
import { UserDto } from './dto/user.dto';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService
    ) { }

  @Post('sign-up')
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() dto: UserDto) {
    return this.userService.create(dto);
  }
  @Get('index')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard('jwt'))
  findAll(@Body() dto: UserDto) {
    return this.userService.findAll(dto);
  }

  @Get('index/:id')
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
  }

  @Delete('delete/:id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard('jwt'))
  public async remove(@Param('id') id: string, @Response() response) {
    return await this.userService.remove(id, response);
  }
}
