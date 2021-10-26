import { ReadOnlyMock } from './readonly.mock';

export class UserMock {
  static get request() {
    return {
      name: 'John Doe',
      email: 'johndoe@mail.com',
      password: 'secretPassWord',
      phone: '(88) 98888-8888',
      state: 'State of Tests',
      city: 'City of Tests',
    };
  }

  static get response() {
    return {
      ...UserMock.request,
      ...ReadOnlyMock.database,
    };
  }

  static get updatePasswordRequest() {
    return {
      current_password: 'secretPassWord',
      new_password: 'anotherSecretePassWord',
    };
  }
}
