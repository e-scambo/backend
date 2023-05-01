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
  UserParamRedefinePasswordDTO,
  UserRedefinePasswordDTO,
} from '../dto/user.dto';
import { PayloadPipe } from '../pipes/payload.exists.pipe';
import {
  BadRequestValidationErrorResponse,
  InternalServerErrorResponse,
} from '../swagger/response/error.response';
import {
  UserConflictErrorResponse,
  UserCreatedResponse,
  UserForbiddenErrorResponse,
  UserNoContentResponse,
  UserNotFoundErrorResponse,
  UserOkResponse,
} from '../swagger/response/user.response';
import { User } from 'src/infrastructure/schema/user.schema';
import { IdsMatchGuard } from '../guards/ids.match.guard';
import { JwtAuthGuard } from '../guards/jwt.guard';

@Controller('users')
@ApiTags('users')
@UseInterceptors(UserInterceptor)
export class UserController {
  constructor(private readonly _service: UserService) {}

  @Post()
  @ApiConsumes('application/json')
  @ApiProduces('application/json')
  @ApiCreatedResponse(UserCreatedResponse)
  @ApiConflictResponse(UserConflictErrorResponse)
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
  @UsePipes(PayloadPipe)
  @UseGuards(JwtAuthGuard, IdsMatchGuard)
  @ApiConsumes('application/json')
  @ApiProduces('application/json')
  @ApiParam({ name: 'user_id', description: 'Id do usuário' })
  @ApiOkResponse(UserOkResponse)
  @ApiNotFoundResponse(UserNotFoundErrorResponse)
  @ApiConflictResponse(UserConflictErrorResponse)
  @ApiBadRequestResponse(BadRequestValidationErrorResponse)
  @ApiInternalServerErrorResponse(InternalServerErrorResponse)
  async updateById(
    @Param() param: UserParamByIdDTO,
    @Body() dto: UpdateUserDTO,
  ): Promise<User> {
    return this._service.updateById(param.user_id, dto);
  }

  @Delete(':user_id')
  @UseGuards(JwtAuthGuard, IdsMatchGuard)
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
  @UsePipes(PayloadPipe)
  @UseGuards(JwtAuthGuard, IdsMatchGuard)
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

  @Get('/:user_id/recover-password')
  @ApiParam({ name: 'user_id', description: 'Id do usuário' })
  @ApiConsumes('application/json')
  @ApiProduces('application/json')
  @ApiNotFoundResponse(UserNotFoundErrorResponse)
  async sendRecoveryLink(@Param() param: UserParamByIdDTO): Promise<void> {
    return this._service.sendRecoveryLink(param.user_id);
  }

  @Get('/redefine-password/:token')
  @ApiParam({ name: 'token', description: 'jwt_token recebido' })
  @ApiConsumes('application/json')
  @ApiProduces('application/json')
  @ApiForbiddenResponse(UserForbiddenErrorResponse)
  async redefinePassword(
    @Param() param: UserParamRedefinePasswordDTO,
    @Body() dto: UserRedefinePasswordDTO,
  ): Promise<void> {
    return this._service.redefinePassword(param.token, dto.password);
  }
}
