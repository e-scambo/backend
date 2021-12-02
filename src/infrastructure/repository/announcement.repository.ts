import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { MongoQueryModel } from 'nest-mongo-query-parser';
import {
  Announcement,
  AnnouncementDocument,
  AnnouncementPopulate,
} from '../schema/announcement.schema';
import { BaseRepository } from './base/repository.base';

@Injectable()
export class AnnouncementRepository extends BaseRepository<
  AnnouncementDocument,
  Announcement
> {
  constructor(
    @InjectModel(Announcement.name)
    protected readonly _model: Model<AnnouncementDocument>,
  ) {
    super(_model);
  }

  async findWithQuery(query: MongoQueryModel): Promise<Announcement[]> {
    return this._model
      .find(query.filter)
      .limit(query.limit)
      .skip(query.skip)
      .select(query.select)
      .sort(query.sort)
      .populate(AnnouncementPopulate)
      .exec();
  }

  async findOne(
    filter: FilterQuery<AnnouncementDocument>,
  ): Promise<AnnouncementDocument> {
    return this._model.findOne(filter).populate(AnnouncementPopulate).exec();
  }

  async updateOne(
    filter: FilterQuery<AnnouncementDocument>,
    body: UpdateQuery<AnnouncementDocument>,
  ): Promise<AnnouncementDocument> {
    return this._model
      .findOneAndUpdate(filter, body, { new: true })
      .populate(AnnouncementPopulate)
      .exec();
  }
}
