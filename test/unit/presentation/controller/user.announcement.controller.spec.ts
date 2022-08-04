import { mock } from 'sinon';
import { UserAnnouncementController } from '../../../../src/presentation/controller/user.announcement.controller';
import { AnnouncementMock } from '../../../mock/announcement.mock';
import { DatabaseMock } from '../../../mock/database.mock';
import { ImageMock } from '../../../mock/image.mock';
import { QueryMock } from '../../../mock/query.mock';
import { UserMock } from '../../../mock/user.mock';

describe('UserAnnouncementController', () => {
  let service: any;
  let controller: UserAnnouncementController;
  let params: any;
  let paramsById: any;

  beforeAll(() => {
    params = { user_id: UserMock.response._id };
    paramsById = {
      user_id: UserMock.response._id,
      announcement_id: AnnouncementMock.response.id,
    };

    service = mock();
    controller = new UserAnnouncementController(service);
  });

  describe('create()', () => {
    describe('when create is successful', () => {
      it('should return the created user', async () => {
        service.create = jest
          .fn()
          .mockResolvedValueOnce(AnnouncementMock.response);

        const result = await controller.create(
          params,
          [ImageMock.request as Express.Multer.File],
          AnnouncementMock.request,
        );
        expect(result).toMatchObject(AnnouncementMock.response);
      });
    });

    describe('when an error occurs', () => {
      it('should throw the error', async () => {
        service.create = jest.fn().mockRejectedValueOnce(DatabaseMock.error);

        try {
          await controller.create(
            params,
            [ImageMock.request as Express.Multer.File],
            AnnouncementMock.request,
          );
        } catch (err) {
          expect(err).toMatchObject(DatabaseMock.error);
        }
      });
    });
  });

  describe('find()', () => {
    describe('when find is successful', () => {
      it('should return a list of announcements', async () => {
        service.findWithQuery = jest
          .fn()
          .mockResolvedValueOnce([AnnouncementMock.populatedResponse]);

        const result = await controller.find(params, QueryMock.default);
        expect(result).toMatchObject([AnnouncementMock.populatedResponse]);
      });
    });

    describe('when an error occurs', () => {
      it('should throw the error', async () => {
        service.findWithQuery = jest
          .fn()
          .mockRejectedValueOnce(DatabaseMock.error);

        try {
          await controller.find(params, QueryMock.default);
        } catch (err) {
          expect(err).toMatchObject(DatabaseMock.error);
        }
      });
    });
  });

  describe('findById()', () => {
    describe('when findById is successful', () => {
      it('should return the founded announcement', async () => {
        service.findByIdAndOwner = jest
          .fn()
          .mockResolvedValueOnce(AnnouncementMock.populatedResponse);

        const result = await controller.findById(paramsById);
        expect(result).toMatchObject(AnnouncementMock.populatedResponse);
      });
    });

    describe('when a database error occurs', () => {
      it('should throw the error', async () => {
        service.findByIdAndOwner = jest
          .fn()
          .mockRejectedValueOnce(DatabaseMock.error);

        try {
          await controller.findById(paramsById);
        } catch (err) {
          expect(err).toMatchObject(DatabaseMock.error);
        }
      });
    });
  });

  describe('updateAnnouncement()', () => {
    describe('when updateAnnouncement is successful', () => {
      it('should return the updated announcement', async () => {
        service.update = jest
          .fn()
          .mockResolvedValueOnce(AnnouncementMock.populatedResponse);

        const result = await controller.updateAnnouncement(
          paramsById,
          AnnouncementMock.request,
        );
        expect(result).toMatchObject(AnnouncementMock.populatedResponse);
      });
    });

    describe('when a database error occurs', () => {
      it('should throw the error', async () => {
        service.update = jest.fn().mockRejectedValueOnce(DatabaseMock.error);

        try {
          await controller.updateAnnouncement(
            paramsById,
            AnnouncementMock.request,
          );
        } catch (err) {
          expect(err).toMatchObject(DatabaseMock.error);
        }
      });
    });
  });

  describe('deleteAnnouncement()', () => {
    describe('when deleteAnnouncement is successful', () => {
      it('should return undefined', async () => {
        service.delete = jest.fn().mockResolvedValueOnce(undefined);

        const result = await controller.deleteAnnouncement(paramsById);
        expect(result).toBeUndefined();
      });
    });

    describe('when a database error occurs', () => {
      it('should throw the error', async () => {
        service.delete = jest.fn().mockRejectedValueOnce(DatabaseMock.error);

        try {
          await controller.deleteAnnouncement(paramsById);
        } catch (err) {
          expect(err).toMatchObject(DatabaseMock.error);
        }
      });
    });
  });
});
