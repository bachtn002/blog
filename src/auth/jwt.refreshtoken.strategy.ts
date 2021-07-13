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
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpirations: false,
            secretOrKey:jwtConstants.secret,
        });
    }
    public async validate(payload: any){
        return {UserId: payload.UserId, Mobile: payload.Mobile, Role: payload.Role};
    }
}