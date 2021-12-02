import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnnouncementService } from '../../business/service/announcement.service';
import { AnnouncementRepository } from '../../infrastructure/repository/announcement.repository';
import { ImageRepository } from '../../infrastructure/repository/image.repository';
import { UserRepository } from '../../infrastructure/repository/user.repository';
import {
  Announcement,
  AnnouncementSchema
} from '../../infrastructure/schema/announcement.schema';
import { Image, ImageSchema } from '../../infrastructure/schema/image.schema';
import { User, UserSchema } from '../../infrastructure/schema/user.schema';
import { UserAnnouncementController } from '../../presentation/controller/user.announcement.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Announcement.name, schema: AnnouncementSchema },
      { name: Image.name, schema: ImageSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [UserAnnouncementController],
  providers: [
    AnnouncementService,
    AnnouncementRepository,
    ImageRepository,
    UserRepository,
  ],
  exports: [AnnouncementRepository]
})
export class AnnouncementModule {}
