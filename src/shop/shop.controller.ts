import { Body, Post, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { Controller } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ShopDto } from "./dto/shop.dto";
import { ShopService } from "./shop.service";

@Controller('api/shop')
export class ShopController{
    constructor(
        private readonly shopService: ShopService,
    ){}
    
    @Post('create')
    @UseGuards(AuthGuard('jwt'))
    @UsePipes(new ValidationPipe({skipMissingProperties: true}))
    public async create(@Body() dto: ShopDto){
        return this.shopService.create(dto);
    }
}