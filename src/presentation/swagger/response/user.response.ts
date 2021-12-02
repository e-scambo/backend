import { HttpStatus } from "@nestjs/common";
import { ApiProperty, ApiResponseProperty } from "@nestjs/swagger";

export class UserResponse {
  @ApiProperty({
    readOnly: true,
    description: 'Id único do usuário',
    example: '61a8e2f3b7b0f8f4076ec559'
  })
  id: string;

  @ApiProperty({
    readOnly: true,
    description: 'Nome do usuário',
    example: 'João da Silva',
  })
  name: string;

  @ApiProperty({
    readOnly: true,
    description: 'Email cadastrado do usuário',
    example: 'johndoe@mail.com',
  })
  email: string;

  @ApiProperty({
    readOnly: true,
    description: 'Cidade do cadastro do usuário',
    example: 'Brasília',
  })
  city: string;

  @ApiProperty({
    readOnly: true,
    description: 'Estado ou Distrito Federal do cadastro do usuário',
    example: 'Distrito Federal',
  })
  state: string;

  @ApiProperty({
    readOnly: true,
    description: 'Telefone de cadastro do usuário',
    example: '(51) 9999-9999',
  })
  phone: string;

  @ApiProperty({
    readOnly: true,
    description: 'Data de criação do usuário',
    example: '2021-12-02T15:14:59.929Z',
  })
  created_at: Date;

  @ApiProperty({
    readOnly: true,
    description: 'Data da última atualização do usuário',
    example: '2021-12-02T15:14:59.929Z'
  })
  updated_at: Date;
}

export class UserNotUniqueResponse {
  @ApiResponseProperty({
    example: 'An user with this email or phone already exists.'
  })
  message: string;

  @ApiResponseProperty({
    example: HttpStatus.CONFLICT,
  })
  statusCode: number;

  @ApiResponseProperty({
    example: 'Conflict',
  })
  error: string;
}

export class UserNotFoundResponse {
  @ApiResponseProperty({
    example: 'User not found or already removed.'
  })
  message: string;

  @ApiResponseProperty({
    example: HttpStatus.NOT_FOUND,
  })
  statusCode: number;

  @ApiResponseProperty({
    example: 'Not Found',
  })
  error: string;
}

export class UserForbiddenResponse {
  @ApiResponseProperty({
    example: 'The password informed does not match with current password.'
  })
  message: string;

  @ApiResponseProperty({
    example: HttpStatus.FORBIDDEN,
  })
  statusCode: number;

  @ApiResponseProperty({
    example: 'Forbidden',
  })
  error: string;
}