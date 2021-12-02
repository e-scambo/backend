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
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiProduces,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { MongoQuery, MongoQueryModel } from 'nest-mongo-query-parser';
import { AnnouncementService } from '../../business/service/announcement.service';
import { AnnouncementInterceptor } from '../../config/interceptor/announcement.interceptor';
import {
  AnnouncementImageDTO,
  CreateAnnouncementDTO,
  DeleteAnnouncementImageDTO,
  FindAnnouncementDto,
  UpdateAnnouncementDto,
} from '../dto/announcement.dto';
import { UserParamByIdDTO } from '../dto/user.dto';
import { ImageEnum } from '../enum/image.enum';
import { AnnouncementByIdParam } from '../swagger/param/announcement.param';
import { ImageByNameParam } from '../swagger/param/image.param';
import { ApiQueryParam } from '../swagger/param/query.param';
import { UserByIdParam } from '../swagger/param/user.param';
import { AddImageToAnnouncementRequest } from '../swagger/request/user.announcement.request';
import {
  BadRequestValidationErrorResponse,
  InternalServerErrorResponse,
} from '../swagger/response/error.response';
import {
  AnnouncementAddImageBadRequestErrorResponse,
  AnnouncementNotFoundErrorResponse,
  AnnouncementRemoveImageNotFoundErrorResponse,
  AnnouncementRemoveImageUnauthorizedErrorResponse,
  CreateAnnouncementResponse,
  DeleteOneAnnouncementResponse,
  FindAnnouncementResponse,
  FindOneAnnouncementResponse,
  UpdateOneAnnouncementResponse,
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
  @ApiBadRequestResponse(BadRequestValidationErrorResponse)
  @ApiInternalServerErrorResponse(InternalServerErrorResponse)
  async find(
    @Param() param: UserParamByIdDTO,
    @MongoQuery() query: MongoQueryModel,
  ) {
    query.filter = { ...query.filter, owner: param.user_id };
    return this._service.findWithQuery(query);
  }

  @Get(':announcement_id')
  @ApiParam(UserByIdParam)
  @ApiParam(AnnouncementByIdParam)
  @ApiOkResponse(FindOneAnnouncementResponse)
  @ApiBadRequestResponse(BadRequestValidationErrorResponse)
  @ApiNotFoundResponse(AnnouncementNotFoundErrorResponse)
  @ApiInternalServerErrorResponse(InternalServerErrorResponse)
  async findById(@Param() param: FindAnnouncementDto) {
    return this._service.findById(param.announcement_id, param.user_id);
  }

  @Put(':announcement_id')
  @ApiParam(UserByIdParam)
  @ApiParam(AnnouncementByIdParam)
  @ApiOkResponse(UpdateOneAnnouncementResponse)
  @ApiBadRequestResponse(BadRequestValidationErrorResponse)
  @ApiNotFoundResponse(AnnouncementNotFoundErrorResponse)
  @ApiInternalServerErrorResponse(InternalServerErrorResponse)
  async updateAnnouncement(
    @Param() param: FindAnnouncementDto,
    @Body() body: UpdateAnnouncementDto,
  ): Promise<object> {
    body.owner = param.user_id;
    return this._service.update(param.announcement_id, body);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':announcement_id')
  @ApiParam(UserByIdParam)
  @ApiParam(AnnouncementByIdParam)
  @ApiNoContentResponse(DeleteOneAnnouncementResponse)
  @ApiBadRequestResponse(BadRequestValidationErrorResponse)
  @ApiNotFoundResponse(AnnouncementNotFoundErrorResponse)
  @ApiInternalServerErrorResponse(InternalServerErrorResponse)
  async deleteAnnouncement(@Param() param: FindAnnouncementDto) {
    return this._service.delete(param.announcement_id, param.user_id);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post(':announcement_id/images')
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: IsValidImageMimetypeValidator.validate,
    }),
  )
  @ApiParam(UserByIdParam)
  @ApiParam(AnnouncementByIdParam)
  @ApiConsumes('multipart/form-data')
  @ApiProduces('application/json')
  @ApiBody(AddImageToAnnouncementRequest)
  @ApiOkResponse(UpdateOneAnnouncementResponse)
  @ApiBadRequestResponse(AnnouncementAddImageBadRequestErrorResponse)
  @ApiNotFoundResponse(AnnouncementNotFoundErrorResponse)
  @ApiInternalServerErrorResponse(InternalServerErrorResponse)
  async addImage(
    @Param() param: AnnouncementImageDTO,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return await this._service.addImage(
      param.user_id,
      param.announcement_id,
      image,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':announcement_id/images/:name')
  @ApiParam(UserByIdParam)
  @ApiParam(AnnouncementByIdParam)
  @ApiParam(ImageByNameParam)
  @ApiOkResponse(UpdateOneAnnouncementResponse)
  @ApiBadRequestResponse(BadRequestValidationErrorResponse)
  @ApiNotFoundResponse(AnnouncementRemoveImageNotFoundErrorResponse)
  @ApiUnauthorizedResponse(AnnouncementRemoveImageUnauthorizedErrorResponse)
  @ApiInternalServerErrorResponse(InternalServerErrorResponse)
  async deleteImage(@Param() param: DeleteAnnouncementImageDTO) {
    return await this._service.deleteImage(
      param.user_id,
      param.announcement_id,
      param.name,
    );
  }
}
