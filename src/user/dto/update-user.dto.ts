import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { Gender } from '../entities/gender.enum';
import { Role } from '../entities/role.enum';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {

    @IsString()
    @MaxLength(20)
    @MinLength(10)
    @ApiProperty()
    Mobile:string;

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
