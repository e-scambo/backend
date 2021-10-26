import { INestApplication } from '@nestjs/common';
import * as Request from 'supertest';
import { bootstrapTest } from '../app/test.app';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let request: Request.SuperTest<Request.Test>;

  beforeAll(async () => {
    app = await bootstrapTest();
    await app.init();
    request = Request(app.getHttpServer());
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /', () => {
    it('should return hello world', async () => {
      const response = await request.get('/').expect(200);
      expect(response.text).toEqual('Hello World!');
    });
  });
});
