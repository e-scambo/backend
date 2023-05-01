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
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MailerModule.forRoot({
      transport: {
        service: process.env.SMTP_HOST,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASS,
        },
        port: 2525,
        secure: true,
      },
    }),
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
