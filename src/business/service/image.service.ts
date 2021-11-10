import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AnnouncementRepository } from '../../infrastructure/repository/announcement.repository';
import { ImageRepository } from '../../infrastructure/repository/image.repository';
import { Image } from '../../infrastructure/schema/image.schema';
import { ImageUtil } from '../util/image.util';

@Injectable()
export class ImageService {
  constructor(private readonly _repository: ImageRepository,
    private readonly _announcementRepository: AnnouncementRepository) {}

  async findByName(originalname: string): Promise<Image> {
    const result = await this._repository.findOne({ originalname });
    if (!result) {
      throw new NotFoundException('Image not found or already removed.');
    }
    return result;
  }

  async deleteImage(user: string, announcement: string, originalname: string): Promise<void> {
    if (!ImageUtil.isImageOwner(user, originalname)) {
      throw new UnauthorizedException(`This user can't delete this image`);
    }

    const result = await this._repository.deleteOne({ originalname });
    if (!result) throw new NotFoundException('Image not found or already removed.');

    this.deleteImageFromAnnouncement(result._id, announcement)
  }

  private async deleteImageFromAnnouncement(imageid: string, announcement: string): Promise<void> {
    const result = await this._announcementRepository.updateOne({_id: announcement}, {$pull: {images: imageid}})
  }
}


