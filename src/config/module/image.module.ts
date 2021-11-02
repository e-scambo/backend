import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageService } from '../../business/service/image.service';
import { ImageRepository } from '../../infrastructure/repository/image.repository';
import { Image, ImageSchema } from '../../infrastructure/schema/image.schema';
import { ImageController } from '../../presentation/controller/image.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }]),
  ],
  controllers: [ImageController],
  providers: [ImageService, ImageRepository],
})
export class ImageModule {}
