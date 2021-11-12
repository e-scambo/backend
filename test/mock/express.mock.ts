import { Response } from 'express';

export class ExpressMock {
  static get response() {
    const response = {} as Response;
    response.set = jest.fn().mockReturnThis();
    response.status = jest.fn().mockReturnThis();
    response.on = jest.fn().mockReturnThis();
    response.once = jest.fn().mockReturnThis();
    response.emit = jest.fn().mockReturnValue(true);
    response.write = jest.fn().mockReturnValue(true);
    response.end = jest.fn().mockImplementation(() => {});
    return response;
  }
}
