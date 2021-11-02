import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Image, ImageDocument } from '../schema/image.schema';
import { BaseRepository } from './base/repository.base';

@Injectable()
export class ImageRepository extends BaseRepository<ImageDocument, Image> {
  constructor(
    @InjectModel(Image.name) protected readonly _model: Model<ImageDocument>,
  ) {
    super(_model);
  }

  async createMany(image: Image[]): Promise<ImageDocument[]> {
    return this._model.insertMany(image);
  }

  async deleteMany(filter: FilterQuery<ImageDocument>): Promise<void> {
    await this._model.deleteMany(filter);
  }
}
