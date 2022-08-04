import { HttpStatus } from '@nestjs/common';
import { ApiResponseProperty } from '@nestjs/swagger';

class InternalServerError {
  @ApiResponseProperty({
    example: 'An internal error occurred while making the request.',
  })
  message: string;

  @ApiResponseProperty({
    example: 'Please check the submitted data in request or try again later.',
  })
  description: string;

  @ApiResponseProperty({
    example: HttpStatus.INTERNAL_SERVER_ERROR,
  })
  statusCode: number;
}

class BadRequestValidationError {
  @ApiResponseProperty({
    example: ['field should not be undefined'],
  })
  message: string;

  @ApiResponseProperty({
    example: 'Bad Request',
  })
  error: string | string[];

  @ApiResponseProperty({
    example: HttpStatus.BAD_REQUEST,
  })
  statusCode: number;
}

export const BadRequestValidationErrorResponse = {
  description: 'Houve um erro de validação dos dados submetidos',
  type: BadRequestValidationError,
};

export const InternalServerErrorResponse = {
  description: 'Houve um erro interno na aplicação',
  type: InternalServerError,
};
