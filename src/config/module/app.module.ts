import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from '../../presentation/controller/app.controller';
import { AnnouncementModule } from './announcement.module';
import { AuthModule } from './auth.module';
import { FavoriteModule } from './favorite.module';
import { ImageModule } from './image.module';
import { UserModule } from './user.module';
import { HealthModule } from './health.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_URL, {
      retryDelay: 2000,
      retryAttempts: 3,
    }),
    AnnouncementModule,
    AuthModule,
    FavoriteModule,
    ImageModule,
    UserModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
