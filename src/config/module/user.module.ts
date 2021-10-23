import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from '../../business/service/user.service';
import { UserRepository } from '../../infrastructure/repository/user.repository';
import { User, UserSchema } from '../../infrastructure/schema/user.schema';
import { UserController } from '../../presentation/controller/user.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
})
export class UserModule {}
