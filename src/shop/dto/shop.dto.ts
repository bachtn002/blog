import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";
import { Role } from "../entities/role.enum";
import { ShopStatus } from "../entities/shop.status.enum";


export class ShopDto{

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    shopName: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(2500)
    shopAdress: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(2500)
    description: string;

    @IsString()
    @IsNotEmpty()
    shopStatus: ShopStatus;

    @IsString()
    @IsNotEmpty()
    role:Role;
    
    @IsString()
    @IsNotEmpty()
    userId:string;

    @IsNumber()
    @IsNotEmpty()
    page: number;

    @IsNumber()
    @IsNotEmpty()
    limit: number;
    
}