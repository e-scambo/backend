import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FavoriteService } from '../../business/service/favorite.service';
import { AnnouncementRepository } from '../../infrastructure/repository/announcement.repository';
import { FavoriteRepository } from '../../infrastructure/repository/favorite.repository';
import { UserRepository } from '../../infrastructure/repository/user.repository';
import {
  Announcement,
  AnnouncementSchema,
} from '../../infrastructure/schema/announcement.schema';
import {
  Favorite,
  FavoriteSchema,
} from '../../infrastructure/schema/favorite.schema';
import { User, UserSchema } from '../../infrastructure/schema/user.schema';
import { UserFavoriteController } from '../../presentation/controller/user.favorite.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Favorite.name, schema: FavoriteSchema },
      { name: User.name, schema: UserSchema },
      { name: Announcement.name, schema: AnnouncementSchema },
    ]),
  ],
  controllers: [UserFavoriteController],
  providers: [
    FavoriteService,
    FavoriteRepository,
    UserRepository,
    AnnouncementRepository,
  ],
})
export class FavoriteModule {}
