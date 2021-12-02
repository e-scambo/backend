import { HttpStatus } from '@nestjs/common';
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';

export class InternalServerErrorResponse {
  @ApiResponseProperty({
    example: 'An internal error occurred while making the request.',
  })
  message: string;

  @ApiResponseProperty({
    example: 'Please check the submitted data in request or try again later.',
  })
  description: string;

  @ApiResponseProperty({
    example: HttpStatus.INTERNAL_SERVER_ERROR
  })
  statusCode: number
}

export class BadRequestValidationErrorResponse {
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
