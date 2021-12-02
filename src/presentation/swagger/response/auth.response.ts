import { HttpStatus } from '@nestjs/common';
import { ApiResponseProperty } from '@nestjs/swagger';

export class AuthResponse {
  @ApiResponseProperty({
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
