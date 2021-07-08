import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "src/user/entities/user.entity";
import { jwtConstants } from "./constants";
import { Request } from 'express';

@Injectable() 
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(){
        super({ 
            jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
                return request?.cookies?.AccessToken;
              }]),
            secretOrKey:jwtConstants.secret
        });
    }

    async validate(payload:User){
        console.log(payload);
        return {UserId: payload.UserId, Mobile: payload.Mobile, Role: payload.Role};
    }
    
}