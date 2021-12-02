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
import { IsValidImageMimetypeValidator } from '../validator/is.valid.image.mimetype.validator';

@Controller('users/:user_id/announcements')
@UseInterceptors(AnnouncementInterceptor)
export class UserAnnouncementController {
  constructor(private readonly _service: AnnouncementService) { }

  @Post()
  @UseInterceptors(
    FilesInterceptor('images', ImageEnum.MAX_IMAGE_QUANTITY, {
      limits: { fileSize: ImageEnum.MAX_FILE_SIZE_IN_BYTES },
      fileFilter: IsValidImageMimetypeValidator.validate,
    }),
  )
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

  @HttpCode(HttpStatus.CREATED)
  @Post(":announcement_id/images")
  @UseInterceptors(
    FileInterceptor('image', { fileFilter: IsValidImageMimetypeValidator.validate })
  )
  async addImage(
    @Param() param: AnnouncementImageDTO,
    @UploadedFile() image: Express.Multer.File) {
    return await this._service.addImage(param.user_id, param.announcement_id, image)
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':announcement_id/images/:name')
  async deleteImage(
    @Param() param: DeleteAnnouncementImageDTO,
  ) {
    return await this._service.deleteImage(param.user_id, param.announcement_id, param.name);
  }
}
