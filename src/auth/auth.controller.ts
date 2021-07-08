import { Body, Redirect } from "@nestjs/common";
import { Get } from "@nestjs/common";
import { Post, UseGuards, Request, Response, Controller, Res } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { LoginUserDto } from "src/user/dto/login-user.dto";
import { User } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";
import { AuthService } from "./auth.service";

@Controller('api/user')
export class AuthController {
    constructor(private readonly userService: UserService,
        private readonly authService: AuthService) { }

    @UseGuards(AuthGuard('local'))
    @Post('sign-in')
    async login(@Request() request, @Response() response) {
        const cookie = await this.authService.login(request.user);
        const cookieRefreshToken = await this.authService.getCookieWithRefreshToken(request.user);
        const refreshToken = await this.authService.getRefreshToken(request.user);
        await this.userService.saveRefreshToken(refreshToken, request.user.UserId);
        request.res.setHeader('Set-Cookie', [cookie,cookieRefreshToken]);
        return response.send('OK!');
    }
    @Post('sign-out')
    public async logout(@Request() request, @Response() response) {
        response.setHeader('Set-Cookie', this.authService.logOutTokenFromCookie());
        return response.sendStatus(200);
    }
    @UseGuards(AuthGuard('jwt-refresh-token'))
    @Get('refresh-token')
    public async newToken(@Request() request){
        const newAccessTokenCookie = await this.authService.login(request.user);
        request.res.setHeader('Set-Cookie', newAccessTokenCookie);
        return request.user;
    }
}