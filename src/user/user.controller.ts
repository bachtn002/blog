import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UsePipes, ValidationPipe, Response } from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from './entities/role.decorator';
import { AuthGuard } from '@nestjs/passport';
import { Role } from './entities/role.enum';
import { UserDto } from './dto/user.dto';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService
  ) { }

  @Post('sign-up')
  @UsePipes(new ValidationPipe({ transform: true, skipMissingProperties: true }))
  create(@Body() dto: UserDto) {
    return this.userService.create(dto);
  }
  @Post('index')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  findAll(@Body() dto: UserDto) {
    return this.userService.findAll(dto);
  }

  @Post('filter')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  filterByMobile(@Body() dto: UserDto) {
    return this.userService.filterByMobile(dto);
  }

  @Get('index/:id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch('update/:id')
  @Roles(Role.ADMIN)
  @UsePipes(new ValidationPipe({ transform: true, skipMissingProperties: true }))
  @UseGuards(AuthGuard('jwt'))
  public async update(@Param('id') id: string, @Body() dto: UserDto,
    @Response() response) {
    await this.userService.update(id, dto, response);
  }

  @Patch('delete/:id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard('jwt'))
  public async remove(@Param('id') id: string, @Response() response) {
    return await this.userService.remove(id, response);
  }
}
