import { HttpStatus, INestApplication } from '@nestjs/common';
import * as Request from 'supertest';
import { bootstrapTest } from '../app/health.test.app';

describe('HealthController (e2e)', () => {
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

  describe('GET /health', () => {
    it('should return status ok and mongoDB database status up', async () => {
      const { body } = await request.get('/health').expect(HttpStatus.OK);

      expect(body).toHaveProperty('status', 'ok');
      expect(body).toHaveProperty('info');
      expect(body.info).toMatchObject({ mongoDB: { status: 'up' } });
      expect(body).toHaveProperty('details');
      expect(body.details).toMatchObject({ mongoDB: { status: 'up' } });
    });
  });
});
