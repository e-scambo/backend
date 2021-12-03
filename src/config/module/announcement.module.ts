import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnnouncementService } from '../../business/service/announcement.service';
import { AnnouncementRepository } from '../../infrastructure/repository/announcement.repository';
import { FavoriteRepository } from '../../infrastructure/repository/favorite.repository';
import { ImageRepository } from '../../infrastructure/repository/image.repository';
import { UserRepository } from '../../infrastructure/repository/user.repository';
import {
  Announcement,
  AnnouncementSchema,
} from '../../infrastructure/schema/announcement.schema';
import {
  Favorite,
  FavoriteSchema,
} from '../../infrastructure/schema/favorite.schema';
import { Image, ImageSchema } from '../../infrastructure/schema/image.schema';
import { User, UserSchema } from '../../infrastructure/schema/user.schema';
import { AnnouncementController } from '../../presentation/controller/announcement.controller';
import { UserAnnouncementController } from '../../presentation/controller/user.announcement.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Announcement.name, schema: AnnouncementSchema },
      { name: Image.name, schema: ImageSchema },
      { name: User.name, schema: UserSchema },
      { name: Favorite.name, schema: FavoriteSchema },
    ]),
  ],
  controllers: [UserAnnouncementController, AnnouncementController],
  providers: [
    AnnouncementService,
    AnnouncementRepository,
    ImageRepository,
    UserRepository,
    FavoriteRepository,
  ],
  exports: [AnnouncementRepository],
})
export class AnnouncementModule {}
