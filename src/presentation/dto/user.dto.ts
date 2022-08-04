import { ApiProperty } from '@nestjs/swagger';
import {
  Equals,
  IsDefined,
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsString,
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
