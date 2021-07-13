import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "src/user/entities/user.entity";
import { jwtConstants } from "./constants";
import { Request } from 'express';
import { UserService } from "src/user/user.service";

@Injectable() 
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor( private readonly userService: UserService){
        super({ 
            jwtFromRequest: ExtractJwt.fromExtractors([(request: Request)=>{
                let data = request?.cookies['token'];
                if(!data){
                    return null;
                }
                return data.AccessToken;
            }]),
            ignoreExpirations:true,
            secretOrKey:jwtConstants.secret,
            passReqToCallback: true,
        });
    }

    async validate(request:Request, payload:User){
        if(payload === null){
            throw new UnauthorizedException();
        }
        const data = request?.cookies['token'];
        if(!data.AccessToken){
            throw new BadRequestException('invalid access token');
        }
        // const user = await this.userService.getUser(data.AccessToken);
        // console.log(data.AccessToken);
        // if(!user){
        //     throw new BadRequestException('token expired');
        // }
        return payload;
    }
    
}