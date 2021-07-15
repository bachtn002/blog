import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
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
    const user = await this.userRepo.findOne({ Mobile: dto.mobile, IsDelete: false });
    if (user) {
      throw new HttpException({ message: 'Mobile must be unique' }, HttpStatus.BAD_REQUEST);
    }
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const userSaved = new User();
    userSaved.Mobile = dto.mobile;
    userSaved.PasswordHash = passwordHash;
    await this.userRepo.save(userSaved);
    return userSaved;
  }

  public async findAll(dto: UserDto): Promise<PaginatedResultDto> {
    const users = await this.userRepo.find({
      where: [
        {
          IsDelete: false,
        }
      ],
      take: dto.limit,
      skip: dto.limit * (dto.page - 1),
    });
    return {
      page: dto.page,
      limit: dto.limit,
      totalRecord: users.length,
      data: users,
    }
  }

  public async filterByMobile(dto: UserDto): Promise<PaginatedResultDto> {
    const users = await this.userRepo.find({
      where: [
        {
          IsDelete: false,
          Mobile: Like(`%${dto.filter}%`),
        }
      ],
      order: { Mobile: 'ASC' },
      take: dto.limit,
      skip: dto.limit * (dto.page - 1),
    });
    return {
      page: dto.page,
      limit: dto.limit,
      totalRecord: users.length,
      data: users,
    }
  }

  public async findOne(UserId: string) {
    return await this.userRepo.findOne({ UserId: UserId, IsDelete: false });
  }

  public async update(id: string, dto: UserDto, response: any) {
    await this.userRepo.update(id, { Gender: dto.gender, DOB: dto.dob });
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
