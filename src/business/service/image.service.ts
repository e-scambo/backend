import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AnnouncementRepository } from '../../infrastructure/repository/announcement.repository';
import { ImageRepository } from '../../infrastructure/repository/image.repository';
import { Announcement } from '../../infrastructure/schema/announcement.schema';
import { Image } from '../../infrastructure/schema/image.schema';
import { ImageUtil } from '../util/image.util';

@Injectable()
export class ImageService {
  constructor(
    private readonly _repository: ImageRepository,
    private readonly _announcementRepository: AnnouncementRepository
    ) {}

  async findByName(originalname: string): Promise<Image> {
    const result = await this._repository.findOne({ originalname });
    if (!result) {
      throw new NotFoundException('Image not found or already removed.');
    }
    return result;
  }

  async deleteImage(user: string, announcement: string, originalname: string): Promise<Announcement> {
    const image = await this.deleteImageFromDataBase(user, originalname)
    
    return this.deleteImageFromAnnouncement(image, announcement)
  }

  private async deleteImageFromDataBase(user: string, originalname: string): Promise<string> {
    if (!this._repository.checkExists({originalname})) {
      throw new NotFoundException('Image not found or already removed.')
    }
    
    if (!ImageUtil.isImageOwner(user, originalname)) {
      throw new UnauthorizedException(`This user can't delete this image`);
    }

    const result = await this._repository.deleteOne({ originalname });
    return result._id;
  }

  private async deleteImageFromAnnouncement(imageId: string, announcement: string): Promise<Announcement> {
    const dbannouncement = await this._announcementRepository.removeImage(
      {_id: announcement }, 
      { $pull: { images: [imageId] } }
    );

    if (!dbannouncement) throw new NotFoundException('Announcement not found.');

    return dbannouncement;
  }
}