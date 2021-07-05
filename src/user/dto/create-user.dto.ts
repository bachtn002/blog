import { IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max, IsNotEmpty, Equals, MaxLength, MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Match } from './match.decorator';

export class CreateUserDto {
    @MaxLength(20)
    @MinLength(10)
    @IsNotEmpty()
    @ApiProperty()
    Mobile:string;

    @IsNotEmpty()
    @MaxLength(255)
    @MinLength(8)
    @ApiProperty()
    Password:string;

    @IsNotEmpty()
    @Match('Password')
    @ApiProperty()
    ConfirmPassword: string;
}
