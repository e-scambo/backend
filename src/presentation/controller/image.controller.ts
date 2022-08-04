import { Controller, Get, Param, Res } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import * as stream from 'stream';
import { ImageService } from '../../business/service/image.service';
import { FindImageByNameDTO } from '../dto/image.dto';
import { ImageByNameParam } from '../swagger/param/image.param';
import {
  BadRequestValidationErrorResponse,
  InternalServerErrorResponse,
} from '../swagger/response/error.response';
import {
  ImageNotFoundErrorResponse,
  ImageResponse,
} from '../swagger/response/image.response';

@Controller('images')
@ApiTags('images')
export class ImageController {
  constructor(private readonly _service: ImageService) {}

  @Get(':name')
  @ApiParam(ImageByNameParam)
  @ApiOkResponse(ImageResponse)
  @ApiInternalServerErrorResponse(InternalServerErrorResponse)
  @ApiNotFoundResponse(ImageNotFoundErrorResponse)
  @ApiBadRequestResponse(BadRequestValidationErrorResponse)
  async downloadImage(
    @Param() param: FindImageByNameDTO,
    @Res() res: Response,
  ) {
    const result = await this._service.findByName(param.name);
    const readStream = new stream.PassThrough();
    res.set(
      'Content-Disposition',
      `attachment; filename=${result.originalname}`,
    );
    res.set('Content-Type', result.mimetype);
    res.emit;
    readStream.pipe(res);
    readStream.end(result.buffer);
  }
}
