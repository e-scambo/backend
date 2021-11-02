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
import { AnnouncementController } from '../../presentation/controller/announcement.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Announcement.name, schema: AnnouncementSchema },
      { name: Image.name, schema: ImageSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [AnnouncementController],
  providers: [
    AnnouncementService,
    AnnouncementRepository,
    ImageRepository,
    UserRepository,
  ],
})
export class AnnouncementModule {}
