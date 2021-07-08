import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { getRepository, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { response } from 'express';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService
  ) { }
  public async create(createUserDto: CreateUserDto) {
    const { Mobile, Password, DOB } = createUserDto;
    console.log(createUserDto);
    // Check Mobile exists
    const result = await this.userRepo.createQueryBuilder('user')
      .where('user.Mobile = :Mobile', { Mobile })
      .andWhere('user.IsDelete=0')
      .getOne();
    console.log(2);
    console.log(result);
    console.log(3);
    if (result) {
      const error = { Mobile: 'Mobile must be unique.' };
      throw new HttpException({ message: 'Input data validation failed', error }, HttpStatus.BAD_REQUEST);
    }
    const savedUser = await this.userRepo.createQueryBuilder()
      .insert()
      .into(User)
      .values([
        { Mobile: createUserDto.Mobile, PasswordHash: createUserDto.Password, DOB: createUserDto.DOB }
      ])
      .execute();
    return savedUser;
  }

  public async findAll(): Promise<User[]> {
    return await getRepository(User).createQueryBuilder().getMany();
  }

  public async findOne(UserId: string) {
    const result = await this.userRepo.findOne(UserId);
    return result;
  }

  public async update(id: string, updateUserDto: UpdateUserDto, response: any) {

    const user = await this.userRepo.findOne(id);
    if (user.Mobile === updateUserDto.Mobile) {
      throw new HttpException({ message: 'This mobile must be different from the old mobile' }, HttpStatus.BAD_REQUEST);
    } else {
      const userFromMobile = await this.userRepo.findOne({ Mobile: updateUserDto.Mobile });
      if (userFromMobile) {
        throw new HttpException({ message: 'This mobile already exists' }, HttpStatus.BAD_REQUEST);
      } else {
        // return await this.userRepo.update(UserId, {
        //   Mobile: updateUserDto.Mobile,
        //   PasswordHash: updateUserDto.Password,
        //   Role: updateUserDto.Role,
        //   Gender: updateUserDto.Gender,
        //   DOB: updateUserDto.DOB
        // });
        delete user.Mobile;
        delete user.PasswordHash;
        delete user.Role;
        delete user.Gender;
        delete user.DOB;
        user.RefreshToken=null;
        const updated = Object.assign(user, updateUserDto);
        response.setHeader('Set-Cookie', this.authService.logOutTokenFromCookie());
        const userUpdated = await this.userRepo.save(updated);
        console.log(userUpdated);
        return userUpdated;
      }
    }

  }

  public async removeRefreshToken(id: string) {
    return await this.userRepo.update(id, {
      RefreshToken: null
    });
  }

  remove(UserId: string) {
    return `This action removes a #${UserId} user`;
  }

  async getUser(Mobile: string): Promise<User> {

    const user = await this.userRepo.findOne({ Mobile: Mobile });
    return user;
  }
  public async saveRefreshToken(refreshToken: string, UserId: string) {
    const RefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepo.update(UserId, { RefreshToken });
  }
  public async getUserWithRefreshToken(refreshToken: string, UserId: string) {
    const user = await this.findOne(UserId);
    const currentRefreshToken = await bcrypt.compare(refreshToken, user.RefreshToken);
    if (currentRefreshToken) {
      return user;
    }
  }
}
