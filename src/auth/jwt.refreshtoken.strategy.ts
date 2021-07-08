import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "src/user/user.service";
import { Request } from 'express';
import { jwtConstants } from "./constants";



@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
    constructor(private readonly userService: UserService){
        super({
            jwtFromRequest:ExtractJwt.fromExtractors([(request:Request)=>{
                return request?.cookies?.RefreshToken
            }]),
            secretOrKey:jwtConstants.secret,
            passReqToCallback: true,
        });
    }
    public async validate(request: Request, payload: any){
        const refreshToken = request.cookies?.RefreshToken;
        return this. userService.getUserWithRefreshToken(refreshToken,payload.UserId);
    }
}