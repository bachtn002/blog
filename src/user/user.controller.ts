import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UsePipes, ValidationPipe, Response} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from './entities/role.decorator';
import { AuthGuard } from '@nestjs/passport';
import { Role } from './entities/role.enum';
import { UserDto } from './dto/user.dto';
import { Query } from '@nestjs/common';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService
    ) { }

  @Post('sign-up')
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() dto: UserDto) {
    return this.userService.create(dto);
  }
  @Post('index')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard('jwt'))
  findAll(@Body() dto: UserDto) {
    return this.userService.findAll(dto);
  }

  @Post('filter')
  @UseGuards(AuthGuard('jwt'))
  filterByMobile(@Body() dto: UserDto){
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
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard('jwt'))
  public async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto,
    @Response() response) {
      await this.userService.update(id, updateUserDto, response);
  }

  @Patch('delete/:id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard('jwt'))
  public async remove(@Param('id') id: string, @Response() response) {
    return await this.userService.remove(id, response);
  }
}
