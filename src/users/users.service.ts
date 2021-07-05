import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>
    ) { }
    // async getUser(): Promise<User[]> {
    //     const user = await this.userRepo.find();
    //     console.log(user);
    //     return user;
    // }
    async getUser(Mobile: string): Promise<User>{
        const user = await this.userRepo.findOne({Mobile: Mobile});
        console.log(Mobile);
        console.log(user);
        return user;
    }
}
