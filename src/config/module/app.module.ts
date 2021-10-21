import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from '../../presentation/controller/app.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_URL, {
      retryDelay: 2000,
      retryAttempts: 3,
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
