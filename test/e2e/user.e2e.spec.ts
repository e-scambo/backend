import { HttpStatus, INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as Request from 'supertest';
import {
  User,
  UserDocument,
} from '../../src/infrastructure/schema/user.schema';
import { bootstrapTest } from '../app/user.test.app';
import { UserMock } from '../mock/user.mock';
import {
  validateBadRequestBody,
  validateBadRequestDTOBody,
} from '../util/exception.validation.util';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let request: Request.SuperTest<Request.Test>;
  let userModel: Model<UserDocument>;

  beforeAll(async () => {
    app = await bootstrapTest();
    await app.init();
    request = Request(app.getHttpServer());
    userModel = app.get(getModelToken(User.name));
  });

  afterAll(async () => {
    await Promise.all([app.close(), userModel.deleteMany({})]);
  });

  describe('POST /users', () => {
    describe('when create user is successful', () => {
      it('should return the created user', async () => {
        const response = await request
          .post('/users')
          .send(UserMock.request)
          .expect(HttpStatus.CREATED);

        validateSuccess(response.body);
      });
    });

    describe('when user already exists', () => {
      it('should return BadRequestException', async () => {
        const response = await request
          .post('/users')
          .send(UserMock.request)
          .expect(HttpStatus.BAD_REQUEST);

        validateBadRequestBody(
          response.body,
          'An user with this email or phone already exists.',
        );
      });
    });

    describe('when validation error occurs', () => {
      it('should return BadRequestException for does not inform required params', async () => {
        const response = await request
          .post('/users')
          .send()
          .expect(HttpStatus.BAD_REQUEST);

        validateBadRequestDTOBody(response.body, [
          'name should not be null or undefined',
          'email should not be null or undefined',
          'password should not be null or undefined',
          'city should not be null or undefined',
          'state should not be null or undefined',
          'phone should not be null or undefined',
        ]);
      });

      it('it should return BadRequestException for invalid name', async () => {
        const response = await request
          .post('/users')
          .send({ ...UserMock.request, name: ' 1nv4l1d  n4m3 ' })
          .expect(HttpStatus.BAD_REQUEST);

        validateBadRequestDTOBody(response.body, [
          'name must contains letters and a single space between words',
        ]);
      });

      it('it should return BadRequestException for invalid email', async () => {
        const response = await request
          .post('/users')
          .send({ ...UserMock.request, email: 'invalid' })
          .expect(HttpStatus.BAD_REQUEST);

        validateBadRequestDTOBody(response.body, ['email must be an email']);
      });

      it('it should return BadRequestException for invalid password', async () => {
        const response = await request
          .post('/users')
          .send({ ...UserMock.request, password: 'H3llo-+worD*<br>' })
          .expect(HttpStatus.BAD_REQUEST);

        validateBadRequestDTOBody(response.body, [
          'password must contains letters, numbers and the special characters: !@#$%&*',
        ]);
      });

      it('it should return BadRequestException for invalid city', async () => {
        const response = await request
          .post('/users')
          .send({ ...UserMock.request, city: '  1n@v4l1d C1ty12321 ' })
          .expect(HttpStatus.BAD_REQUEST);

        validateBadRequestDTOBody(response.body, [
          'city must contains letters and a single space between words',
        ]);
      });

      it('it should return BadRequestException for invalid state', async () => {
        const response = await request
          .post('/users')
          .send({ ...UserMock.request, state: '  1n@v4l1d St4t3 ' })
          .expect(HttpStatus.BAD_REQUEST);

        validateBadRequestDTOBody(response.body, [
          'state must contains letters and a single space between words',
        ]);
      });

      it('it should return BadRequestException for invalid phone', async () => {
        const response = await request
          .post('/users')
          .send({ ...UserMock.request, phone: '83999988123asd88888577' })
          .expect(HttpStatus.BAD_REQUEST);

        validateBadRequestDTOBody(response.body, [
          'phone phone must follow the pattern (XX) 9XXXX-XXXX or (XX) XXXX-XXXX and the ddd must be betwween 11 and 99',
        ]);
      });
    });
  });

  const validateSuccess = (body: any) => {
    expect(body).toHaveProperty('_id');
    expect(body).toHaveProperty('name', UserMock.request.name);
    expect(body).toHaveProperty('email', UserMock.request.email);
    expect(body).not.toHaveProperty('password');
    expect(body).toHaveProperty('phone', UserMock.request.phone);
    expect(body).toHaveProperty('state', UserMock.request.state);
    expect(body).toHaveProperty('city', UserMock.request.city);
  };
});
