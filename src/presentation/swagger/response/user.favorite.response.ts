import { HttpStatus } from "@nestjs/common";
import { ApiResponseProperty } from "@nestjs/swagger";
import { ReadOnlyResponse } from "./readonly.response";

export class FavoriteReponse extends ReadOnlyResponse {
  @ApiResponseProperty({
    example: '61a8e2f3b7b0f8f4076ec559'
  })
  owner: string

  @ApiResponseProperty({
    example: '61a8d53d0b06e1827428b042'
  })
  announcement: string
}

export class FavoritePopulatedReponse extends ReadOnlyResponse {
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

  @ApiResponseProperty({
    example: { 
      title: 'Curso de Formação - Uso da Plataforma E-Scambo',
      description: 'Aprenda como utilizar a plataforma E-Scambo por completo!',
      type: 'product',
      category: 'Cursos',
      localization: 'Campina Grande - PB',
      usage_time: 'novo',
      images: [
        '61a8e6456ec94e22a0c12a76',
        '61a8e6456ec94e22a0c12a77',
        '61a8e6456ec94e22a0c12a78'
      ],
      owner: '61a8e2f3b7b0f8f4076ec559',
      id: '61a8d53d0b06e1827428b042'
    }
  })
  announcement: object
}

export class FavoriteNotFoundResponse  {
  @ApiResponseProperty({
    example: 'Favorite|Annoucement|User not found or already removed.',
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

export class FavoriteConflictResponse  {
  @ApiResponseProperty({
    example: 'The user has already saved the announcement as a favorite.',
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

export const FavoritesCreatedResponse = {
  description: 'Favorito adicionado com sucesso',
  type: FavoriteReponse
};

export const FindFavoritesQueryResponse = {
  description: 'Favorito(s) encontrado(s) com sucesso',
  type: FavoritePopulatedReponse
};

export const FindFavoriteIdResponse = {
  description: 'Favorito adicionado com sucesso',
  type: FavoritePopulatedReponse
};

export const FavoritesNotFoundErrorResponse = {
  description: 'Favorito|Anúncio|Usuário não encontrado ou já foi removido',
  type: FavoriteNotFoundResponse
}

export const FavoritesConlifctErrorResponse = {
  description: 'Dados informados já existem no banco',
  type: FavoriteConflictResponse
}

export const FavoritesNoContentResponse = {
  description: 'Favorito deletado com sucesso.',
};