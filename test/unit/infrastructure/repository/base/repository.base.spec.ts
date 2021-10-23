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
    request = UserMock.repositoryRequest;
    response = UserMock.repositoryResponse;
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
});
