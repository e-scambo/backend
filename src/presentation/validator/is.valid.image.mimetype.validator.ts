import { BadRequestException } from '@nestjs/common';
import { ImageValidatorUtil } from './util/image.validator.util';
import { Request } from 'express';

export class IsValidImageMimetypeValidator {
  static validate(
    _: Request,
    file: Express.Multer.File,
    cb: (err: BadRequestException, isValid: boolean) => void,
  ): void {
    const isValidMimetype = ImageValidatorUtil.isValidMimetype(file.mimetype);
    if (!isValidMimetype) {
      return cb(
        new BadRequestException(
          `Invalid file format: ${
            file.mimetype.split('/')[1]
          }. The allowed formats are: jpg | jpeg | png.`,
        ),
        false,
      );
    }
    return cb(null, true);
  }
}
