import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  UseInterceptors
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiConflictResponse, ApiConsumes, ApiCreatedResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiProduces, ApiTags } from '@nestjs/swagger';
import { UserService } from '../../business/service/user.service';
import { UserInterceptor } from '../../config/interceptor/user.interceptor';
import {
  CreateUserDTO,
  UpdatePasswordDTO,
  UpdateUserDTO,
  UserParamByIdDTO
} from '../dto/user.dto';
import { BadRequestValidationErrorResponse, InternalServerErrorResponse } from '../swagger/response/error.response';
import { UserForbiddenResponse, UserNotFoundResponse, UserNotUniqueResponse, UserResponse } from '../swagger/response/user.response';

@Controller('users')
@ApiTags('users')
@UseInterceptors(UserInterceptor)
export class UserController {
  constructor(private readonly _service: UserService) {}

  @Post()
  @ApiConsumes('application/json')
  @ApiProduces('application/json')
  @ApiCreatedResponse({
    description: 'Usuário criado com sucesso.',
    type: UserResponse
  })
  @ApiConflictResponse({
    description: 'Informações já existem no banco.', 
    type: UserNotUniqueResponse
  })
  @ApiBadRequestResponse({
    description: 'Houve um erro de validação dos dados submetidos.', 
    type: BadRequestValidationErrorResponse
  })
  @ApiNotFoundResponse({
    description: 'O recurso não foi encontrado no banco.',
    type: UserNotFoundResponse
  })
  @ApiInternalServerErrorResponse({
    description: 'Houve um erro interno na aplicação',
    type: InternalServerErrorResponse,
  })
  async create(@Body() dto: CreateUserDTO): Promise<object> {
    return this._service.create(dto);
  }

  @Get(':user_id')
  @ApiParam({name: 'user_id', description: 'Id do usuário'})
  @ApiConsumes('application/json')
  @ApiProduces('application/json')
  @ApiOkResponse({
    description: 'Usuário encontrado com sucesso.',
    type: UserResponse
  })
  @ApiBadRequestResponse({
    description: 'Houve um erro de validação dos dados submetidos.', 
    type: BadRequestValidationErrorResponse
  })
  @ApiNotFoundResponse({
    description: 'O recurso não foi encontrado no banco.',
    type: UserNotFoundResponse
  })
  @ApiInternalServerErrorResponse({
    description: 'Houve um erro interno na aplicação',
    type: InternalServerErrorResponse,
  })
  
  async findById(@Param() param: UserParamByIdDTO): Promise<object> {
    return this._service.findById(param.user_id);
  }

  @Put(':user_id')
  @ApiConsumes('application/json')
  @ApiProduces('application/json')
  @ApiParam({name: 'user_id'})
  @ApiOkResponse({
    description: 'Usuário atualizado com sucesso.',
    type: UserResponse
  })
  @ApiConflictResponse({
    description: 'Informações já existem no banco.', 
    type: UserNotUniqueResponse
  })
  @ApiBadRequestResponse({
    description: 'Houve um erro de validação dos dados submetidos.', 
    type: BadRequestValidationErrorResponse
  })
  @ApiNotFoundResponse({
    description: 'O recurso não foi encontrado no banco.',
    type: UserNotFoundResponse
  })
  @ApiInternalServerErrorResponse({
    description: 'Houve um erro interno na aplicação',
    type: InternalServerErrorResponse,
  })
  async updateById(
    @Param() param: UserParamByIdDTO,
    @Body() dto: UpdateUserDTO,
  ): Promise<object> {
    return this._service.updateById(param.user_id, dto);
  }

  @Delete(':user_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiConsumes('application/json')
  @ApiProduces('application/json')
  @ApiParam({name: 'user_id'})
  @ApiNoContentResponse({
    description: 'Usuário deletado com sucesso.',
  })
  @ApiBadRequestResponse({
    description: 'Houve um erro de validação dos dados submetidos.', 
    type: BadRequestValidationErrorResponse
  })
  @ApiNotFoundResponse({
    description: 'O recurso não foi encontrado no banco.',
    type: UserNotFoundResponse
  })
  @ApiInternalServerErrorResponse({
    description: 'Houve um erro interno na aplicação',
    type: InternalServerErrorResponse,
  })
  async deleteById(@Param() param: UserParamByIdDTO): Promise<void> {
    return this._service.deleteById(param.user_id);
  }

  @Patch('/:user_id/password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({name: 'user_id'})
  @ApiConsumes('application/json')
  @ApiProduces('application/json')
  @ApiNoContentResponse({
    description: 'Senha atualizada com sucesso.',
  })
  @ApiBadRequestResponse({
    description: 'Houve um erro de validação dos dados submetidos.', 
    type: BadRequestValidationErrorResponse
  })
  @ApiForbiddenResponse({
    description: 'Usuário não obteve permissão para realizar a operação desejada',
    type: UserForbiddenResponse
  })
  @ApiNotFoundResponse({
    description: 'O recurso não foi encontrado no banco.',
    type: UserNotFoundResponse
  })
  @ApiInternalServerErrorResponse({
    description: 'Houve um erro interno na aplicação',
    type: InternalServerErrorResponse,
  })
  async updatePassword(
    @Param() param: UserParamByIdDTO,
    @Body() dto: UpdatePasswordDTO,
  ): Promise<void> {
    return this._service.updatePassword(param.user_id, dto);
  }
}
