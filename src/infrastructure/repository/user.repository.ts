import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schema/user.schema';
import { BaseRepository } from './base/repository.base';

@Injectable()
export class UserRepository extends BaseRepository<UserDocument, User> {
  constructor(
    @InjectModel(User.name) protected readonly _model: Model<UserDocument>,
  ) {
    super(_model);
  }
}
