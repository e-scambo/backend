import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  MaxLength,
} from 'class-validator';
import { IsValidPassword } from '../validator/is.valid.password.validator';

export class AuthDTO {
  @ApiProperty({
    writeOnly: true,
    description: 'E-mail do usuário',
    example: 'johndoe@mail.com',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    writeOnly: true,
    description: 'Senha de acesso do usuário',
    example: 'john*123',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @IsValidPassword()
  password: string;
}
