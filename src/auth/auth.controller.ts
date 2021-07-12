import { Body, Redirect, UnauthorizedException, UsePipes, ValidationPipe } from "@nestjs/common";
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

    @UsePipes(new ValidationPipe({ transform: true }))
    //@UseGuards(AuthGuard('local'))
    @Post('sign-in')
    public async login(@Request() request, @Response() response, @Body() loginUserDto: LoginUserDto) {
        const user = await this.authService.checkLogin(loginUserDto);
        if (user !== null) {
            const cookie = await this.authService.login(loginUserDto);
            const cookieRefreshToken = await this.authService.getCookieWithRefreshToken(loginUserDto);
            const refreshToken = await this.authService.getRefreshToken(loginUserDto);
            await this.userService.saveRefreshToken(refreshToken, user.UserId);
            request.res.setHeader('Set-Cookie', [cookie, cookieRefreshToken]);
            return response.send('OK!');
        } else {
            throw new UnauthorizedException({ message: 'Mobile or password incorrect' });
        }
    }

    @Post('sign-out')
    public async logout(@Response() response) {
        response.setHeader('Set-Cookie', this.authService.logOutTokenFromCookie());
        return response.sendStatus(200);
    }

    @UseGuards(AuthGuard('jwt-refresh-token'))
    @Get('refresh-token')
    public async newToken(@Request() request) {
        console.log(request);
        const newAccessTokenCookie = await this.authService.login(request.user);
        request.res.setHeader('Set-Cookie', newAccessTokenCookie);
        return request.user;
    }
}