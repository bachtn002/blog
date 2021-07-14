import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { Gender } from "../entities/gender.enum";
import { Match } from "./match.decorator";


export class UserDto{
    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    @MinLength(10)
    Mobile: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    @MinLength(8)
    Password:string;

    @IsString()
    @IsNotEmpty()
    @Match('Password',{
        message:'Repeat password not match'
    })
    ConfirmPassword: string;

    
    DOB: Date;
    
    Gender: Gender;

    @ApiProperty()
    PageNumber: number;

    @ApiProperty()
    PageSize: number;
}