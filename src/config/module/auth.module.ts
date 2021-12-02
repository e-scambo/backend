import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from '../../business/service/auth.service';
import { UserRepository } from '../../infrastructure/repository/user.repository';
import { User, UserSchema } from '../../infrastructure/schema/user.schema';
import { AuthController } from '../../presentation/controller/auth.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepository],
})
export class AuthModule {}
