import { ApiResponseProperty } from '@nestjs/swagger';
import { ReadOnlyResponse } from './readonly.response';

class AnnouncementResponse extends ReadOnlyResponse {
  @ApiResponseProperty({
    example: '61a8e6456ec94e22a0c12a76',
  })
  owner: string;

  @ApiResponseProperty({
    example: ['61a8e6456ec94e22a0c12a76'],
  })
  images: string[];

  @ApiResponseProperty({
    example: 'novo',
  })
  usage_time: string;

  @ApiResponseProperty({
    example: 'Campina Grande - PB',
  })
  localization: string;

  @ApiResponseProperty({
    example: 'Cursos',
  })
  category: string;

  @ApiResponseProperty({
    example: 'product',
  })
  type: string;

  @ApiResponseProperty({
    example: 'Aprenda como utilizar a plataforma E-Scambo por completo!',
  })
  description: string;

  @ApiResponseProperty({
    example: 'Curso de Formação - Uso da Plataforma E-Scambo',
  })
  title: string;
}

export const CreateAnnouncementResponse = {
  type: AnnouncementResponse,
  description: 'Anúncio criado com sucesso.',
};

export const FindAnnouncementResponse = {
  type: AnnouncementResponse,
  isArray: true,
  description: 'Lista de anúncios',
};
