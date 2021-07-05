import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService,
        private readonly jwtService: JwtService) { }

    // async validateUser(Mobile: string, PasswordHash: string): Promise<any> {
    //     const user = await this.userService.getUser(Mobile);
    //     //const user= users.find(user=>user.Mobile===Mobile);
    //     if (user && user.PasswordHash === PasswordHash) {
    //         const { PasswordHash, ...result } = user;
    //         return result;
    //     }
    //     return null;
    // }
    async login(user: User){
        const payload={Mobile: user.Mobile, UserId: user.UserId, Role: user.Role};
        console.log(payload);
        return {
            access_token: this.jwtService.sign(payload)
        };
    }
}
