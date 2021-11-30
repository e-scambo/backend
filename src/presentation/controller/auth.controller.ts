import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { AuthService } from '../../business/service/auth.service';
import { AuthInterceptor } from '../../config/interceptor/auth.interceptor';
import { AuthDTO } from '../dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly _service: AuthService) {}

  @Post()
  @UseInterceptors(AuthInterceptor)
  async auth(@Body() item: AuthDTO) {
    return this._service.auth(item);
  }
}
