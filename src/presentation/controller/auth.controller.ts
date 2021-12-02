import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from '../../business/service/auth.service';
import { AuthInterceptor } from '../../config/interceptor/auth.interceptor';
import { AuthDTO } from '../dto/auth.dto';
import {
  AuthResponse,
  AuthUnauthorizedResponseError,
} from '../swagger/response/auth.response';
import {
  BadRequestValidationErrorResponse,
  InternalServerErrorResponse,
} from '../swagger/response/error.response';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly _service: AuthService) {}

  @Post()
  @UseInterceptors(AuthInterceptor)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Autenticação realizada com sucesso',
    type: AuthResponse,
  })
  @ApiBadRequestResponse({
    description: 'Houve um erro de validação dos dados submetidos',
    type: BadRequestValidationErrorResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'As credenciais do usuário estão inválidas',
    type: AuthUnauthorizedResponseError,
  })
  @ApiInternalServerErrorResponse({
    description: 'Houve um erro interno na aplicação',
    type: InternalServerErrorResponse,
  })
  async auth(@Body() item: AuthDTO) {
    return this._service.auth(item);
  }
}
