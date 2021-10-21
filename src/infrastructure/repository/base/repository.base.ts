import { FilterQuery, Model, UpdateQuery } from 'mongoose';

export class BaseRepository<Document, Entity> {
  constructor(protected readonly _model: Model<Document>) {}

  async create(item: Entity): Promise<Document> {
    return this._model.create(item);
  }

  async find(filter: FilterQuery<Document>): Promise<Document[]> {
    return this._model.find(filter);
  }

  async findOne(filter: FilterQuery<Document>): Promise<Document> {
    return this._model.findOne(filter);
  }

  async updateOne(
    filter: FilterQuery<Document>,
    item: UpdateQuery<Document>,
  ): Promise<Document> {
    return this._model.findOneAndUpdate(filter, item, {
      new: true,
    });
  }

  async deleteOne(filter: FilterQuery<Document>): Promise<Document> {
    return this._model.findOneAndDelete(filter);
  }

  async checkExists(filter: FilterQuery<Document>): Promise<boolean> {
    const result = await this._model.findOne(filter);
    return !!result;
  }
}
