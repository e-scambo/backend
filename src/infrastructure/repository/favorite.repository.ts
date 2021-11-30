import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { MongoQueryModel } from 'nest-mongo-query-parser';
import {
  Favorite,
  FavoriteDocument,
  FavoritePopulate,
} from '../schema/favorite.schema';
import { BaseRepository } from './base/repository.base';

@Injectable()
export class FavoriteRepository extends BaseRepository<
  FavoriteDocument,
  Favorite
> {
  constructor(
    @InjectModel(Favorite.name)
    protected readonly _model: Model<FavoriteDocument>,
  ) {
    super(_model);
  }

  async findWithQuery(query: MongoQueryModel): Promise<FavoriteDocument[]> {
    return this._model
      .find(query.filter)
      .limit(query.limit)
      .skip(query.skip)
      .select(query.select)
      .sort(query.sort)
      .populate(FavoritePopulate)
      .exec();
  }

  async findOne(
    filter: FilterQuery<FavoriteDocument>,
  ): Promise<FavoriteDocument> {
    return this._model.findOne(filter).populate(FavoritePopulate).exec();
  }

  async deleteMany(filter: FilterQuery<FavoriteDocument>): Promise<void> {
    await this._model.deleteMany(filter);
  }
}
