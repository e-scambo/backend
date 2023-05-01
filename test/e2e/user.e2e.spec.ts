import { HttpStatus, INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { getId, getStr } from 'json-generator';
import { Model } from 'mongoose';
import * as Request from 'supertest';
import {
  User,
  UserDocument,
} from '../../src/infrastructure/schema/user.schema';
import { bootstrapTest } from '../app/user.test.app';
import { UserMock } from '../mock/user.mock';
import {
  validateBadRequestDTOBody,
  validateConflictRequestBody,
  validateForbiddenBody,
  validateNotFoundBody,
  validateUnauthorizedBody,
} from '../util/exception.validation.util';

describe('UserController (e2e)', () => {
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

  beforeAll(async () => {
    await userModel.deleteMany({});
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

        validateSuccessBody(response.body);
        savedUser = response.body;
      });

      it('should log the created user in', async () => {
        const response = await request
          .post('/auth')
          .send(UserMock.request)
          .expect(HttpStatus.OK);

        savedUser.accessToken = response.body.access_token;
      });

      it('should return the created user (two users in the database)', async () => {
        const response = await request
          .post('/users')
          .send({ ...UserMock.request2 })
          .expect(HttpStatus.CREATED);

        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('name', UserMock.request2.name);
        expect(response.body).toHaveProperty('email', UserMock.request2.email);
        expect(response.body).not.toHaveProperty('password');
        expect(response.body).toHaveProperty('phone', UserMock.request2.phone);
        expect(response.body).toHaveProperty('state', UserMock.request2.state);
        expect(response.body).toHaveProperty('city', UserMock.request2.city);
      });
    });

    describe('when user already exists', () => {
      it('should return BadRequestException', async () => {
        const response = await request
          .post('/users')
          .send(UserMock.request)
          .expect(HttpStatus.CONFLICT);

        validateConflictRequestBody(
          response.body,
          'An user with this email or phone already exists.',
        );
      });
    });

    describe('when validation error occurs', () => {
      it('should return BadRequestException for does not inform required params', async () => {
        const response = await request
          .post('/users')
          .send({
            name: null,
            email: null,
            password: null,
            city: null,
            state: null,
            phone: null,
          })
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
          .send({ ...UserMock.request, password: 'Hllo-+worD*<br>' })

          .expect(HttpStatus.BAD_REQUEST);

        validateBadRequestDTOBody(response.body, [
          'The password must contain at least one digit.',
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
          .get(`/users/${savedUser.id}`)
          .expect(HttpStatus.OK);

        validateSuccessBody(response.body);
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

    describe('when there are validation errors', () => {
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
    describe('when update a user by id is successful', () => {
      it('should return the updated user', async () => {
        const response = await request
          .put(`/users/${savedUser.id}`)
          .set('Authorization', 'Bearer ' + savedUser.accessToken)
          .send({ name: UserMock.request.name })
          .expect(HttpStatus.OK);
        validateSuccessBody(response.body);
      });
    });

    describe('when another user contains the same unique fields', () => {
      it('should return BadRequestException for same email', async () => {
        const response = await request
          .put(`/users/${savedUser.id}`)
          .set('Authorization', 'Bearer ' + savedUser.accessToken)
          .send({ email: UserMock.request2.email })
          .expect(HttpStatus.CONFLICT);

        validateConflictRequestBody(
          response.body,
          'An user with this email or phone already exists.',
        );
      });

      it('should return BadRequestException for same phone', async () => {
        const response = await request
          .put(`/users/${savedUser.id}`)
          .set('Authorization', 'Bearer ' + savedUser.accessToken)
          .send({ phone: UserMock.request2.phone })
          .expect(HttpStatus.CONFLICT);

        validateConflictRequestBody(
          response.body,
          'An user with this email or phone already exists.',
        );
      });
    });

    describe('when the user does not exists', () => {
      //under the current configuration this is not possible,
      //in order to make this request proceed we would have to have a token
      //generated with a non existent objectId(), thus this will never happen
      it("should return Unauthorized exception when the ids don't match", async () => {
        const response = await request
          .put(`/users/${getId('objectId')}`)
          .set('Authorization', 'Bearer ' + savedUser.accessToken)
          .send({ name: UserMock.request.name })
          .expect(HttpStatus.FORBIDDEN);
        validateForbiddenBody(
          response.body,
          "A user cannot alter another's user data.",
        );
      });
    });

    describe('when validation error occurs', () => {
      //given that guards are called before pipes, it will fall under ids.match guard
      //it ends returning an unauthorized exception.
      it('should return UnauthorizedException for invalid id', async () => {
        const response = await request
          .put('/users/123')
          .set('Authorization', 'Bearer ' + savedUser.accessToken)
          .send({ phone: UserMock.request.phone })
          .expect(HttpStatus.FORBIDDEN);
        validateForbiddenBody(
          response.body,
          "A user cannot alter another's user data.",
        );
      });

      it('it should return BadRequestException for invalid name', async () => {
        const response = await request
          .put(`/users/${savedUser.id}`)
          .set('Authorization', 'Bearer ' + savedUser.accessToken)
          .send({ name: ' 1nv4l1d  n4m3 ' })
          .expect(HttpStatus.BAD_REQUEST);

        validateBadRequestDTOBody(response.body, [
          'name must contains letters and a single space between words',
        ]);
      });

      it('it should return BadRequestException for invalid email', async () => {
        const response = await request
          .put(`/users/${savedUser.id}`)
          .set('Authorization', 'Bearer ' + savedUser.accessToken)
          .send({ email: 'invalid' })
          .expect(HttpStatus.BAD_REQUEST);

        validateBadRequestDTOBody(response.body, ['email must be an email']);
      });

      it('it should return BadRequestException for send password', async () => {
        const response = await request
          .put(`/users/${savedUser.id}`)
          .set('Authorization', 'Bearer ' + savedUser.accessToken)
          .send({ password: 'n3wp4ssw0rd' })
          .expect(HttpStatus.BAD_REQUEST);

        validateBadRequestDTOBody(response.body, [
          'password cannot be updated here, please use the proper endpoint for this operation',
        ]);
      });

      it('it should return BadRequestException for invalid city', async () => {
        const response = await request
          .put(`/users/${savedUser.id}`)
          .set('Authorization', 'Bearer ' + savedUser.accessToken)
          .send({ city: '  1n@v4l1d C1ty12321 ' })
          .expect(HttpStatus.BAD_REQUEST);

        validateBadRequestDTOBody(response.body, [
          'city must contains letters and a single space between words',
        ]);
      });

      it('it should return BadRequestException for invalid state', async () => {
        const response = await request
          .put(`/users/${savedUser.id}`)
          .set('Authorization', 'Bearer ' + savedUser.accessToken)
          .send({ state: '  1n@v4l1d St4t3 ' })
          .expect(HttpStatus.BAD_REQUEST);

        validateBadRequestDTOBody(response.body, [
          'state must contains letters and a single space between words',
        ]);
      });

      it('it should return BadRequestException for invalid phone', async () => {
        const response = await request
          .put(`/users/${savedUser.id}`)
          .set('Authorization', 'Bearer ' + savedUser.accessToken)
          .send({ phone: '83999988123asd88888577' })
          .expect(HttpStatus.BAD_REQUEST);

        validateBadRequestDTOBody(response.body, [
          'phone must follow the pattern (XX) 9XXXX-XXXX or (XX) XXXX-XXXX and the ddd must be betwween 11 and 99',
        ]);
      });
    });
  });
  describe('PATCH /users/:user_id/password', () => {
    let newPassword: any;
    let currentPassword: any;
    beforeAll(async () => {
      currentPassword = UserMock.request.password;
      newPassword = getStr(12) + '@3Ds';
    });

    describe(`when changing a user's password successfully`, () => {
      it(`should change user's password`, async () => {
        const response = await request
          .patch(`/users/${savedUser.id}/password`)
          .set('Authorization', 'Bearer ' + savedUser.accessToken)
          .send({
            current_password: currentPassword,
            new_password: newPassword,
          })
          .expect(HttpStatus.NO_CONTENT);
        savedUser.password = newPassword;
        expect(response.body).toMatchObject({});
      });
    });

    describe(`when changing a user's password with incorrect current password`, () => {
      it('should return forbidden exception', async () => {
        const response = await request
          .patch(`/users/${savedUser.id}/password`)
          .set('Authorization', 'Bearer ' + savedUser.accessToken)
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
  });

  describe('DELETE /users/:user_id', () => {
    describe('when there area validation errors', () => {
      //given that guards are called before pipes, it will fall under ids.match guard
      //it ends returning an unauthorized exception.
      it('should return BadRequestException for does not inform required params', async () => {
        const response = await request
          .delete('/users/123')
          .set('Authorization', 'Bearer ' + savedUser.accessToken)
          .expect(HttpStatus.FORBIDDEN);

        validateForbiddenBody(
          response.body,
          "A user cannot alter another's user data.",
        );
      });
    });

    describe('when delete a user by id is successful', () => {
      it('should return nothing', async () => {
        const response = await request
          .delete(`/users/${savedUser.id}`)
          .set('Authorization', 'Bearer ' + savedUser.accessToken)
          .expect(HttpStatus.NO_CONTENT);

        expect(response.body).toMatchObject({});
      });
    });

    //under the current configuration this is not possible,
    //in order to make this request proceed we would have to have a token
    //generated with a non existent objectId(), thus this will never happen
    //and user can only delete itself, so we can have a registered user trying to delete
    //another one regardless if the user_id informed is attached to a real user,
    // it returns unauthorized
    describe('when the user is not founded on database', () => {
      it('should return UnauthorizedException', async () => {
        const response = await request
          .delete(`/users/${savedUser.id}`)
          .set('Authorization', 'Bearer ' + savedUser.accessToken)
          .expect(HttpStatus.UNAUTHORIZED);

        validateUnauthorizedBody(
          response.body,
          'JsonWebTokenError: invalid token.',
        );
      });
      //since the user no longer exists, it fails that token validation given that
      //the token validation check for the user;
      it('should return unauthorized exception', async () => {
        const response = await request
          .patch(`/users/${savedUser.id}/password`)
          .set('Authorization', 'Bearer ' + savedUser.accessToken)
          .send({
            current_password: savedUser.newPassword, //current password
            new_password: UserMock.request.password,
          })
          .expect(HttpStatus.UNAUTHORIZED);

        validateUnauthorizedBody(
          response.body,
          'JsonWebTokenError: invalid token.',
        );
      });
    });
  });

  const validateSuccessBody = (body: any) => {
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('name', UserMock.request.name);
    expect(body).toHaveProperty('email', UserMock.request.email);
    expect(body).not.toHaveProperty('password');
    expect(body).toHaveProperty('phone', UserMock.request.phone);
    expect(body).toHaveProperty('state', UserMock.request.state);
    expect(body).toHaveProperty('city', UserMock.request.city);
  };
});
