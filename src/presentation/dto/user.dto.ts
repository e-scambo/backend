import { ApiProperty } from '@nestjs/swagger';
import {
  Equals,
  IsDefined,
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { IsAlphaWithSpace } from '../validator/is.alpha.with.space.validator';
import { IsValidPassword } from '../validator/is.valid.password.validator';
import { IsValidPhone } from '../validator/is.valid.phone.validator';

export class CreateUserDTO {
  @ApiProperty({
    writeOnly: true,
    description: 'Nome do usuário',
    example: 'João da Silva',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsAlphaWithSpace()
  name: string;

  @ApiProperty({
    writeOnly: true,
    description: 'Email do usuário',
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
    example: 'MinhaSenha123',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @IsValidPassword()
  password: string;

  @ApiProperty({
    writeOnly: true,
    description: 'Cidade do Usuário',
    example: 'Campina Grande',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsAlphaWithSpace()
  city: string;

  @ApiProperty({
    writeOnly: true,
    description: 'Estado do usuário',
    example: 'Paraíba',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsAlphaWithSpace()
  state: string;

  @ApiProperty({
    writeOnly: true,
    description: 'Telefone do usuário',
    example: '(99) 99999-9999',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsValidPhone()
  phone: string;
}

export class UserParamByIdDTO {
  @IsMongoId()
  user_id: string;
}

export class UpdateUserDTO {
  @ApiProperty({
    writeOnly: true,
    description: 'Nome do usuário',
    example: 'João da Silva',
  })
  @ValidateIf((dto) => dto.name !== undefined)
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsAlphaWithSpace()
  name: string;

  @ApiProperty({
    writeOnly: true,
    description: 'Email do usuário',
    example: 'johndoe@mail.com',
  })
  @ValidateIf((dto) => dto.email !== undefined)
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Equals(undefined, {
    message:
      'password cannot be updated here, please use the proper endpoint for this operation',
  })
  password: string;

  @ApiProperty({
    writeOnly: true,
    description: 'Cidade do Usuário',
    example: 'Campina Grande',
  })
  @ValidateIf((dto) => dto.city !== undefined)
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsAlphaWithSpace()
  city: string;

  @ApiProperty({
    writeOnly: true,
    description: 'Estado do usuário',
    example: 'Paraíba',
  })
  @ValidateIf((dto) => dto.state !== undefined)
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsAlphaWithSpace()
  state: string;

  @ApiProperty({
    writeOnly: true,
    description: 'Telefone do usuário',
    example: '(99) 99999-9999',
  })
  @ValidateIf((dto) => dto.phone !== undefined)
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsValidPhone()
  phone: string;
}

export class RecoverPasswordDTO {
  @ApiProperty({
    writeOnly: true,
    description: 'Email do usuário',
    example: 'test@mail.com',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class UserParamRedefinePasswordDTO {
  @ApiProperty({
    writeOnly: true,
    description: 'jwt token',
    example: '',
  })
  @IsDefined()
  @IsString()
  @Matches(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/, {
    message: 'Invalid JWT token',
  })
  @IsNotEmpty()
  token: string;
}

export class UserRedefinePasswordDTO {
  @ApiProperty({
    writeOnly: true,
    description: 'jwt token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzaXJqb2FuZGVyc29ud2ZAZ21haWwuY29tIiwiaWF0IjoxNjgxOTE2Nzk5LCJleHAiOjE2ODI1MjE1OTl9.q6TbxRC-bi_bKDHZXTPMWML_PLYZ_HaD2qwiTTBG-KU',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @IsValidPassword()
  password: string;
}

export class UpdatePasswordDTO {
  @ApiProperty({
    writeOnly: true,
    description: 'Senha atual do usuário',
    example: 'MinhaSenha123',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @IsValidPassword()
  current_password: string;

  @ApiProperty({
    writeOnly: true,
    description: 'Nova senha do usuário',
    example: 'MinhaSenha123_2',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @IsValidPassword()
  new_password: string;
}
