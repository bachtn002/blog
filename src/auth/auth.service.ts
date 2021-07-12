import { forwardRef, HttpException, HttpStatus, Inject } from '@nestjs/common';
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

    public async createdToken(loginUserDto: LoginUserDto, response: any): Promise<any> {

        const userLogin = await this.userRepo.findOne({ Mobile: loginUserDto.Mobile, IsDelete: false });
        if (userLogin) {
            const passWordHashIsMatch = await bcrypt.compare(loginUserDto.Password, userLogin.PasswordHash);
            if (passWordHashIsMatch) {
                const payload = { Mobile: userLogin.Mobile, UserId: userLogin.UserId, Role: userLogin.Role };
                const refreshToken = this.jwtService.sign(payload, {
                    secret: jwtConstants.secret,
                    expiresIn: '500000s',
                });
                await this.userService.saveRefreshToken(refreshToken, userLogin.UserId);
                return response.json({
                    accessToken: this.jwtService.sign(payload, {
                        secret: jwtConstants.secret,
                        expiresIn: '500s'
                    }),
                    refreshToken: refreshToken
                });
            } else {
                return response.status(400).send({ message: 'Mobile or password incorrect' });
            }
        }
    }

    public async logOut(): Promise<any> {
        
    }
}
