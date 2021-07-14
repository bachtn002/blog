import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "src/user/user.service";
import { Request } from 'express';




@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
    constructor(private readonly userService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(request: Request)=>{
                let data = request?.cookies['token'];
                if(!data){
                    return null;
                }
                return data.RefreshToken;
            }]),
            ignoreExpirations: true,
            secretOrKey: process.env.SECRET_KEY_TOKEN,
            passReqToCallback: true,
        });
    }
    public async validate(request: Request, payload: any) {
        if (payload === null) {
            throw new UnauthorizedException();
        }
        const data = request?.cookies['token'];
        if(!data.RefreshToken) {
            throw new BadRequestException('invalid refresh token');
        }
        const user = await this.userService.getUserWithRefreshToken(data.RefreshToken, payload.UserId);
        if(!user){
            throw new BadRequestException('token expried');
        }
        return user;
    }
}