import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { AuthService } from '../../business/service/auth.service';
import { AuthInterceptor } from '../../config/interceptor/auth.interceptor';

@Controller('auth')
export class AuthController {
  constructor(private readonly _service: AuthService) {}

  @Post()
  @UseInterceptors(AuthInterceptor)
  async auth(@Body() item: any) {
    return this._service.auth(item);
  }
}
