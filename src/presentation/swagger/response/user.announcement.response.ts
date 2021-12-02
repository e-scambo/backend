import { HttpStatus } from '@nestjs/common';
import { ApiResponseProperty } from '@nestjs/swagger';
import { ReadOnlyResponse } from './readonly.response';

class AnnouncementResponse extends ReadOnlyResponse {
  @ApiResponseProperty({
    example: 'Curso de Formação - Uso da Plataforma E-Scambo',
  })
  title: string;

  @ApiResponseProperty({
    example: 'Aprenda como utilizar a plataforma E-Scambo por completo!',
  })
  description: string;

  @ApiResponseProperty({
    example: 'product',
  })
  type: string;

  @ApiResponseProperty({
    example: 'Cursos',
  })
  category: string;

  @ApiResponseProperty({
    example: 'Campina Grande - PB',
  })
  localization: string;

  @ApiResponseProperty({
    example: 'novo',
  })
  usage_time: string;

  @ApiResponseProperty({
    example: ['61a8e6456ec94e22a0c12a76'],
  })
  images: string[];

  @ApiResponseProperty({
    example: '61a8e6456ec94e22a0c12a76',
  })
  owner: string;
}

class AnnouncementPopulatedResponse extends ReadOnlyResponse {
  @ApiResponseProperty({
    example: 'Curso de Formação - Uso da Plataforma E-Scambo',
  })
  title: string;

  @ApiResponseProperty({
    example: 'Aprenda como utilizar a plataforma E-Scambo por completo!',
  })
  description: string;

  @ApiResponseProperty({
    example: 'product',
  })
  type: string;

  @ApiResponseProperty({
    example: 'Cursos',
  })
  category: string;

  @ApiResponseProperty({
    example: 'Campina Grande - PB',
  })
  localization: string;

  @ApiResponseProperty({
    example: 'novo',
  })
  usage_time: string;

  @ApiResponseProperty({
    example: [
      {
        mimetype: 'image/jpeg',
        size: 20000,
        originalname: 'image.jpeg',
      },
    ],
  })
  images: object[];

  @ApiResponseProperty({
    example: {
      id: '61a8e2f3b7b0f8f4076ec559',
      name: 'João da Silva',
      email: 'johndoe@mail.com',
      city: 'Brasília',
      state: 'Distrito Federal',
      phone: '(51) 9999-9999',
    },
  })
  owner: object;
}
class AnnouncementNotFoundError {
  @ApiResponseProperty({
    example: 'Announcement not found or already removed.',
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

export const CreateAnnouncementResponse = {
  type: AnnouncementResponse,
  description: 'Anúncio criado com sucesso.',
};

export const FindAnnouncementResponse = {
  type: AnnouncementPopulatedResponse,
  isArray: true,
  description: 'Lista de anúncios retornada com sucesso',
};

export const FindOneAnnouncementResponse = {
  type: AnnouncementPopulatedResponse,
  description: 'Anúncio encontrado com sucesso',
};

export const UpdateOneAnnouncementResponse = {
  type: AnnouncementPopulatedResponse,
  description: 'Anúncio atualizado com sucesso',
};

export const DeleteOneAnnouncementResponse = {
  description: 'Anúncio deletado com sucesso. Não há dados a serem retornados',
};

export const AnnouncementNotFoundErrorResponse = {
  description: 'Anúncio não encontrado ou já foi removido',
  type: AnnouncementNotFoundError,
};
