import { AnnouncementRepository } from './../../infrastructure/repository/announcement.repository';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageService } from '../../business/service/image.service';
import { ImageRepository } from '../../infrastructure/repository/image.repository';
import { Image, ImageSchema } from '../../infrastructure/schema/image.schema';
import { ImageController } from '../../presentation/controller/image.controller';
import { Announcement, AnnouncementSchema } from '../../infrastructure/schema/announcement.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Image.name, schema: ImageSchema },
      { name: Announcement.name, schema: AnnouncementSchema }
    ]),
  ],
  controllers: [ImageController],
  providers: [
    ImageService, 
    ImageRepository,
    AnnouncementRepository]
})
export class ImageModule {}
