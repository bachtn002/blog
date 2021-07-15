import { forwardRef, Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserDto } from 'src/user/dto/user.dto';

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

    public async createdToken(dto: UserDto, response: any): Promise<any> {

        const userLogin = await this.userRepo.findOne({ Mobile: dto.mobile, IsDelete: false });
        if (userLogin) {
            const passWordHashIsMatch = await bcrypt.compare(dto.password, userLogin.PasswordHash);
            if (passWordHashIsMatch) {
                const payload = { Mobile: userLogin.Mobile, UserId: userLogin.UserId, Role: userLogin.Role };
                const data = {
                    AccessToken: this.jwtService.sign(payload, {
                        secret: process.env.SECRET_KEY_TOKEN,
                        expiresIn: '30000s',
                    })
                };
                return response.cookie('token', data, { httpOnly: true }).send('ok');
            } else {
                return response.status(400).send({ message: 'Mobile or password incorrect' });
            }
        } else {
            return response.status(400).send({ message: 'Mobile or password incorrect' });
        }
    }

    public async createdNewToken(request: any, response: any): Promise<any> {

        const payload = { Mobile: request.user.Mobile, UserId: request.user.UserId, Role: request.user.Role }
        return response.json({
            accessToken: this.jwtService.sign(payload, {
                secret: process.env.SECRET_KEY_TOKEN,
                expiresIn: '100s'
            })
        });
    }

    public async logOut(): Promise<any> {

    }
}
