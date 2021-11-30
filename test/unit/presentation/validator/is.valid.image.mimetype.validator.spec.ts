import { readFileSync } from 'fs';
import { IsValidImageMimetypeValidator } from '../../../../src/presentation/validator/is.valid.image.mimetype.validator';
import { Request } from 'express';

describe('IsValidImageMimetypeValidator', () => {
  describe('validate()', () => {
    describe('when file contains a valid mimetype', () => {
      it('should return the result from callback', () => {
        const image = {
          mimetype: 'image/png',
          buffer: readFileSync('test/asset/nestjs.png'),
          originalname: 'nestjs.png',
        } as Express.Multer.File;

        const cb = (_: any, isValid: boolean) => isValid;

        const result = IsValidImageMimetypeValidator.validate(
          {} as Request,
          image,
          cb,
        );

        expect(result).toEqual(true);
      });
    });

    describe('when file contains invalid mimetype', () => {
      it('should return the result from callback', () => {
        const image = {
          mimetype: 'application/json',
          buffer: readFileSync('package.json'),
          originalname: 'package.json',
        } as Express.Multer.File;

        const cb = (_: any, isValid: boolean) => isValid;

        const result = IsValidImageMimetypeValidator.validate(
          {} as Request,
          image,
          cb,
        );

        expect(result).toEqual(false);
      });
    });
  });
});
