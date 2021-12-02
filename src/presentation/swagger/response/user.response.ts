import { HttpStatus } from '@nestjs/common';
import { ApiResponseProperty } from '@nestjs/swagger';

class UserNotFoundError {
  @ApiResponseProperty({
    example: 'User not found or already removed',
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

export const UserNotFoundErrorResponse = {
  description: 'Usuário não encontrado ou já foi removido',
  type: UserNotFoundError,
};
