
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { Gender } from '../entities/gender.enum';
import { Role } from '../entities/role.enum';

export class UpdateUserDto{

    @IsString()
    @MaxLength(255)
    @MinLength(8)
    @ApiProperty()
    Password:string;

    @ApiProperty()
    Role:Role

    @IsNotEmpty()
    @ApiProperty()
    Gender:Gender

    @IsNotEmpty()
    @ApiProperty()
    DOB: Date;
    
}
