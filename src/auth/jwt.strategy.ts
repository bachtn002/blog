import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "src/user/entities/user.entity";
import { jwtConstants } from "./constants";

@Injectable() 
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(){
        super({ 
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpirations:false,
            secretOrKey:jwtConstants.secret
        });
    }

    async validate(payload:User){
        return {UserId: payload.UserId, Mobile: payload.Mobile, Role: payload.Role};
    }
    
}