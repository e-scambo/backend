import { UpdateAnnouncementDto } from './../../presentation/dto/announcement.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { MongoQueryModel } from 'nest-mongo-query-parser';
import { AnnouncementRepository } from '../../infrastructure/repository/announcement.repository';
import { ImageRepository } from '../../infrastructure/repository/image.repository';
import { UserRepository } from '../../infrastructure/repository/user.repository';
import { Announcement } from '../../infrastructure/schema/announcement.schema';
import { CreateAnnouncementDTO } from '../../presentation/dto/announcement.dto';
import { ImageUtil } from '../util/image.util';
import { FavoriteRepository } from '../../infrastructure/repository/favorite.repository';

@Injectable()
export class AnnouncementService {
  constructor(
    private readonly _repository: AnnouncementRepository,
    private readonly _imageRepository: ImageRepository,
    private readonly _userRepository: UserRepository,
    private readonly _favoriteRepository: FavoriteRepository,
  ) {}

  async create(item: CreateAnnouncementDTO): Promise<Announcement> {
    const ownerExists = await this._userRepository.checkExists({
      _id: item.owner,
    });
    if (!ownerExists) {
      throw new NotFoundException('User not found or already removed.');
    }
    const savedImages = await this._imageRepository.createMany(
      item.images.map((image) => {
        image.originalname = ImageUtil.generateImageName(
          item.owner,
          image.mimetype,
        );
        return image;
      }),
    );

    const announcement = { ...item };
    announcement.images = savedImages.map((image) => image.id);

    return this._repository.create(announcement);
  }

  async findWithQuery(query: MongoQueryModel): Promise<Announcement[]> {
    return this._repository.findWithQuery(query);
  }

  async findById(_id: string, user_id: string): Promise<Announcement> {
    const announcement = await this._repository.findOne({
      _id,
      owner: user_id,
    });

    if (!announcement) {
      throw new NotFoundException('Announcement not found or already removed.');
    }

    return announcement;
  }

  async update(
    _id: string,
    body: UpdateAnnouncementDto,
  ): Promise<Announcement> {
    const announcement = await this._repository.updateOne(
      { _id, owner: body.owner },
      body,
    );

    if (!announcement) {
      throw new NotFoundException('Announcement not found or already removed.');
    }

    return announcement;
  }

  async delete(_id: string, user_id: string): Promise<void> {
    const announcement = await this._repository.deleteOne({
      _id,
      owner: user_id,
    });

    if (!announcement) {
      throw new NotFoundException('Announcement not found or already removed.');
    }

    await Promise.all([
      this._imageRepository.deleteMany({
        $or: announcement.images.map((imageId: any) => {
          return { _id: imageId };
        }),
      }),
      this._favoriteRepository.deleteMany({ announcement: _id }),
    ]);
  }
}
