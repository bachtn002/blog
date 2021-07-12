import { forwardRef, Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { jwtConstants } from './constants';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        @InjectRepository(User) private readonly userRepo: Repository<User>
    ) { }

    async validateUser(Mobile: string, PasswordHash: string): Promise<any> {
        const user = await this.userService.getUser(Mobile);
        if (user && user.PasswordHash === PasswordHash) {
            const { PasswordHash, ...result } = user;
            return result;
        }
        return null;
    }
    public async checkLogin(loginUserDto: LoginUserDto): Promise<any> {
        const user = await this.userRepo.createQueryBuilder('user')
            .where('user.Mobile=:Mobile', { Mobile: loginUserDto.Mobile })
            .andWhere('user.IsDelete=0')
            .getOne();
        console.log(user);
        console.log('dshdjshdjshjdhs');
        if (user) {
            const passWordHashIsMatch = await bcrypt.compare(loginUserDto.Password, user.PasswordHash)
            if (passWordHashIsMatch) {
                const { PasswordHash, ...result } = user;
                return result;
            }
        }
        return null;
    }
    public async login(loginUserDto: LoginUserDto) {
        const user = await this.userRepo.createQueryBuilder('user')
            .where('user.Mobile=:Mobile', { Mobile: loginUserDto.Mobile })
            .andWhere('user.IsDelete=0')
            .getOne();
        const payload = { Mobile: user.Mobile, UserId: user.UserId, Role: user.Role };
        const token = this.jwtService.sign(payload, {
            secret: jwtConstants.secret,
            expiresIn: '30s'
        });
        return `AccessToken=${token};HttpOnly;Path=/;Max-Age=${30}`;
    }
    public async getCookieWithRefreshToken(loginUserDto: LoginUserDto) {
        const user = await this.userRepo.createQueryBuilder('user')
            .where('user.Mobile=:Mobile', { Mobile: loginUserDto.Mobile })
            .andWhere('user.IsDelete=0')
            .getOne();
        const payload = { Mobile: user.Mobile, UserId: user.UserId, Role: user.Role };
        const refreshToken = this.jwtService.sign(payload, {
            secret: jwtConstants.secret,
            expiresIn: '50000s'
        });
        return `RefreshToken=${refreshToken};HttpOnly;Path=/;Max-Age=${50000}`;
    }
    public async getRefreshToken(loginUserDto: LoginUserDto) {
        const user = await this.userRepo.createQueryBuilder('user')
            .where('user.Mobile=:Mobile', { Mobile: loginUserDto.Mobile })
            .andWhere('user.IsDelete=0')
            .getOne();
        const payload = { Mobile: user.Mobile, UserId: user.UserId, Role: user.Role };
        const refreshToken = this.jwtService.sign(payload, {
            secret: jwtConstants.secret,
            expiresIn: '30000s'
        });
        return refreshToken;
    }
    public logOutTokenFromCookie() {
        return ['AccessToken=; HttpOnly; Path=/; Max-Age=0', 'RefreshToken=;HttpOnly; Path=/; Max-Age=0'];
    }
}
