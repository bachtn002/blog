import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsDateString, IsNotEmpty, IsPositive, IsString, MaxLength, MinLength } from "class-validator";
import { Gender } from "../entities/gender.enum";
import { Role } from "../entities/role.enum";
import { Match } from "./match.decorator";


export class UserDto{
    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    @MinLength(10)
    mobile: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    @MinLength(8)
    password:string;

    @IsString()
    @IsNotEmpty()
    @Match('password',{
        message:'Repeat password not match'
    })
    confirmPassword: string;

    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    dob: Date;
    
    @IsString()
    @IsNotEmpty()
    gender: Gender;

    @IsString()
    @IsNotEmpty()
    role: Role;

    @IsNotEmpty()
    @IsPositive()
    page: number;

    @IsNotEmpty()
    @ApiProperty()
    @IsPositive()
    limit: number;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    filter: string;
}