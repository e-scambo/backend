import { ReadOnlyMock } from './readonly.mock';

export class UserMock {
  static get request() {
    return {
      name: 'John Doe',
      email: 'johndoe@mail.com',
      password: 'secre3@tPassWord',
      phone: '(88) 98888-8888',
      state: 'State of Tests',
      city: 'City of Tests',
    };
  }

  static get request2() {
    return {
      name: 'Carl Hoen',
      email: 'carlhoen@mail.com',
      password: 'secre5@tPasSword',
      phone: '(88) 99888-8888',
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
