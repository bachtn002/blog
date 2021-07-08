import { IsString, MaxLength, MinLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Match } from './match.decorator';

export class CreateUserDto {
    @IsString()
    @MaxLength(20)
    @MinLength(10)
    @IsNotEmpty()
    @ApiProperty()
    Mobile:string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    @MinLength(8)
    @ApiProperty()
    Password:string;

    @IsString()
    @IsNotEmpty()
    @Match('Password',{
        message:'Repeat password not match'
    })
    @ApiProperty()
    ConfirmPassword: string;
}
