import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { getRepository, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

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
    const error = await validate(newUser);
    if (error.length > 0) {
      const errorNew = { Mobile: 'Invalid mobile' };
      throw new HttpException({ message: 'Input data validation failed', errorNew }, HttpStatus.BAD_REQUEST);
    }
    else {
      const savedUser = this.userRepo.save(newUser);
    }
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
