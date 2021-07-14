import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserDto } from './dto/user.dto';
import { PaginatedResultDto } from './dto/panigated.result.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) { }
  public async create(dto: UserDto) {
    const user = await this.userRepo.findOne({ Mobile: dto.Mobile, IsDelete: false });
    if (user) {
      throw new HttpException({ message: 'Mobile must be unique' }, HttpStatus.BAD_REQUEST);
    }
    const passwordHash = await bcrypt.hash(dto.Password, 10);
    const userSaved = new User();
    userSaved.Mobile = dto.Mobile;
    userSaved.PasswordHash = passwordHash;
    await this.userRepo.save(userSaved);
    return userSaved;
  }

  public async findAll(dto: UserDto): Promise<PaginatedResultDto> {
    if(dto.PageNumber <= 0 || dto.PageSize <=0 ){
      throw new HttpException({ message: 'Page number or page size illegal'}, HttpStatus.BAD_REQUEST);
    }
    const users = await this.userRepo.find({
      where: [
        {
          IsDelete: false,
        }
      ],
      take: dto.PageSize,
      skip: dto.PageSize * (dto.PageNumber - 1),
    });
    return {
      pageNumber: dto.PageNumber,
      pageSize: dto.PageSize,
      totalRecords: users.length,
      data: users,
    }
  }

  public async filterByMobile(dto: UserDto): Promise<User[]> {
    return this.userRepo.find({
      where: [
        {
          IsDelete: false,
          Mobile: Like(`%${dto.Mobile}%`),
        }
      ],
      order: { Mobile: 'ASC' },
      take: dto.PageSize,
      skip: dto.PageSize * (dto.PageNumber - 1),
    })
  }

  public async findOne(UserId: string) {
    return await this.userRepo.findOne({ UserId: UserId, IsDelete: false });
  }

  public async update(id: string, updateUserDto: UpdateUserDto, response: any) {
    await this.userRepo.update(id, { Gender: updateUserDto.Gender, DOB: updateUserDto.DOB });
    return response.status(200).send({ message: 'Ok' });
  }

  public async remove(id: string, response: any) {
    const userRemove = await this.userRepo.findOne(id);
    if (!userRemove) {
      throw new HttpException({ message: 'Not found user' }, HttpStatus.BAD_REQUEST);
    }
    else {
      userRemove.IsDelete = true;
      await this.userRepo.save(userRemove);
      return response.status(200).send({ message: 'Ok Remove' });
    }
  }

  public async getUser(Mobile: string): Promise<User> {
    const user = await this.userRepo.findOne({ Mobile: Mobile });
    return user;
  }
  public async saveRefreshToken(refreshToken: string, UserId: string) {
    await this.userRepo.update(UserId, { RefreshToken: refreshToken });
  }
  public async getUserWithRefreshToken(refreshToken: string, UserId: string) {
    const user = await this.findOne(UserId);
    if (refreshToken === user.RefreshToken) {
      return user;
    }
  }
}
