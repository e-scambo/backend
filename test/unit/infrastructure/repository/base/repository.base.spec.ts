import { mock } from 'sinon';
import { UserRepository } from '../../../../../src/infrastructure/repository/user.repository';
import { DatabaseMock } from '../../../../mock/database.mock';
import { UserMock } from '../../../../mock/user.mock';

describe('BaseRepository (UserRepository extends)', () => {
  let model: any;
  let repository: UserRepository;
  let request: any;
  let response: any;
  let databaseError: any;

  beforeAll(() => {
    model = mock();
    repository = new UserRepository(model);
    request = UserMock.request;
    response = UserMock.response;
    databaseError = DatabaseMock.error;
  });

  describe('create()', () => {
    describe('when create is successful', () => {
      it('should return the created user', async () => {
        model.create = jest.fn().mockResolvedValueOnce(response);

        const result = await repository.create(request);
        expect(result).toMatchObject(response);
      });
    });

    describe('when a database error occurs', () => {
      it('should throw the error', async () => {
        model.create = jest.fn().mockRejectedValueOnce(databaseError);

        try {
          await repository.create(request);
        } catch (err) {
          expect(err).toMatchObject(databaseError);
        }
      });
    });
  });

  describe('find()', () => {
    describe('when find is successful', () => {
      it('should return at least one result', async () => {
        model.find = jest.fn().mockResolvedValueOnce(response);

        const result = await repository.find(request);
        expect(result).toMatchObject(response);
      });
    });

    describe(`when find doesn't find anything`, () => {
      it('should return null', async () => {
        model.find = jest.fn().mockResolvedValueOnce(null);

        const result = await repository.find(request);
        expect(result).toBeNull();
      });
    });
  });

  describe('findOne()', () => {
    describe('when findOne is successful', () => {
      it('should return one result', async () => {
        model.findOne = jest.fn().mockResolvedValueOnce(response);

        const result = await repository.findOne(request);
        expect(result).toMatchObject(response);
      });
    });

    describe(`when findOne doesn't find anything`, () => {
      it('should return null', async () => {
        model.findOne = jest.fn().mockResolvedValueOnce(null);

        const result = await repository.findOne(request);
        expect(result).toBeNull();
      });
    });
  });

  describe('updateOne()', () => {
    describe('when updateOne is successful', () => {
      it('should return the new updated object', async () => {
        model.findOneAndUpdate = jest.fn().mockResolvedValueOnce(response);
        const _id = request.user_id;

        const result = await repository.updateOne(_id, request);
        expect(result).toMatchObject(response);
      });
    });

    describe(`when updateOne isn't successfull`, () => {
      it('should return null', async () => {
        model.findOneAndUpdate = jest.fn().mockResolvedValueOnce(null);
        const _id = request.user_id;

        const result = await repository.updateOne(_id, request);
        expect(result).toBeNull();
      });
    });
  });

  describe('delete()', () => {
    describe('when delete is successful', () => {
      it('should return nothing', async () => {
        model.findOneAndDelete = jest.fn().mockResolvedValueOnce(null);
        const _id = request.user_id;

        const result = await repository.deleteOne(_id);
        expect(result).toBeNull();
      });
    });

    describe(`when delete isn't successfull`, () => {
      it('should throw an error', async () => {
        model.findOneAndDelete = jest.fn().mockResolvedValueOnce(databaseError);

        try {
          await repository.deleteOne(request);
        } catch (err) {
          expect(err).toMatchObject(databaseError);
        }
      });
    });
  });

  describe('checkExists()', () => {
    describe('when checkExists is successful', () => {
      it('should return true', async () => {
        model.findOne = jest.fn().mockResolvedValueOnce(response);

        const result = await repository.checkExists(request);
        expect(result).toEqual(true);
      });
    });

    describe('when document is not founded', () => {
      it('should return false', async () => {
        model.findOne = jest.fn().mockResolvedValueOnce(null);

        const result = await repository.checkExists(request);
        expect(result).toEqual(false);
      });
    });

    describe(`when findOne doesn't find anything`, () => {
      it('should return null', async () => {
        model.findOne = jest.fn().mockResolvedValueOnce(databaseError);

        try {
          await repository.checkExists(request);
        } catch (err) {
          expect(err).toMatchObject(databaseError);
        }
      });
    });
  });
});
