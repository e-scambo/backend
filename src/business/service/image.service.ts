import { Injectable, NotFoundException } from '@nestjs/common';
import { ImageRepository } from '../../infrastructure/repository/image.repository';
import { Image } from '../../infrastructure/schema/image.schema';

@Injectable()
export class ImageService {
  constructor(private readonly _repository: ImageRepository) {}

  async findByName(originalname: string): Promise<Image> {
    const result = await this._repository.findOne({ originalname });
    if (!result) {
      throw new NotFoundException('Image not found or already removed.');
    }
    return result;
  }
}
