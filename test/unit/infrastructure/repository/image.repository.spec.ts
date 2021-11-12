import { mock } from 'sinon';
import { BaseRepository } from '../../../../src/infrastructure/repository/base/repository.base';
import { ImageRepository } from '../../../../src/infrastructure/repository/image.repository';
import { DatabaseMock } from '../../../mock/database.mock';
import { ImageMock } from '../../../mock/image.mock';

describe('ImageRepository', () => {
  let model: any;
  let repository: ImageRepository;

  beforeAll(() => {
    model = mock();
    repository = new ImageRepository(model);
  });

  it('should extends BaseRepository', async () => {
    expect(repository).toBeInstanceOf(BaseRepository);
  });

  describe('createMany', () => {
    describe('when createMany is successful', () => {
      it('should return a list of images', async () => {
        model.insertMany = jest
          .fn()
          .mockResolvedValueOnce([ImageMock.response]);

        const result = await repository.createMany([ImageMock.request]);
        expect(result).toMatchObject([ImageMock.response]);
      });
    });

    describe('when a database error occurs', () => {
      it('should throw the error', async () => {
        model.insertMany = jest.fn().mockRejectedValueOnce(DatabaseMock.error);

        try {
          await repository.createMany([ImageMock.request]);
        } catch (err) {
          expect(err).toMatchObject(DatabaseMock.error);
        }
      });
    });
  });

  describe('deleteMany', () => {
    describe('when deleteMany is successful', () => {
      it('should return undefined', async () => {
        model.deleteMany = jest
          .fn()
          .mockResolvedValueOnce([ImageMock.response]);

        const result = await repository.deleteMany([ImageMock.request]);
        expect(result).toBeUndefined();
      });
    });

    describe('when a database error occurs', () => {
      it('should throw the error', async () => {
        model.deleteMany = jest.fn().mockRejectedValueOnce(DatabaseMock.error);

        try {
          await repository.deleteMany([ImageMock.request]);
        } catch (err) {
          expect(err).toMatchObject(DatabaseMock.error);
        }
      });
    });
  });
});
