import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { MongoQuery, MongoQueryModel } from 'nest-mongo-query-parser';
import { FavoriteService } from '../../business/service/favorite.service';
import { FavoriteInterceptor } from '../../config/interceptor/favorite.interceptor';
import { CreateFavoriteDTO, FavoriteParamByIdDTO } from '../dto/favorite.dto';
import { UserParamByIdDTO } from '../dto/user.dto';

@Controller('users/:user_id/favorites')
@UseInterceptors(FavoriteInterceptor)
export class UserFavoriteController {
  constructor(private readonly _service: FavoriteService) {}

  @Post()
  async create(
    @Param() param: UserParamByIdDTO,
    @Body() body: CreateFavoriteDTO,
  ) {
    body.owner = param.user_id;
    return this._service.create(body);
  }

  @Get()
  async find(
    @Param() param: UserParamByIdDTO,
    @MongoQuery() query: MongoQueryModel,
  ) {
    query.filter = { ...query.filter, owner: param.user_id };
    return this._service.findWithQuery(query);
  }

  @Get(':favorite_id')
  async findById(@Param() param: FavoriteParamByIdDTO) {
    return this._service.findById(param.favorite_id, param.user_id);
  }

  @Delete(':favorite_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param() param: FavoriteParamByIdDTO) {
    return this._service.deleteById(param.favorite_id, param.user_id);
  }
}
