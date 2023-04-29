import { HttpStatus, INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { getId } from 'json-generator';
import { Model } from 'mongoose';
import * as Request from 'supertest';
import {
  Announcement,
  AnnouncementDocument,
} from '../../src/infrastructure/schema/announcement.schema';
import {
  Image,
  ImageDocument,
} from '../../src/infrastructure/schema/image.schema';
import {
  User,
  UserDocument,
} from '../../src/infrastructure/schema/user.schema';
import { bootstrapTest } from '../app/user.announcement.test.app';
import { AnnouncementMock } from '../mock/announcement.mock';
import { UserMock } from '../mock/user.mock';
import {
  validateBadRequestBody,
  validateBadRequestDTOBody,
  validateNotFoundBody,
} from '../util/exception.validation.util';

describe('UserAnnouncementController (e2e)', () => {
  let app: INestApplication;
  let request: Request.SuperTest<Request.Test>;
  let model: Model<AnnouncementDocument>;
  let imageModel: Model<ImageDocument>;
  let userModel: Model<UserDocument>;
  let savedUser: any;
  let savedAnnouncement: any;

  beforeAll(async () => {
    app = await bootstrapTest();
    await app.init();
    request = Request(app.getHttpServer());
    model = app.get(getModelToken(Announcement.name));
    imageModel = app.get(getModelToken(Image.name));
    userModel = app.get(getModelToken(User.name));
    savedUser = await userModel.create(UserMock.request);
  });

  afterAll(async () => {
    await Promise.all([
      app.close(),
      model.deleteMany({}),
      imageModel.deleteMany({}),
      userModel.deleteMany({}),
    ]);
  });

  describe('POST /users/:user_id/announcements', () => {
    describe('when create announcement is successful', () => {
      it('should return the created announcement', async () => {
        const response = await request
          .post(`/users/${savedUser.id}/announcements`)
          .set('Content-Type', 'multipart/form-data')
          .attach('images', 'test/asset/nestjs.png')
          .field('title', AnnouncementMock.request.title)
          .field('description', AnnouncementMock.request.description)
          .field('category', AnnouncementMock.request.category)
          .field('localization', AnnouncementMock.request.localization)
          .field('type', AnnouncementMock.request.type)
          .expect(HttpStatus.CREATED);

        validateSuccessBody(response.body);
        savedAnnouncement = response.body;
      });
    });

    describe('when user is not found', () => {
      it('should return NotFoundException', async () => {
        const response = await request
          .post(`/users/${getId('objectId')}/announcements`)
          .set('Content-Type', 'multipart/form-data')
          .attach('images', 'test/asset/nestjs.png')
          .field('title', AnnouncementMock.request.title)
          .field('description', AnnouncementMock.request.description)
          .field('category', AnnouncementMock.request.category)
          .field('localization', AnnouncementMock.request.localization)
          .field('type', AnnouncementMock.request.type)
          .expect(HttpStatus.NOT_FOUND);

        validateNotFoundBody(
          response.body,
          'User not found or already removed.',
        );
      });
    });

    describe('when there are validation errors', () => {
      it('should return BadRequestException when required params are not informed', async () => {
        const response = await request
          .post(`/users/${getId('objectId')}/announcements`)
          .expect(HttpStatus.BAD_REQUEST);

        validateBadRequestDTOBody(response.body, [
          'title should not be null or undefined',
          'description should not be null or undefined',
          'type should not be null or undefined',
          'category should not be null or undefined',
          'localization should not be null or undefined',
        ]);
      });

      it('should return BadRequestException for invalid title', async () => {
        const response = await request
          .post(`/users/${getId('objectId')}/announcements`)
          .set('Content-Type', 'multipart/form-data')
          .attach('images', 'test/asset/nestjs.png')
          .field('title', '<h1>hello</h1>')
          .field('description', AnnouncementMock.request.description)
          .field('category', AnnouncementMock.request.category)
          .field('localization', AnnouncementMock.request.localization)
          .field('type', AnnouncementMock.request.type)
          .expect(HttpStatus.BAD_REQUEST);

        validateBadRequestDTOBody(response.body, [
          `title must contains letters, numbers, space and the special characters: "'?!@#$%-_+*:;,./|[]{}()`,
        ]);
      });

      it('should return BadRequestException for invalid description', async () => {
        const response = await request
          .post(`/users/${getId('objectId')}/announcements`)
          .set('Content-Type', 'multipart/form-data')
          .attach('images', 'test/asset/nestjs.png')
          .field('title', AnnouncementMock.request.title)
          .field('description', '<h1>hello</h1>')
          .field('category', AnnouncementMock.request.category)
          .field('localization', AnnouncementMock.request.localization)
          .field('type', AnnouncementMock.request.type)
          .expect(HttpStatus.BAD_REQUEST);

        validateBadRequestDTOBody(response.body, [
          `description must contains letters, numbers, space and the special characters: "'?!@#$%-_+*:;,./|[]{}()`,
        ]);
      });

      it('should return BadRequestException for invalid type', async () => {
        const response = await request
          .post(`/users/${getId('objectId')}/announcements`)
          .set('Content-Type', 'multipart/form-data')
          .attach('images', 'test/asset/nestjs.png')
          .field('title', AnnouncementMock.request.title)
          .field('description', AnnouncementMock.request.description)
          .field('category', AnnouncementMock.request.category)
          .field('localization', AnnouncementMock.request.localization)
          .field('type', 'others')
          .expect(HttpStatus.BAD_REQUEST);

        validateBadRequestDTOBody(response.body, [
          'type must be one of the following values: product, service',
        ]);
      });

      it('should return BadRequestException for invalid category', async () => {
        const response = await request
          .post(`/users/${getId('objectId')}/announcements`)
          .set('Content-Type', 'multipart/form-data')
          .attach('images', 'test/asset/nestjs.png')
          .field('title', AnnouncementMock.request.title)
          .field('description', AnnouncementMock.request.description)
          .field('category', '1nv4lid  C4t3g0ry ')
          .field('localization', AnnouncementMock.request.localization)
          .field('type', AnnouncementMock.request.type)
          .expect(HttpStatus.BAD_REQUEST);

        validateBadRequestDTOBody(response.body, [
          'category must contains letters and a single space between words',
        ]);
      });

      it('should return BadRequestException for invalid localization', async () => {
        const response = await request
          .post(`/users/${getId('objectId')}/announcements`)
          .set('Content-Type', 'multipart/form-data')
          .attach('images', 'test/asset/nestjs.png')
          .field('title', AnnouncementMock.request.title)
          .field('description', AnnouncementMock.request.description)
          .field('category', AnnouncementMock.request.category)
          .field('localization', ' 1nv4lid _L0c4l1z4t10n ')
          .field('type', AnnouncementMock.request.type)
          .expect(HttpStatus.BAD_REQUEST);

        validateBadRequestDTOBody(response.body, [
          'localization must contains letters, dashes and a single space between words or dashes',
        ]);
      });

      it('should return BadRequestException for invalid file format', async () => {
        const response = await request
          .post(`/users/${savedUser.id}/announcements`)
          .set('Content-Type', 'multipart/form-data')
          .attach('images', 'package.json')
          .field('title', AnnouncementMock.request.title)
          .field('description', AnnouncementMock.request.description)
          .field('category', AnnouncementMock.request.category)
          .field('localization', AnnouncementMock.request.localization)
          .field('type', AnnouncementMock.request.type)
          .expect(HttpStatus.BAD_REQUEST);

        validateBadRequestBody(
          response.body,
          'Invalid file format: json. The allowed formats are: jpg | jpeg | png.',
        );
      });

      it('should return BadRequestException for invalid field for images', async () => {
        const response = await request
          .post(`/users/${getId('objectId')}/announcements`)
          .set('Content-Type', 'multipart/form-data')
          .attach('files', 'test/asset/nestjs.png')
          .field('title', AnnouncementMock.request.title)
          .field('description', AnnouncementMock.request.description)
          .field('category', AnnouncementMock.request.category)
          .field('localization', AnnouncementMock.request.localization)
          .field('type', AnnouncementMock.request.type)
          .expect(HttpStatus.BAD_REQUEST);

        validateBadRequestBody(response.body, 'Unexpected field');
      });
    });
  });

  describe('GET /users/:user_id/announcements', () => {
    describe('when find is successful', () => {
      it('should return a list of announcements', async () => {
        const response = await request
          .get(`/users/${savedUser.id}/announcements`)
          .expect(HttpStatus.OK);

        expect(response.body).toBeInstanceOf(Array);
        expect(response.body).toHaveLength(1);
        validateSuccessBody(response.body[0]);
      });
    });

    describe('when there are no saved announcements', () => {
      it('should return an empty list', async () => {
        const response = await request
          .get(`/users/${getId('objectId')}/announcements`)
          .expect(HttpStatus.OK);

        expect(response.body).toBeInstanceOf(Array);
        expect(response.body).toHaveLength(0);
      });
    });

    describe('when there are validation errors', () => {
      it('should return BadRequestException for invalid user id', async () => {
        const response = await request
          .get('/users/123/announcements')
          .expect(HttpStatus.BAD_REQUEST);

        validateBadRequestDTOBody(response.body, [
          'user_id must be a mongodb id',
        ]);
      });
    });
  });

  describe('GET /users/:user_id/announcements/:announcement_id', () => {
    describe('when findById is successful', () => {
      it('should return the founded announcement', async () => {
        const response = await request
          .get(`/users/${savedUser.id}/announcements/${savedAnnouncement.id}`)
          .expect(HttpStatus.OK);

        validateSuccessBody(response.body);
      });
    });

    describe('when the announcement from user is not founded', () => {
      it('should return NotFoundException', async () => {
        const response = await request
          .get(`/users/${getId('objectId')}/announcements/${getId('objectId')}`)
          .expect(HttpStatus.NOT_FOUND);

        validateNotFoundBody(
          response.body,
          'Announcement not found or already removed.',
        );
      });
    });

    describe('when there are validation errors', () => {
      it('should return BadRequestException for invalid user id', async () => {
        const response = await request
          .get(`/users/123/announcements/${getId('objectId')}`)
          .expect(HttpStatus.BAD_REQUEST);

        validateBadRequestDTOBody(response.body, [
          'user_id must be a mongodb id',
        ]);
      });

      it('should return BadRequestException for invalid announcement id', async () => {
        const response = await request
          .get(`/users/${getId('objectId')}/announcements/123`)
          .expect(HttpStatus.BAD_REQUEST);

        validateBadRequestDTOBody(response.body, [
          'announcement_id must be a mongodb id',
        ]);
      });
    });
  });

  describe('PUT /users/:user_id/announcements/:announcement_id', () => {
    describe('when updateAnnouncement is successful', () => {
      it('should return the updated announcement', async () => {
        const response = await request
          .put(`/users/${savedUser.id}/announcements/${savedAnnouncement.id}`)
          .send({ title: AnnouncementMock.request.title })
          .expect(HttpStatus.OK);

        validateSuccessBody(response.body);
      });
    });

    describe('when announcement is not founded', () => {
      it('should return NotFoundException', async () => {
        const response = await request
          .put(`/users/${savedUser.id}/announcements/${getId('objectId')}`)
          .send({ title: AnnouncementMock.request.title })
          .expect(HttpStatus.NOT_FOUND);

        validateNotFoundBody(
          response.body,
          'Announcement not found or already removed.',
        );
      });
    });

    describe('when there are validation errors', () => {
      it('should return BadRequestException for invalid user id', async () => {
        const response = await request
          .put(`/users/123/announcements/${savedAnnouncement.id}`)
          .send({ title: AnnouncementMock.request.title })
          .expect(HttpStatus.BAD_REQUEST);

        validateBadRequestDTOBody(response.body, [
          'user_id must be a mongodb id',
        ]);
      });

      it('should return BadRequestException for invalid announcement id', async () => {
        const response = await request
          .put(`/users/${savedUser.id}/announcements/123`)
          .send({ title: AnnouncementMock.request.title })
          .expect(HttpStatus.BAD_REQUEST);

        validateBadRequestDTOBody(response.body, [
          'announcement_id must be a mongodb id',
        ]);
      });

      it('should return BadRequestException for invalid title', async () => {
        const response = await request
          .put(`/users/${savedUser.id}/announcements/${savedAnnouncement.id}`)
          .send({ title: '<h1>hello</h1>' })
          .expect(HttpStatus.BAD_REQUEST);

        validateBadRequestDTOBody(response.body, [
          `title must contains letters, numbers, space and the special characters: "'?!@#$%-_+*:;,./|[]{}()`,
        ]);
      });

      it('should return BadRequestException for invalid description', async () => {
        const response = await request
          .put(`/users/${savedUser.id}/announcements/${savedAnnouncement.id}`)
          .send({ description: '<h1>hello</h1>' })
          .expect(HttpStatus.BAD_REQUEST);

        validateBadRequestDTOBody(response.body, [
          `description must contains letters, numbers, space and the special characters: "'?!@#$%-_+*:;,./|[]{}()`,
        ]);
      });

      it('should return BadRequestException for invalid type', async () => {
        const response = await request
          .put(`/users/${savedUser.id}/announcements/${savedAnnouncement.id}`)
          .send({ type: 'others' })
          .expect(HttpStatus.BAD_REQUEST);

        validateBadRequestDTOBody(response.body, [
          'type must be one of the following values: product, service',
        ]);
      });

      it('should return BadRequestException for invalid category', async () => {
        const response = await request
          .put(`/users/${savedUser.id}/announcements/${savedAnnouncement.id}`)
          .send({ category: '1nv4lid  C4t3g0ry ' })
          .expect(HttpStatus.BAD_REQUEST);

        validateBadRequestDTOBody(response.body, [
          'category must contains letters and a single space between words',
        ]);
      });

      it('should return BadRequestException for invalid localization', async () => {
        const response = await request
          .put(`/users/${savedUser.id}/announcements/${savedAnnouncement.id}`)
          .send({ localization: ' 1nv4lid _L0c4l1z4t10n ' })
          .expect(HttpStatus.BAD_REQUEST);

        validateBadRequestDTOBody(response.body, [
          'localization must contains letters, dashes and a single space between words or dashes',
        ]);
      });

      it('should return BadRequestException for trying update images', async () => {
        const response = await request
          .put(`/users/${savedUser.id}/announcements/${savedAnnouncement.id}`)
          .send({ images: 'anything' })
          .expect(HttpStatus.BAD_REQUEST);

        validateBadRequestDTOBody(response.body, [
          `This parameter can't be update through this path, please use image's controller resource.`,
        ]);
      });
    });

    describe('DELETE /users/:user_id/announcements/:announcement_id', () => {
      describe('when deleteAnnouncement is successful', () => {
        it('should return no content', async () => {
          const response = await request
            .delete(
              `/users/${savedUser.id}/announcements/${savedAnnouncement.id}`,
            )
            .expect(HttpStatus.NO_CONTENT);

          expect(response.body).toMatchObject({});
        });
      });

      describe('when the announcement from user is not founded', () => {
        it('should return NotFoundException', async () => {
          const response = await request
            .delete(
              `/users/${savedUser.id}/announcements/${savedAnnouncement.id}`,
            )
            .expect(HttpStatus.NOT_FOUND);

          validateNotFoundBody(
            response.body,
            'Announcement not found or already removed.',
          );
        });
      });

      describe('when there are validation errors', () => {
        it('should return BadRequestException for invalid user id', async () => {
          const response = await request
            .delete(`/users/123/announcements/${getId('objectId')}`)
            .expect(HttpStatus.BAD_REQUEST);

          validateBadRequestDTOBody(response.body, [
            'user_id must be a mongodb id',
          ]);
        });

        it('should return BadRequestException for invalid announcement id', async () => {
          const response = await request
            .delete(`/users/${getId('objectId')}/announcements/123`)
            .expect(HttpStatus.BAD_REQUEST);

          validateBadRequestDTOBody(response.body, [
            'announcement_id must be a mongodb id',
          ]);
        });
      });
    });
  });

  const validateSuccessBody = (body: any) => {
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('title');
    expect(body).toHaveProperty('description');
    expect(body).toHaveProperty('category');
    expect(body).toHaveProperty('localization');
    expect(body).toHaveProperty('type');
    expect(body).toHaveProperty('owner');
    expect(body).toHaveProperty('images');
  };
});
