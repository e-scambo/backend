import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { AnnouncementService } from '../../src/business/service/announcement.service';
import { AllExceptionsFilter } from '../../src/config/filter/exception.filter';
import { AnnouncementRepository } from '../../src/infrastructure/repository/announcement.repository';
import { FavoriteRepository } from '../../src/infrastructure/repository/favorite.repository';
import { ImageRepository } from '../../src/infrastructure/repository/image.repository';
import { UserRepository } from '../../src/infrastructure/repository/user.repository';
import {
  Announcement,
  AnnouncementSchema,
} from '../../src/infrastructure/schema/announcement.schema';
import { Favorite, FavoriteSchema } from '../../src/infrastructure/schema/favorite.schema';
import {
  Image,
  ImageSchema,
} from '../../src/infrastructure/schema/image.schema';
import { User, UserSchema } from '../../src/infrastructure/schema/user.schema';
import { UserAnnouncementController } from '../../src/presentation/controller/user.announcement.controller';

export async function bootstrapTest(): Promise<INestApplication> {
  const moduleFixture = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot(),
      MongooseModule.forRoot(process.env.TEST_DATABASE_URL),
      MongooseModule.forFeature([
        { name: Announcement.name, schema: AnnouncementSchema },
        { name: Image.name, schema: ImageSchema },
        { name: User.name, schema: UserSchema },
        { name: Favorite.name, schema: FavoriteSchema },
      ]),
    ],
    controllers: [UserAnnouncementController],
    providers: [
      AnnouncementService,
      AnnouncementRepository,
      ImageRepository,
      UserRepository,
      FavoriteRepository
    ],
  }).compile();

  const app = moduleFixture.createNestApplication();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());
  return app;
}
