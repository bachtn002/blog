import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { getRepository, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
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
    const user = await this.userRepo.findOne({Mobile:createUserDto.Mobile});
    if (user) {
      throw new HttpException({ message: 'Mobile must be unique.' }, HttpStatus.BAD_REQUEST);
    }
    const passwordHash = await bcrypt.hash(createUserDto.Password, 10);
    const savedUser = await this.userRepo.createQueryBuilder()
      .insert()
      .into(User)
      .values([
        { Mobile: createUserDto.Mobile, PasswordHash: passwordHash, DOB: createUserDto.DOB }
      ])
      .execute();
    return savedUser;
  }

  public async findAll(): Promise<User[]> {
    return await getRepository(User).createQueryBuilder('user')
      .where('user.IsDelete=:IsDelete',{ IsDelete:false}).getMany();
  }

  public async findOne(UserId: string) {
    return await this.userRepo.findOne(UserId);
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
        const userUpdateRaw = await this.userRepo.createQueryBuilder()
          .update(User)
          .set({
            Mobile: updateUserDto.Mobile,
            PasswordHash: await bcrypt.hash(updateUserDto.Password,10),
            Role: updateUserDto.Role,
            Gender: updateUserDto.Gender,
            DOB: updateUserDto.DOB,
            RefreshToken: null
          })
          .where('UserId=:id', { id: user.UserId })
          .execute();
        console.log(userUpdateRaw);
        return response.status(401).send({message: 'Unauthorized'});
      }
    }

  }

  public async remove(id: string, response: any) {
    const userRemove = await this.userRepo.findOne(id);
    if (!userRemove) {
      throw new HttpException({ message: 'Not found user' }, HttpStatus.BAD_REQUEST);
    }
    else {
      await this.userRepo.createQueryBuilder()
        .update(User)
        .set({
          IsDelete: true
        })
        .where('UserId=:id', { id: userRemove.UserId })
        .execute();
      return response.send('OK REMOVE');
    }
  }

  public async getUser(Mobile: string): Promise<User> {
    const user = await this.userRepo.findOne({ Mobile: Mobile });
    return user;
  }
  public async saveRefreshToken(refreshToken: string, UserId: string) {
    await this.userRepo.update(UserId, { RefreshToken : refreshToken });
  }
  public async getUserWithRefreshToken(refreshToken: string, UserId: string) {
    const user = await this.findOne(UserId);
    const currentRefreshToken = await bcrypt.compare(refreshToken, user.RefreshToken);
    if (currentRefreshToken) {
      return user;
    }
  }
}
