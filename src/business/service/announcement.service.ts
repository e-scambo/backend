import { Injectable, NotFoundException } from '@nestjs/common';
import { MongoQueryModel } from 'nest-mongo-query-parser';
import { AnnouncementRepository } from '../../infrastructure/repository/announcement.repository';
import { ImageRepository } from '../../infrastructure/repository/image.repository';
import { UserRepository } from '../../infrastructure/repository/user.repository';
import { Announcement } from '../../infrastructure/schema/announcement.schema';
import { CreateAnnouncementDTO } from '../../presentation/dto/announcement.dto';
import { ImageUtil } from '../util/image.util';

@Injectable()
export class AnnouncementService {
  constructor(
    private readonly _repository: AnnouncementRepository,
    private readonly _imageRepository: ImageRepository,
    private readonly _userRepository: UserRepository,
  ) {}

  async create(item: CreateAnnouncementDTO): Promise<Announcement> {
    // 1. validar se o owner existe
    const ownerExists = await this._userRepository.checkExists({
      _id: item.owner,
    });
    if (!ownerExists) {
      throw new NotFoundException('User not found or already removed.');
    }

    // 2. salvar as imagens primeiro
    const savedImages = await this._imageRepository.createMany(
      item.images.map((image) => {
        image.originalname = ImageUtil.generateImageName(
          item.owner,
          image.mimetype,
        );
        return image;
      }),
    );

    // 3. coloca as referências dos ids das imagens
    const announcement = { ...item };
    announcement.images = savedImages.map((image) => image.id);

    // 4. salva o anúncio
    return this._repository.create(announcement);
  }

  async findWithQuery(query: MongoQueryModel): Promise<Announcement[]> {
    return this._repository.findWithQuery(query);
  }
}
