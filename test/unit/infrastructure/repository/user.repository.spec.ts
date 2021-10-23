import { mock } from 'sinon';
import { BaseRepository } from '../../../../src/infrastructure/repository/base/repository.base';
import { UserRepository } from '../../../../src/infrastructure/repository/user.repository';

describe('UserRepository', () => {
  let model: any;
  let repository: UserRepository;

  beforeAll(() => {
    model = mock();
    repository = new UserRepository(model);
  });

  it('should extends BaseRepository', async () => {
    expect(repository).toBeInstanceOf(BaseRepository);
  });
});
