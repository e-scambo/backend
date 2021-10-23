import { ReadOnlyMock } from './readonly.mock';

export class UserMock {
  static get repositoryRequest() {
    return {
      name: 'John Doe',
      email: 'johndoe@mail.com',
      password: 'secretPassWord',
      phone: '(88) 98888-8888',
      state: 'State of Tests',
      city: 'City of Tests',
    };
  }

  static get repositoryResponse() {
    return {
      ...UserMock.repositoryRequest,
      ...ReadOnlyMock.database,
    };
  }
}
