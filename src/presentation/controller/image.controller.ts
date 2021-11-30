import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { ImageService } from '../../business/service/image.service';
import { DeleteImageDTO, FindImageByNameDTO } from '../dto/image.dto';
import * as stream from 'stream';

@Controller('images')
export class ImageController {
  constructor(private readonly _service: ImageService) { }

  @Get(':name')
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
    res.emit
    readStream.pipe(res);
    readStream.end(result.buffer);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('users/:user_id/announcements/:announcement_id/images/:name')
  async deleteImage(
    @Param('user_id') user: string,
    @Param('announcement_id') announcement: string,
    @Param('name') originalname: string,
  ) {
    return await this._service.deleteImage(user, announcement, originalname);
  }
}
