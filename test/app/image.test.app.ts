import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { ImageService } from '../../src/business/service/image.service';
import { AllExceptionsFilter } from '../../src/config/filter/exception.filter';
import { ImageRepository } from '../../src/infrastructure/repository/image.repository';
import {
  Image,
  ImageSchema,
} from '../../src/infrastructure/schema/image.schema';
import { ImageController } from '../../src/presentation/controller/image.controller';

export async function bootstrapTest(): Promise<INestApplication> {
  const moduleFixture = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot(),
      MongooseModule.forRoot(process.env.TEST_DATABASE_URL),
      MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }]),
    ],
    controllers: [ImageController],
    providers: [ImageService, ImageRepository],
  }).compile();

  const app = moduleFixture.createNestApplication();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());
  return app;
}
