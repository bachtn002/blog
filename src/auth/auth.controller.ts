import { Body, UsePipes, ValidationPipe } from "@nestjs/common";
import { Post, UseGuards, Request, Response, Controller, Get} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UserDto } from "src/user/dto/user.dto";
import { AuthService } from "./auth.service";

@Controller('api/user')
export class AuthController {
    constructor(
        private readonly authService: AuthService) { }

    @UsePipes(new ValidationPipe({ transform: true, skipMissingProperties: true}))
    @Post('sign-in')
    public async login(@Response() response, @Body() dto: UserDto) {
        return this.authService.createdToken(dto,response);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('sign-out')
    public async logout(@Response() response) {
        
    }
    
    @UseGuards(AuthGuard('jwt-refresh-token'))
    @Get('refresh')
    public async refreshToken(@Request() request, @Response() response){
        return await this.authService.createdNewToken(request, response);
    }
    
}