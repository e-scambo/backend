import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { MongoQueryModel } from 'nest-mongo-query-parser';
import { AnnouncementRepository } from '../../infrastructure/repository/announcement.repository';
import { FavoriteRepository } from '../../infrastructure/repository/favorite.repository';
import { ImageRepository } from '../../infrastructure/repository/image.repository';
import { UserRepository } from '../../infrastructure/repository/user.repository';
import { Announcement } from '../../infrastructure/schema/announcement.schema';
import {
  CreateAnnouncementDTO,
  ImageDTO,
} from '../../presentation/dto/announcement.dto';
import { ImageEnum } from '../../presentation/enum/image.enum';
import { ImageUtil } from '../util/image.util';
import { UpdateAnnouncementDto } from './../../presentation/dto/announcement.dto';

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

  async findById(_id: string): Promise<Announcement> {
    const announcement = await this._repository.findOne({
      _id,
    });

    if (!announcement) {
      throw new NotFoundException('Announcement not found or already removed.');
    }

    return announcement;
  }

  async findByIdAndOwner(_id: string, user_id: string): Promise<Announcement> {
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

  async addImage(
    userId: string,
    announcementid: string,
    image: ImageDTO,
  ): Promise<Announcement> {
    const announcement = await this._repository.findOne({
      _id: announcementid,
      owner: userId,
    });
    if (!announcement) {
      throw new NotFoundException('Announcement not found or already removed.');
    }

    if (announcement.images.length === ImageEnum.MAX_IMAGE_QUANTITY) {
      throw new BadRequestException('Exceeds maximum number of images.');
    }

    image.originalname = ImageUtil.generateImageName(userId, image.mimetype);
    const newImage = await this._imageRepository.create(image);
    return await this._repository.updateOne(
      { _id: announcement.id },
      { $push: { images: [newImage.id] } },
    );
  }

  async deleteImage(
    user: string,
    announcement: string,
    originalname: string,
  ): Promise<Announcement> {
    const image = await this.deleteImageFromDataBase(user, originalname);

    return this.deleteImageFromAnnouncement(image, announcement);
  }

  private async deleteImageFromDataBase(
    user: string,
    originalname: string,
  ): Promise<string> {
    if (!(await this._imageRepository.checkExists({ originalname }))) {
      throw new NotFoundException('Image not found or already removed.');
    }

    if (!ImageUtil.isImageOwner(user, originalname)) {
      throw new UnauthorizedException(`This user can't delete this image.`);
    }

    const result = await this._imageRepository.deleteOne({ originalname });
    return result.id.toString();
  }

  private async deleteImageFromAnnouncement(
    imageId: string,
    announcement: string,
  ): Promise<Announcement> {
    const dbannouncement = await this._repository.updateOne(
      { _id: announcement },
      { $pull: { images: imageId } },
    );

    if (!dbannouncement) throw new NotFoundException('Announcement not found.');

    return dbannouncement;
  }
}
