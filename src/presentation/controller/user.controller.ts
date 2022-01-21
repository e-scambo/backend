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
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiProduces,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from '../../business/service/user.service';
import { UserInterceptor } from '../../config/interceptor/user.interceptor';
import {
  CreateUserDTO,
  UpdatePasswordDTO,
  UpdateUserDTO,
  UserParamByIdDTO,
} from '../dto/user.dto';
import { PayloadGuard } from '../guard/payload.exists.guard';
import {
  BadRequestValidationErrorResponse,
  InternalServerErrorResponse,
} from '../swagger/response/error.response';
import {
  UserConlifctErrorResponse,
  UserCreatedResponse,
  UserForbiddenErrorResponse,
  UserNoContentResponse,
  UserNotFoundErrorResponse,
  UserNotFoundResponse,
  UserNotUniqueResponse,
  UserOkResponse,
  UserResponse,
} from '../swagger/response/user.response';

@Controller('users')
@ApiTags('users')
@UseInterceptors(UserInterceptor)
export class UserController {
  constructor(private readonly _service: UserService) {}

  @Post()
  @UseGuards(new PayloadGuard())
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
    }),
  )
  @ApiConsumes('application/json')
  @ApiProduces('application/json')
  @ApiCreatedResponse(UserCreatedResponse)
  @ApiConflictResponse(UserConlifctErrorResponse)
  @ApiBadRequestResponse(BadRequestValidationErrorResponse)
  @ApiInternalServerErrorResponse(InternalServerErrorResponse)
  async create(@Body() dto: CreateUserDTO): Promise<object> {
    return this._service.create(dto);
  }

  @Get(':user_id')
  @ApiParam({ name: 'user_id', description: 'Id do usuário' })
  @ApiConsumes('application/json')
  @ApiProduces('application/json')
  @ApiOkResponse(UserOkResponse)
  @ApiNotFoundResponse(UserNotFoundErrorResponse)
  @ApiBadRequestResponse(BadRequestValidationErrorResponse)
  @ApiInternalServerErrorResponse(InternalServerErrorResponse)
  async findById(@Param() param: UserParamByIdDTO): Promise<object> {
    return this._service.findById(param.user_id);
  }

  @Put(':user_id')
  @UseGuards(new PayloadGuard())
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      skipMissingProperties: true,
    }),
  )
  @ApiConsumes('application/json')
  @ApiProduces('application/json')
  @ApiParam({ name: 'user_id', description: 'Id do usuário' })
  @ApiOkResponse(UserOkResponse)
  @ApiNotFoundResponse(UserNotFoundErrorResponse)
  @ApiConflictResponse(UserConlifctErrorResponse)
  @ApiBadRequestResponse(BadRequestValidationErrorResponse)
  @ApiInternalServerErrorResponse(InternalServerErrorResponse)
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
  @ApiParam({ name: 'user_id' })
  @ApiNoContentResponse(UserNoContentResponse)
  @ApiNotFoundResponse(UserNotFoundErrorResponse)
  @ApiBadRequestResponse(BadRequestValidationErrorResponse)
  @ApiInternalServerErrorResponse(InternalServerErrorResponse)
  async deleteById(@Param() param: UserParamByIdDTO): Promise<void> {
    return this._service.deleteById(param.user_id);
  }

  @Patch('/:user_id/password')
  @UseGuards(new PayloadGuard())
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
    }),
  )
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({ name: 'user_id', description: 'Id do usuário' })
  @ApiConsumes('application/json')
  @ApiProduces('application/json')
  @ApiNoContentResponse(UserNoContentResponse)
  @ApiForbiddenResponse(UserForbiddenErrorResponse)
  @ApiNotFoundResponse(UserNotFoundErrorResponse)
  @ApiBadRequestResponse(BadRequestValidationErrorResponse)
  @ApiInternalServerErrorResponse(InternalServerErrorResponse)
  async updatePassword(
    @Param() param: UserParamByIdDTO,
    @Body() dto: UpdatePasswordDTO,
  ): Promise<void> {
    return this._service.updatePassword(param.user_id, dto);
  }
}
