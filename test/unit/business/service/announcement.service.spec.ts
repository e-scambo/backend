import { NotFoundException } from '@nestjs/common';
import { mock } from 'sinon';
import { AnnouncementService } from '../../../../src/business/service/announcement.service';
import { AnnouncementMock } from '../../../mock/announcement.mock';
import { DatabaseMock } from '../../../mock/database.mock';
import { ImageMock } from '../../../mock/image.mock';
import { QueryMock } from '../../../mock/query.mock';

describe('AnnouncementService', () => {
  let repository: any;
  let imageRepository: any;
  let userRepository: any;
  let favoriteRepository: any;
  let service: AnnouncementService;

  beforeAll(() => {
    [repository, imageRepository, userRepository, favoriteRepository] = [
      mock(),
      mock(),
      mock(),
      mock(),
    ];
    service = new AnnouncementService(
      repository,
      imageRepository,
      userRepository,
      favoriteRepository,
    );
  });

  describe('create()', () => {
    describe('when create is successful', () => {
      it('should return the created announcement', async () => {
        userRepository.checkExists = jest.fn().mockResolvedValueOnce(true);

        imageRepository.createMany = jest
          .fn()
          .mockResolvedValueOnce([ImageMock.response]);

        repository.create = jest
          .fn()
          .mockResolvedValueOnce(AnnouncementMock.response);

        const result = await service.create(AnnouncementMock.request);
        expect(result).toMatchObject(AnnouncementMock.response);
      });
    });

    describe('when the owner does not exists', () => {
      it('should throw an error', async () => {
        userRepository.checkExists = jest.fn().mockResolvedValueOnce(false);

        try {
          await service.create(AnnouncementMock.request);
        } catch (err) {
          expect(err).toMatchObject(
            new NotFoundException('User not found or already removed.'),
          );
        }
      });
    });

    describe('when a database error occurs', () => {
      it('should throw the error for userRepository.checkExists', async () => {
        userRepository.checkExists = jest
          .fn()
          .mockRejectedValueOnce(DatabaseMock.error);

        try {
          await service.create(AnnouncementMock.request);
        } catch (err) {
          expect(err).toMatchObject(DatabaseMock.error);
        }
      });

      it('should throw the error for imageRepository.createMany', async () => {
        userRepository.checkExists = jest.fn().mockResolvedValueOnce(true);

        imageRepository.createMany = jest
          .fn()
          .mockRejectedValueOnce(DatabaseMock.error);

        try {
          await service.create(AnnouncementMock.request);
        } catch (err) {
          expect(err).toMatchObject(DatabaseMock.error);
        }
      });

      it('should throw the error for repository.create', async () => {
        userRepository.checkExists = jest.fn().mockResolvedValueOnce(true);

        imageRepository.createMany = jest
          .fn()
          .mockResolvedValueOnce([ImageMock.response]);

        repository.create = jest.fn().mockRejectedValueOnce(DatabaseMock.error);

        try {
          await service.create(AnnouncementMock.request);
        } catch (err) {
          expect(err).toMatchObject(DatabaseMock.error);
        }
      });
    });
  });

  describe('findWithQuery()', () => {
    describe('when findWithQuery is successful', () => {
      it('should return a list of announcements', async () => {
        repository.findWithQuery = jest
          .fn()
          .mockResolvedValueOnce([AnnouncementMock.populatedResponse]);

        const result = await service.findWithQuery(QueryMock.default);
        expect(result).toMatchObject([AnnouncementMock.populatedResponse]);
      });
    });

    describe('when there is no saved announcements', () => {
      it('should return an empty list', async () => {
        repository.findWithQuery = jest.fn().mockResolvedValueOnce([]);

        const result = await service.findWithQuery(QueryMock.default);
        expect(result).toMatchObject([]);
      });
    });

    describe('when a database error occurs', () => {
      it('should throw  the error', async () => {
        repository.findWithQuery = jest
          .fn()
          .mockRejectedValueOnce(DatabaseMock.error);
        try {
          await service.findWithQuery(QueryMock.default);
        } catch (err) {
          expect(err).toMatchObject(DatabaseMock.error);
        }
      });
    });
  });

  describe('findById()', () => {
    describe('when findById is successful', () => {
      it('should return the founded announcement', async () => {
        repository.findOne = jest
          .fn()
          .mockResolvedValueOnce(AnnouncementMock.populatedResponse);

        const result = await service.findById(
          AnnouncementMock.response._id,
          AnnouncementMock.response.owner,
        );

        expect(result).toMatchObject(AnnouncementMock.populatedResponse);
      });
    });

    describe('when the announcement is not founded', () => {
      it('should throw an error', async () => {
        repository.findOne = jest.fn().mockResolvedValueOnce(null);

        try {
          await service.findById(
            AnnouncementMock.response._id,
            AnnouncementMock.response.owner,
          );
        } catch (err) {
          expect(err).toMatchObject(
            new NotFoundException('Announcement not found or already removed.'),
          );
        }
      });
    });

    describe('when a database error occurs', () => {
      it('should throw the error', async () => {
        repository.findOne = jest
          .fn()
          .mockRejectedValueOnce(DatabaseMock.error);

        try {
          await service.findById(
            AnnouncementMock.response._id,
            AnnouncementMock.response.owner,
          );
        } catch (err) {
          expect(err).toMatchObject(DatabaseMock.error);
        }
      });
    });
  });

  describe('update()', () => {
    describe('when update is successful', () => {
      it('should return the updated announcement', async () => {
        repository.updateOne = jest
          .fn()
          .mockResolvedValueOnce(AnnouncementMock.populatedResponse);

        const result = await service.update(
          AnnouncementMock.response._id,
          AnnouncementMock.request,
        );

        expect(result).toMatchObject(AnnouncementMock.populatedResponse);
      });
    });

    describe('when the announcement is not founded', () => {
      it('should throw an error', async () => {
        repository.updateOne = jest.fn().mockResolvedValueOnce(null);

        try {
          await service.update(
            AnnouncementMock.response._id,
            AnnouncementMock.request,
          );
        } catch (err) {
          expect(err).toMatchObject(
            new NotFoundException('Announcement not found or already removed.'),
          );
        }
      });
    });

    describe('when a database error occurs', () => {
      it('should throw the error', async () => {
        repository.updateOne = jest
          .fn()
          .mockRejectedValueOnce(DatabaseMock.error);

        try {
          await service.update(
            AnnouncementMock.response._id,
            AnnouncementMock.request,
          );
        } catch (err) {
          expect(err).toMatchObject(DatabaseMock.error);
        }
      });
    });
  });

  describe('delete()', () => {
    describe('when delete is successful', () => {
      it('should return undefined', async () => {
        repository.deleteOne = jest
          .fn()
          .mockResolvedValueOnce(AnnouncementMock.response);

        imageRepository.deleteMany = jest
          .fn()
          .mockResolvedValueOnce([ImageMock.response]);

        favoriteRepository.deleteMany = jest.fn().mockResolvedValueOnce([]);

        const result = await service.delete(
          AnnouncementMock.response._id,
          AnnouncementMock.response.owner,
        );

        expect(result).toBeUndefined();
      });
    });

    describe('when announcement is not founded', () => {
      it('should throw an error', async () => {
        repository.deleteOne = jest.fn().mockResolvedValueOnce(null);

        try {
          await service.delete(
            AnnouncementMock.response._id,
            AnnouncementMock.response.owner,
          );
        } catch (err) {
          expect(err).toMatchObject(
            new NotFoundException('Announcement not found or already removed.'),
          );
        }
      });
    });

    describe('when a database error occurs', () => {
      it('should throw the error for repository.deleteOne', async () => {
        repository.deleteOne = jest
          .fn()
          .mockRejectedValueOnce(DatabaseMock.error);

        try {
          await service.delete(
            AnnouncementMock.response._id,
            AnnouncementMock.response.owner,
          );
        } catch (err) {
          expect(err).toMatchObject(DatabaseMock.error);
        }
      });
      it('should throw the error for imageRepository.deleteMany', async () => {
        repository.deleteOne = jest
          .fn()
          .mockResolvedValueOnce(AnnouncementMock.response);

        imageRepository.deleteMany = jest
          .fn()
          .mockRejectedValueOnce(DatabaseMock.error);

        favoriteRepository.deleteMany = jest.fn().mockResolvedValueOnce([]);

        try {
          await service.delete(
            AnnouncementMock.response._id,
            AnnouncementMock.response.owner,
          );
        } catch (err) {
          expect(err).toMatchObject(DatabaseMock.error);
        }
      });
    });
  });
});
