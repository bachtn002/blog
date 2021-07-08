import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { getRepository, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) { }
  async create(createUserDto: CreateUserDto) {
    const { Mobile, Password } = createUserDto;
    // Check Mobile exists
    const result = await getRepository(User).createQueryBuilder('user')
      .where('user.Mobile = :Mobile', { Mobile })
    const user = await result.getOne();
    if (user) {
      const error = { Mobile: 'Mobile must be unique.' };
      throw new HttpException({ message: 'Input data validation failed', error }, HttpStatus.BAD_REQUEST);
    }

    // create new user
    const newUser = new User();
    newUser.Mobile = Mobile;
    newUser.PasswordHash = Password;
    const errors = await validate(newUser);
    console.log(111);
    if (errors.length > 0) {
      console.log(333)
      const errorNew = { Mobile: 'Invalid mobile' };
      throw new HttpException({ message: 'Input data validation failed', errorNew }, HttpStatus.BAD_REQUEST);
    }
    else {
      const savedUser = this.userRepo.save(newUser);
      return savedUser;
    }
  }

  async findAll(): Promise<User[]> {
    const result = await getRepository(User).createQueryBuilder();
    const users = await result.getMany();
    console.log(users);
    return users
  }

  findOne(id: number) {
    const result = this.userRepo.findOne(id);
    return result;
  }

  public async update(id: number, updateUserDto: UpdateUserDto):Promise<User> {
    const userUpdate= await this.userRepo.findOne(id);
    const userMobile = await this.userRepo.findOne({Mobile:updateUserDto.Mobile});
    if( userMobile && userUpdate.UserId!== userMobile.UserId) {
      return null;
    }
    delete userUpdate.PasswordHash;
    delete userUpdate.Mobile;
    delete userUpdate.Role;
    const updated= Object.assign(userUpdate,updateUserDto);
    return await this.userRepo.save(updated);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async getUser(Mobile: string): Promise<User> {
    const user = await this.userRepo.findOne({ Mobile: Mobile });
    return user;
  }
  public async saveRefreshToken(refreshToken: string, UserId: number) {
    const currentRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepo.update(UserId, { currentRefreshToken });
  }
  public async getUserWithRefreshToken(refreshToken: string, UserId: number){
    const user = await this.findOne(UserId);
    const currentRefreshToken = await bcrypt.compare(refreshToken,user.currentRefreshToken);
    if(currentRefreshToken){
      return user;
    }
  }
}
