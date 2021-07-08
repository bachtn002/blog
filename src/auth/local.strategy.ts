import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "./auth.service";


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
    constructor(private readonly authService: AuthService){
        super();
    }
    async validate(Mobile: string, PasswordHash: string): Promise<any>{
        const user = await this.authService.validateUser(Mobile, PasswordHash);
        if(!user){
            throw new UnauthorizedException({ message:'Mobile or password incorrect'});
        }
        return user;
    }
}