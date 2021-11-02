import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { UserService } from '../../src/business/service/user.service';
import { AllExceptionsFilter } from '../../src/config/filter/exception.filter';
import { UserRepository } from '../../src/infrastructure/repository/user.repository';
import { User, UserSchema } from '../../src/infrastructure/schema/user.schema';
import { UserController } from '../../src/presentation/controller/user.controller';

export async function bootstrapTest(): Promise<INestApplication> {
  const moduleFixture = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot(),
      MongooseModule.forRoot(process.env.TEST_DATABASE_URL, {
        retryDelay: 2000,
        retryAttempts: 3,
      }),
      MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ],
    controllers: [UserController],
    providers: [UserService, UserRepository],
  }).compile();

  const app = moduleFixture.createNestApplication();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());
  return app;
}