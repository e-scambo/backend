import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppController } from '../../src/presentation/controller/app.controller';

export async function bootstrapTest(): Promise<INestApplication> {
  const moduleFixture = await Test.createTestingModule({
    controllers: [AppController],
  }).compile();

  const app = moduleFixture.createNestApplication();
  return app;
}
