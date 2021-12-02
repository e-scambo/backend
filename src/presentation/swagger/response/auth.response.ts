import { HttpStatus } from '@nestjs/common';
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';

export class AuthResponse {
  @ApiProperty({
    readOnly: true,
    description: 'Token de acesso do usuário',
    example: 'jwt_token',
  })
  access_token: string;
}

export class AuthUnauthorizedResponseError {
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
