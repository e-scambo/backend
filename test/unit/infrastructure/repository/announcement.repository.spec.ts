import { mock } from 'sinon';
import { BaseRepository } from '../../../../src/infrastructure/repository/base/repository.base';
import { AnnouncementRepository } from '../../../../src/infrastructure/repository/announcement.repository';
import { SchemaMock } from '../../../mock/schema.mock';
import { AnnouncementMock } from '../../../mock/announcement.mock';
import { QueryMock } from '../../../mock/query.mock';
import { DatabaseMock } from '../../../mock/database.mock';
import { Announcement } from '../../../../src/infrastructure/schema/announcement.schema';

describe('AnnouncementRepository', () => {
  let model: any;
  let repository: AnnouncementRepository;

  beforeAll(() => {
    model = mock();
    repository = new AnnouncementRepository(model);
  });

  it('should extends BaseRepository', async () => {
    expect(repository).toBeInstanceOf(BaseRepository);
  });

  describe('findWithQuery', () => {
    const calls = ['limit', 'skip', 'select', 'sort', 'populate', 'exec'];

    describe('when findWithQuery is successful', () => {
      it('should return a list of announcements', async () => {
        model.find = SchemaMock.asBuilderCall(
          calls,
          jest.fn().mockResolvedValueOnce([AnnouncementMock.populatedResponse]),
        );

        const result = await repository.findWithQuery(QueryMock.default);
        expect(result).toMatchObject([AnnouncementMock.populatedResponse]);
      });
    });

    describe('when there is no saved announcements', () => {
      it('should return an empty list', async () => {
        model.find = SchemaMock.asBuilderCall(
          calls,
          jest.fn().mockResolvedValueOnce([]),
        );

        const result = await repository.findWithQuery(QueryMock.default);
        expect(result).toMatchObject([]);
      });
    });

    describe('when a database error occurs', () => {
      it('should throw the error', async () => {
        model.find = SchemaMock.asBuilderCall(
          calls,
          jest.fn().mockRejectedValueOnce(DatabaseMock.error),
        );

        try {
          await repository.findWithQuery(QueryMock.default);
        } catch (err) {
          expect(err).toMatchObject(DatabaseMock.error);
        }
      });
    });
  });

  describe('findOne()', () => {
    const calls = ['populate', 'exec'];

    describe('when findOne is successful', () => {
      it('should return the founded announcement', async () => {
        model.findOne = SchemaMock.asBuilderCall(
          calls,
          jest.fn().mockResolvedValueOnce(AnnouncementMock.populatedResponse),
        );

        const result = await repository.findOne({
          _id: AnnouncementMock.response._id,
        });
        expect(result).toMatchObject(AnnouncementMock.populatedResponse);
      });
    });

    describe('when the announcement is not founded', () => {
      it('should return null', async () => {
        model.findOne = SchemaMock.asBuilderCall(
          calls,
          jest.fn().mockResolvedValueOnce(null),
        );

        const result = await repository.findOne({
          _id: AnnouncementMock.response._id,
        });
        expect(result).toBeNull();
      });
    });

    describe('when a database error occurs', () => {
      it('should throw the error', async () => {
        model.findOne = SchemaMock.asBuilderCall(
          calls,
          jest.fn().mockRejectedValueOnce(DatabaseMock.error),
        );

        try {
          await repository.findOne({
            _id: AnnouncementMock.response._id,
          });
        } catch (err) {
          expect(err).toMatchObject(DatabaseMock.error);
        }
      });
    });
  });

  describe('updateOne()', () => {
    const calls = ['populate', 'exec'];

    describe('when updateOne is successful', () => {
      it('should return the founded announcement', async () => {
        model.findOneAndUpdate = SchemaMock.asBuilderCall(
          calls,
          jest.fn().mockResolvedValueOnce(AnnouncementMock.populatedResponse),
        );

        const result = await repository.updateOne(
          {
            _id: AnnouncementMock.response._id,
          },
          AnnouncementMock.request,
        );
        expect(result).toMatchObject(AnnouncementMock.populatedResponse);
      });
    });

    describe('when the announcement is not founded', () => {
      it('should return null', async () => {
        model.findOneAndUpdate = SchemaMock.asBuilderCall(
          calls,
          jest.fn().mockResolvedValueOnce(null),
        );

        const result = await repository.updateOne(
          {
            _id: AnnouncementMock.response._id,
          },
          AnnouncementMock.request,
        );
        expect(result).toBeNull();
      });
    });

    describe('when a database error occurs', () => {
      it('should throw the error', async () => {
        model.findOneAndUpdate = SchemaMock.asBuilderCall(
          calls,
          jest.fn().mockRejectedValueOnce(DatabaseMock.error),
        );

        try {
          await repository.updateOne(
            {
              _id: AnnouncementMock.response._id,
            },
            AnnouncementMock.request,
          );
        } catch (err) {
          expect(err).toMatchObject(DatabaseMock.error);
        }
      });
    });
  });
});
