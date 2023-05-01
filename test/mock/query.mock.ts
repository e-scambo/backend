import { MongoQueryModel } from 'nest-mongo-query-parser';

export class QueryMock {
  static get default(): MongoQueryModel {
    return {
      filter: {},
      limit: 100,
      skip: 0,
      select: {},
      sort: {},
      populate: [],
    } as unknown as MongoQueryModel;
  }
}
