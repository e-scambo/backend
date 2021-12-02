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
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from '../../business/service/user.service';
import { UserInterceptor } from '../../config/interceptor/user.interceptor';
import {
  CreateUserDTO,
  UpdatePasswordDTO,
  UpdateUserDTO,
  UserParamByIdDTO,
} from '../dto/user.dto';

@Controller('users')
@ApiTags('users')
@UseInterceptors(UserInterceptor)
export class UserController {
  constructor(private readonly _service: UserService) {}

  @Post()
  async create(@Body() dto: CreateUserDTO): Promise<object> {
    return this._service.create(dto);
  }

  @Get(':user_id')
  async findById(@Param() param: UserParamByIdDTO): Promise<object> {
    return this._service.findById(param.user_id);
  }

  @Put(':user_id')
  async updateById(
    @Param() param: UserParamByIdDTO,
    @Body() dto: UpdateUserDTO,
  ): Promise<object> {
    return this._service.updateById(param.user_id, dto);
  }

  @Delete(':user_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param() param: UserParamByIdDTO): Promise<void> {
    return this._service.deleteById(param.user_id);
  }

  @Patch('/:user_id/password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePassword(
    @Param() param: UserParamByIdDTO,
    @Body() dto: UpdatePasswordDTO,
  ): Promise<void> {
    return this._service.updatePassword(param.user_id, dto);
  }
}
