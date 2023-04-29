import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiProduces,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { MongoQuery, MongoQueryModel } from 'nest-mongo-query-parser';
import { FavoriteService } from '../../business/service/favorite.service';
import { FavoriteInterceptor } from '../../config/interceptor/favorite.interceptor';
import { CreateFavoriteDTO, FavoriteParamByIdDTO } from '../dto/favorite.dto';
import { UserParamByIdDTO } from '../dto/user.dto';
import { PayloadPipe } from '../pipes/payload.exists.pipe';
import { ApiQueryParam } from '../swagger/param/query.param';
import {
  BadRequestValidationErrorResponse,
  InternalServerErrorResponse,
} from '../swagger/response/error.response';
import {
  FavoritesConlifctErrorResponse,
  FavoritesCreatedResponse,
  FavoritesNoContentResponse,
  FavoritesNotFoundErrorResponse,
  FindFavoriteIdResponse,
  FindFavoritesQueryResponse,
} from '../swagger/response/user.favorite.response';

@Controller('users/:user_id/favorites')
@ApiTags('users.favorites')
@UseInterceptors(FavoriteInterceptor)
export class UserFavoriteController {
  constructor(private readonly _service: FavoriteService) {}

  @Post()
  @UsePipes(PayloadPipe)
  @ApiConsumes('application/json')
  @ApiProduces('application/json')
  @ApiParam({ name: 'user_id', description: 'Id do usuário' })
  @ApiCreatedResponse(FavoritesCreatedResponse)
  @ApiConflictResponse(FavoritesConlifctErrorResponse)
  @ApiNotFoundResponse(FavoritesNotFoundErrorResponse)
  @ApiBadRequestResponse(BadRequestValidationErrorResponse)
  @ApiInternalServerErrorResponse(InternalServerErrorResponse)
  async create(
    @Param() param: UserParamByIdDTO,
    @Body() body: CreateFavoriteDTO,
  ) {
    body.owner = param.user_id;
    return this._service.create(body);
  }

  @Get()
  @ApiConsumes('application/json')
  @ApiProduces('application/json')
  @ApiParam({ name: 'user_id', description: 'Id do usuário' })
  @ApiQuery(ApiQueryParam)
  @ApiOkResponse(FindFavoritesQueryResponse)
  @ApiNotFoundResponse(FavoritesNotFoundErrorResponse)
  @ApiBadRequestResponse(BadRequestValidationErrorResponse)
  @ApiInternalServerErrorResponse(InternalServerErrorResponse)
  async find(
    @Param() param: UserParamByIdDTO,
    @MongoQuery() query: MongoQueryModel,
  ) {
    query.filter = { ...query.filter, owner: param.user_id };
    return this._service.findWithQuery(query);
  }

  @Get(':favorite_id')
  @ApiConsumes('application/json')
  @ApiProduces('application/json')
  @ApiParam({ name: 'user_id', description: 'Id do usuário' })
  @ApiParam({ name: 'favorite_id', description: 'Id do anúncio favoritado' })
  @ApiOkResponse(FindFavoriteIdResponse)
  @ApiNotFoundResponse(FavoritesNotFoundErrorResponse)
  @ApiBadRequestResponse(BadRequestValidationErrorResponse)
  @ApiInternalServerErrorResponse(InternalServerErrorResponse)
  async findById(@Param() param: FavoriteParamByIdDTO) {
    return this._service.findById(param.favorite_id, param.user_id);
  }

  @Delete(':favorite_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiConsumes('application/json')
  @ApiProduces('application/json')
  @ApiParam({ name: 'user_id', description: 'Id do usuário' })
  @ApiParam({ name: 'favorite_id', description: 'Id do anúncio favoritado' })
  @ApiNoContentResponse(FavoritesNoContentResponse)
  @ApiNotFoundResponse(FavoritesNotFoundErrorResponse)
  @ApiBadRequestResponse(BadRequestValidationErrorResponse)
  @ApiInternalServerErrorResponse(InternalServerErrorResponse)
  async deleteById(@Param() param: FavoriteParamByIdDTO) {
    return this._service.deleteById(param.favorite_id, param.user_id);
  }
}
