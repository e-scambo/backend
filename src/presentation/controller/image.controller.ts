import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import * as stream from 'stream';
import { ImageService } from '../../business/service/image.service';
import { FindImageByNameDTO } from '../dto/image.dto';

@Controller('images')
@ApiTags('images')
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
}
