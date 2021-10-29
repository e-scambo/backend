import { HttpStatus, INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { getId, getStr } from 'json-generator';
import { Model } from 'mongoose';
import * as Request from 'supertest';
import { PasswordUtil } from '../../src/business/util/password.util';
import {
  User,
  UserDocument,
} from '../../src/infrastructure/schema/user.schema';
import { bootstrapTest } from '../app/user.test.app';
import { UserMock } from '../mock/user.mock';
import {
  validateBadRequestBody,
  validateBadRequestDTOBody,
  validateForbiddenBody,
  validateNotFoundBody,
} from '../util/exception.validation.util';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let request: Request.SuperTest<Request.Test>;
  let userModel: Model<UserDocument>;
  let savedUser: any;

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
        savedUser = response.body;
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
          .send({ name: ' 1nv4l1d  n4m3 ' })
          .expect(HttpStatus.BAD_REQUEST);

        validateBadRequestDTOBody(response.body, [
          'name must contains letters and a single space between words',
        ]);
      });

      it('it should return BadRequestException for invalid email', async () => {
        const response = await request
          .post('/users')
          .send({ email: 'invalid' })
          .expect(HttpStatus.BAD_REQUEST);

        validateBadRequestDTOBody(response.body, ['email must be an email']);
      });

      it('it should return BadRequestException for invalid password', async () => {
        const response = await request
          .post('/users')
          .send({ password: 'H3llo-+worD*<br>' })
          .expect(HttpStatus.BAD_REQUEST);

        validateBadRequestDTOBody(response.body, [
          'password must contains letters, numbers and the special characters: !@#$%&*',
        ]);
      });

      it('it should return BadRequestException for invalid city', async () => {
        const response = await request
          .post('/users')
          .send({ city: '  1n@v4l1d C1ty12321 ' })
          .expect(HttpStatus.BAD_REQUEST);

        validateBadRequestDTOBody(response.body, [
          'city must contains letters and a single space between words',
        ]);
      });

      it('it should return BadRequestException for invalid state', async () => {
        const response = await request
          .post('/users')
          .send({ state: '  1n@v4l1d St4t3 ' })
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
          'phone must follow the pattern (XX) 9XXXX-XXXX or (XX) XXXX-XXXX and the ddd must be betwween 11 and 99',
        ]);
      });
    });
  });

  describe('GET /users/:user_id', () => {
    describe('when get a user by id is successful', () => {
      it('should return the founded user', async () => {
        const response = await request
          .get(`/users/${savedUser._id}`)
          .expect(HttpStatus.OK);
        validateSuccess(response.body);
      });
    });

    describe('when the user is not founded on database', () => {
      it('should return NotFoundException', async () => {
        const response = await request
          .get(`/users/${getId('objectId')}`)
          .expect(HttpStatus.NOT_FOUND);

        validateNotFoundBody(
          response.body,
          'User not found or already removed.',
        );
      });
    });

    describe('when there area validation errors', () => {
      it('should return BadRequestException for invalid id', async () => {
        const response = await request
          .get('/users/123')
          .expect(HttpStatus.BAD_REQUEST);

        validateBadRequestDTOBody(response.body, [
          'user_id must be a mongodb id',
        ]);
      });
    });
  });

  describe('PUT /users/:user_id', () => {
    afterAll(async () => {
      savedUser = await saveUser();
    });

    describe('when update a user by id is successful', () => {
      it('should return the updated user', async () => {
        const response = await request
          .put(`/users/${savedUser._id}`)
          .send({ name: UserMock.request.name })
          .expect(HttpStatus.OK);
        validateSuccess(response.body);
      });
    });

    describe('when another user contains the same unique fields', () => {
      it('should return BadRequestException for same email', async () => {
        const response = await request
          .put(`/users/${getId('objectId')}`)
          .send({ email: UserMock.request.email })
          .expect(HttpStatus.BAD_REQUEST);

        validateBadRequestBody(
          response.body,
          'An user with this email or phone already exists.',
        );
      });

      it('should return BadRequestException for same phone', async () => {
        const response = await request
          .put(`/users/${getId('objectId')}`)
          .send({ phone: UserMock.request.phone })
          .expect(HttpStatus.BAD_REQUEST);

        validateBadRequestBody(
          response.body,
          'An user with this email or phone already exists.',
        );
      });
    });

    describe('when the user does not exists', () => {
      it('should return NOtFoundException', async () => {
        await userModel.deleteMany({});

        const response = await request
          .put(`/users/${savedUser._id}`)
          .send({ name: UserMock.request.name })
          .expect(HttpStatus.NOT_FOUND);
        validateNotFoundBody(
          response.body,
          'User not found or already removed.',
        );
      });
    });

    describe('when validation error occurs', () => {
      it('should return BadRequestException for invalid id', async () => {
        const response = await request
          .put('/users/123')
          .send({ phone: UserMock.request.phone })
          .expect(HttpStatus.BAD_REQUEST);

        validateBadRequestDTOBody(response.body, [
          'user_id must be a mongodb id',
        ]);
      });

      it('it should return BadRequestException for invalid name', async () => {
        const response = await request
          .put(`/users/${savedUser._id}`)
          .send({ name: ' 1nv4l1d  n4m3 ' })
          .expect(HttpStatus.BAD_REQUEST);

        validateBadRequestDTOBody(response.body, [
          'name must contains letters and a single space between words',
        ]);
      });

      it('it should return BadRequestException for invalid email', async () => {
        const response = await request
          .put(`/users/${savedUser._id}`)
          .send({ email: 'invalid' })
          .expect(HttpStatus.BAD_REQUEST);

        validateBadRequestDTOBody(response.body, ['email must be an email']);
      });

      it('it should return BadRequestException for send password', async () => {
        const response = await request
          .put(`/users/${savedUser._id}`)
          .send({ password: 'n3wp4ssw0rd' })
          .expect(HttpStatus.BAD_REQUEST);

        validateBadRequestDTOBody(response.body, [
          'password cannot be updated here, please use the proper endpoint for this operation',
        ]);
      });

      it('it should return BadRequestException for invalid city', async () => {
        const response = await request
          .put(`/users/${savedUser._id}`)
          .send({ city: '  1n@v4l1d C1ty12321 ' })
          .expect(HttpStatus.BAD_REQUEST);

        validateBadRequestDTOBody(response.body, [
          'city must contains letters and a single space between words',
        ]);
      });

      it('it should return BadRequestException for invalid state', async () => {
        const response = await request
          .put(`/users/${savedUser._id}`)
          .send({ state: '  1n@v4l1d St4t3 ' })
          .expect(HttpStatus.BAD_REQUEST);

        validateBadRequestDTOBody(response.body, [
          'state must contains letters and a single space between words',
        ]);
      });

      it('it should return BadRequestException for invalid phone', async () => {
        const response = await request
          .put(`/users/${savedUser._id}`)
          .send({ phone: '83999988123asd88888577' })
          .expect(HttpStatus.BAD_REQUEST);

        validateBadRequestDTOBody(response.body, [
          'phone must follow the pattern (XX) 9XXXX-XXXX or (XX) XXXX-XXXX and the ddd must be betwween 11 and 99',
        ]);
      });
    });
  });

  describe('DELETE /users/:user_id', () => {
    describe('when delete a user by id is successful', () => {
      it('should return nothing', async () => {
        const response = await request
          .delete(`/users/${savedUser._id}`)
          .expect(HttpStatus.NO_CONTENT);
        expect(response.body).toMatchObject({});
      });
    });

    describe('when the user is not founded on database', () => {
      it('should return NotFoundException', async () => {
        const response = await request
          .delete(`/users/${savedUser._id}`)
          .expect(HttpStatus.NOT_FOUND);

        validateNotFoundBody(
          response.body,
          'User not found or already removed.',
        );
      });
    });

    describe('when there area validation errors', () => {
      it('should return BadRequestException for does not inform required params', async () => {
        const response = await request
          .delete('/users/123')
          .expect(HttpStatus.BAD_REQUEST);

        validateBadRequestDTOBody(response.body, [
          'user_id must be a mongodb id',
        ]);
      });
    });

    describe('PATCH /users/:user_id/password', () => {
      let newPassword: any;
      let currentPassword: any;
      beforeAll(async () => {
        await userModel.deleteMany({});
        savedUser = await saveUser();
        currentPassword = 'secretPassWord';
        newPassword = getStr(12);
      });

      describe(`when changing a user's password succsfully`, () => {
        it(`should change user's password`, async () => {
          const response = await request
            .patch(`/users/${savedUser._id}/password`)
            .send({
              current_password: currentPassword,
              new_password: newPassword,
            })
            .expect(HttpStatus.NO_CONTENT);
          expect(response.body).toMatchObject({});
        });
      });

      describe(`when changing a user's password with incorrect current password`, () => {
        it('should return forbidden exception', async () => {
          const response = await request
            .patch(`/users/${savedUser._id}/password`)
            .send({
              current_password: currentPassword,
              new_password: newPassword,
            })
            .expect(HttpStatus.FORBIDDEN);
          validateForbiddenBody(
            response.body,
            'The password informed does not match with current password.',
          );
        });
      });

      describe(`when changing user's passord`, () => {
        it('should return not found exception', async () => {
          await userModel.deleteMany({});
          const response = await request
            .patch(`/users/${savedUser._id}/password`)
            .send({
              current_password: currentPassword,
              new_password: newPassword,
            })
            .expect(HttpStatus.NOT_FOUND);

          validateNotFoundBody(
            response.body,
            'User not found or already removed.',
          );
        });
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

  const saveUser = async () => {
    const newUser = { ...UserMock.request };
    newUser.password = PasswordUtil.encrypt(newUser.password);
    return userModel.create(newUser);
  };
});
