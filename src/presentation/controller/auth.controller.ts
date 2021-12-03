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
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from '../../business/service/auth.service';
import { AuthInterceptor } from '../../config/interceptor/auth.interceptor';
import { AuthDTO } from '../dto/auth.dto';
import {
  AuthOkResponse,
  AuthUnauthorizedErrorResponse,
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
  @ApiOkResponse(AuthOkResponse)
  @ApiBadRequestResponse(BadRequestValidationErrorResponse)
  @ApiUnauthorizedResponse(AuthUnauthorizedErrorResponse)
  @ApiInternalServerErrorResponse(InternalServerErrorResponse)
  async auth(@Body() item: AuthDTO) {
    return this._service.auth(item);
  }
}
