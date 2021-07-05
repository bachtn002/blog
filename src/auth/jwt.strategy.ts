import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "src/users/user.entity";
import { jwtConstants } from "./constants";

@Injectable() 
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(){
        super({ 
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey:jwtConstants.secret
        });
    }

    async validate(payload:User){
        console.log(payload);
        return {UserId: payload.UserId, Mobile: payload.Mobile, Role: payload.Role};
    }
    
}