import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiProduces,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { MongoQuery, MongoQueryModel } from 'nest-mongo-query-parser';
import { AnnouncementService } from '../../business/service/announcement.service';
import { AnnouncementInterceptor } from '../../config/interceptor/announcement.interceptor';
import {
  CreateAnnouncementDTO,
  FindAnnouncementDto,
  UpdateAnnouncementDto,
} from '../dto/announcement.dto';
import { UserParamByIdDTO } from '../dto/user.dto';
import { ImageEnum } from '../enum/image.enum';
import { ApiQueryParam } from '../swagger/param/query.param';
import { UserByIdParam } from '../swagger/param/user.param';
import {
  BadRequestValidationErrorResponse,
  InternalServerErrorResponse,
} from '../swagger/response/error.response';
import {
  CreateAnnouncementResponse,
  FindAnnouncementResponse,
} from '../swagger/response/user.announcement.response';
import { UserNotFoundErrorResponse } from '../swagger/response/user.response';
import { IsValidImageMimetypeValidator } from '../validator/is.valid.image.mimetype.validator';

@Controller('users/:user_id/announcements')
@ApiTags('users.announcements')
@UseInterceptors(AnnouncementInterceptor)
export class UserAnnouncementController {
  constructor(private readonly _service: AnnouncementService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('images', ImageEnum.MAX_IMAGE_QUANTITY, {
      limits: { fileSize: ImageEnum.MAX_FILE_SIZE_IN_BYTES },
      fileFilter: IsValidImageMimetypeValidator.validate,
    }),
  )
  @ApiParam(UserByIdParam)
  @ApiConsumes('multipart/form-data')
  @ApiProduces('application/json')
  @ApiCreatedResponse(CreateAnnouncementResponse)
  @ApiBadRequestResponse(BadRequestValidationErrorResponse)
  @ApiNotFoundResponse(UserNotFoundErrorResponse)
  @ApiInternalServerErrorResponse(InternalServerErrorResponse)
  async create(
    @Param() param: UserParamByIdDTO,
    @UploadedFiles() images: Express.Multer.File[],
    @Body() body: CreateAnnouncementDTO,
  ) {
    body.images = images;
    body.owner = param.user_id;
    return this._service.create(body);
  }

  @Get()
  @ApiParam(UserByIdParam)
  @ApiQuery(ApiQueryParam)
  @ApiOkResponse(FindAnnouncementResponse)
  async find(
    @Param() param: UserParamByIdDTO,
    @MongoQuery() query: MongoQueryModel,
  ) {
    query.filter = { ...query.filter, owner: param.user_id };
    return this._service.findWithQuery(query);
  }

  @Get(':announcement_id')
  async findById(@Param() param: FindAnnouncementDto) {
    return this._service.findById(param.announcement_id, param.user_id);
  }

  @Put(':announcement_id')
  async updateAnnouncement(
    @Param() param: FindAnnouncementDto,
    @Body() body: UpdateAnnouncementDto,
  ): Promise<object> {
    body.owner = param.user_id;
    return this._service.update(param.announcement_id, body);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':announcement_id')
  async deleteAnnouncement(@Param() param: FindAnnouncementDto) {
    return this._service.delete(param.announcement_id, param.user_id);
  }
}
