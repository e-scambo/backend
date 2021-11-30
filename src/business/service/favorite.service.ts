import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MongoQueryModel } from 'nest-mongo-query-parser';
import { AnnouncementRepository } from '../../infrastructure/repository/announcement.repository';
import { FavoriteRepository } from '../../infrastructure/repository/favorite.repository';
import { UserRepository } from '../../infrastructure/repository/user.repository';
import { Favorite } from '../../infrastructure/schema/favorite.schema';
import { CreateFavoriteDTO } from '../../presentation/dto/favorite.dto';

@Injectable()
export class FavoriteService {
  constructor(
    private readonly _repository: FavoriteRepository,
    private readonly _userRepository: UserRepository,
    private readonly _announcementRepository: AnnouncementRepository,
  ) {}

  async create(item: CreateFavoriteDTO): Promise<Favorite> {
    await this.validateFavorite(item);
    return this._repository.create(item);
  }

  async findWithQuery(query: MongoQueryModel): Promise<Favorite[]> {
    return this._repository.findWithQuery(query);
  }

  async findById(_id: string, owner: string): Promise<Favorite> {
    const result = await this._repository.findOne({ _id, owner });
    if (!result) {
      throw new NotFoundException('Favorite not found or already removed.');
    }
    return result;
  }

  async deleteById(_id: string, owner: string): Promise<void> {
    const result = await this._repository.deleteOne({ _id, owner });
    if (!result) {
      throw new NotFoundException('Favorite not found or already removed.');
    }
  }

  private async validateFavorite(item: CreateFavoriteDTO): Promise<void> {
    const exists = await this._repository.checkExists({
      owner: item.owner,
      announcement: item.announcement,
    });
    if (exists) {
      throw new ConflictException(
        'The user has already saved the announcement as a favorite.',
      );
    }
    const userExists = await this._userRepository.checkExists({
      _id: item.owner,
    });
    if (!userExists) {
      throw new NotFoundException('User not found or already removed.');
    }
    const announcementExists = await this._announcementRepository.checkExists({
      _id: item.announcement,
    });
    if (!announcementExists) {
      throw new NotFoundException('Announcement not found or already removed.');
    }
  }
}
