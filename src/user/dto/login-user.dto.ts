import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class LoginUserDto{
    @IsString()
    @MaxLength(20)
    @MinLength(10)
    @IsNotEmpty()
    @ApiProperty()
    Mobile: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    @MinLength(8)
    @ApiProperty()
    Password:string;
    
}