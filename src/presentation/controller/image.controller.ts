import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { ImageService } from '../../business/service/image.service';
import { FindImageByNameDTO } from '../dto/image.dto';
import * as stream from 'stream';

@Controller('images')
export class ImageController {
  constructor(private readonly _service: ImageService) {}

  @Get(':name')
  async downloadImage(
    @Param() param: FindImageByNameDTO,
    @Res() res: Response,
  ) {
    console.log('name', param.name);
    const result = await this._service.findByName(param.name);
    console.log('name reuslt', result.originalname);
    const readStream = new stream.PassThrough();
    res.set(
      'Content-Disposition',
      `attachment; filename=${result.originalname}`,
    );
    res.set('Content-Type', result.mimetype);
    readStream.pipe(res);
    readStream.end(result.buffer);
  }
}
