import { HttpStatus, INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { getId, getStr } from 'json-generator';
import { Model } from 'mongoose';
import * as Request from 'supertest';
import {
  Image,
  ImageDocument,
} from '../../src/infrastructure/schema/image.schema';
import { bootstrapTest } from '../app/image.test.app';
import { ImageMock } from '../mock/image.mock';
import {
  validateBadRequestDTOBody,
  validateNotFoundBody,
} from '../util/exception.validation.util';

describe('ImageController (e2e)', () => {
  let app: INestApplication;
  let request: Request.SuperTest<Request.Test>;
  let model: Model<ImageDocument>;
  let savedImage: any;

  beforeAll(async () => {
    app = await bootstrapTest();
    await app.init();
    request = Request(app.getHttpServer());
    model = app.get(getModelToken(Image.name));
    await model.deleteMany({});
    savedImage = await model.create({
      ...ImageMock.request,
      originalname: `IMG_${new Date().getTime()}_${getStr(16, 'hex')}_${getId(
        'objectId',
      )}.png`,
    });
  });

  afterAll(async () => {
    await Promise.all([app.close(), model.deleteMany({})]);
  });

  describe('GET /images/:name', () => {
    describe('when download a image by name', () => {
      it('should return something', async () => {
        const response = await request
          .get(`/images/${savedImage.originalname}`)
          .expect(200);

        expect(response.body).toBeInstanceOf(Buffer);
      });
    });

    describe('when image is not founded', () => {
      it('should throw a NotFoundException', async () => {
        const anotherName = `IMG_${new Date().getTime()}_${getStr(
          16,
          'hex',
        )}_${getId('objectId')}.jpg`;

        const response = await request
          .get(`/images/${anotherName}`)
          .expect(HttpStatus.NOT_FOUND);

        validateNotFoundBody(
          response.body,
          'Image not found or already removed.',
        );
      });
    });

    describe('when there are validation errors', () => {
      it('should return BadRequestException for invalid image name', async () => {
        const response = await request
          .get('/images/image.jpeg')
          .expect(HttpStatus.BAD_REQUEST);

        validateBadRequestDTOBody(response.body, [
          'name must be like: IMG_[dateTime]_[HexHash]_[objectId].[jpg,jpeg,png]',
        ]);
      });
    });
  });
});
