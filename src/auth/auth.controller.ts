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
    @Post('sign-in')
    public async login(@Response() response, @Body() loginUserDto: LoginUserDto) {
        return this.authService.createdToken(loginUserDto,response);
    }
    @UseGuards(AuthGuard('jwt'))
    @Post('sign-out')
    public async logout(@Response() response) {
        
    }
}