import { HttpStatus } from '@nestjs/common';
import { ApiResponseProperty } from '@nestjs/swagger';

class ImageNotFoundError {
  @ApiResponseProperty({
    example: 'Image not found or already removed.',
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

export const ImageResponse = {
  description: 'Download da imagem efetuado com sucesso',
  content: {
    'image/*': {
      schema: {
        type: 'string',
        format: 'binary',
      },
    },
  },
};

export const ImageNotFoundErrorResponse = {
  description: 'Imagem não encontrada ou já foi removida.',
  type: ImageNotFoundError,
};
