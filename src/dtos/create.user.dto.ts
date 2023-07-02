import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, IsEmail, } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @MinLength(5)
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(5)
  password: string;
}