import { HttpStatus } from '@nestjs/common';
import { ApiResponseProperty } from '@nestjs/swagger';

class AuthResponse {
  @ApiResponseProperty({
    example: 'jwt_token',
  })
  access_token: string;
}

class AuthUnauthorizedError {
  @ApiResponseProperty({
    example: 'Invalid credentials. Please try again with valid credentials.',
  })
  message: string;

  @ApiResponseProperty({
    example: HttpStatus.UNAUTHORIZED,
  })
  statusCode: number;

  @ApiResponseProperty({
    example: 'Unauthorized',
  })
  error: string;
}

export const AuthOkResponse = {
  description: 'Autenticação realizada com sucesso',
  type: AuthResponse,
};

export const AuthUnauthorizedErrorResponse = {
  description: 'As credenciais do usuário estão inválidas',
  type: AuthUnauthorizedError,
};
