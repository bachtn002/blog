import { forwardRef, Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService) { }

    async validateUser(Mobile: string, PasswordHash: string): Promise<any> {
        const user = await this.userService.getUser(Mobile);
        if (user && user.PasswordHash === PasswordHash) {
            const { PasswordHash, ...result } = user;
            console.log(result);
            return result;
        }
        return null;
    }
    public async login(user: User) {
        const payload = { Mobile: user.Mobile, UserId: user.UserId, Role: user.Role };
        const token = this.jwtService.sign(payload, {
            secret: jwtConstants.secret,
            expiresIn: '30s'
        });
        return `AccessToken=${token};HttpOnly;Path=/;Max-Age=${30}`;
    }
    public async getCookieWithRefreshToken(user: User) {
        const payload = { Mobile: user.Mobile, UserId: user.UserId, Role: user.Role };
        const refreshToken = this.jwtService.sign(payload, {
            secret: jwtConstants.secret,
            expiresIn: '50000s'
        });
        return `RefreshToken=${refreshToken};HttpOnly;Path=/;Max-Age=${50000}`;
    }
    public async getRefreshToken(user: User) {
        const payload = { Mobile: user.Mobile, UserId: user.UserId, Role: user.Role };
        const refreshToken = this.jwtService.sign(payload, {
            secret: jwtConstants.secret,
            expiresIn: '30000s'
        });
        return refreshToken;
    }
    public logOutTokenFromCookie() {
        return ['AccessToken=; HttpOnly; Path=/; Max-Age=0','RefreshToken=;HttpOnly; Path=/; Max-Age=0'];
    }
}
