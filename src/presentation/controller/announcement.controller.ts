import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { MongoQuery, MongoQueryModel } from 'nest-mongo-query-parser';
import { AnnouncementService } from '../../business/service/announcement.service';
import { AnnouncementInterceptor } from '../../config/interceptor/announcement.interceptor';
import { FindAnnouncementByIdDTO } from '../dto/announcement.dto';
import { AnnouncementByIdParam } from '../swagger/param/announcement.param';
import { ApiQueryParam } from '../swagger/param/query.param';
import {
  BadRequestValidationErrorResponse,
  InternalServerErrorResponse,
} from '../swagger/response/error.response';
import {
  AnnouncementNotFoundErrorResponse,
  FindAnnouncementResponse,
  FindOneAnnouncementResponse,
} from '../swagger/response/user.announcement.response';

@Controller('announcements')
@ApiTags('announcements')
@UseInterceptors(AnnouncementInterceptor)
export class AnnouncementController {
  constructor(private readonly _service: AnnouncementService) {}

  @Get()
  @ApiQuery(ApiQueryParam)
  @ApiOkResponse(FindAnnouncementResponse)
  @ApiBadRequestResponse(BadRequestValidationErrorResponse)
  @ApiInternalServerErrorResponse(InternalServerErrorResponse)
  async find(@MongoQuery() query: MongoQueryModel) {
    return this._service.findWithQuery(query);
  }

  @Get(':announcement_id')
  @ApiParam(AnnouncementByIdParam)
  @ApiOkResponse(FindOneAnnouncementResponse)
  @ApiBadRequestResponse(BadRequestValidationErrorResponse)
  @ApiNotFoundResponse(AnnouncementNotFoundErrorResponse)
  @ApiInternalServerErrorResponse(InternalServerErrorResponse)
  async findById(@Param() param: FindAnnouncementByIdDTO) {
    return this._service.findById(param.announcement_id);
  }
}
