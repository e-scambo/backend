export class QueryMock {
  static get default() {
    return {
      filter: {},
      limit: 100,
      skip: 0,
      select: {},
      sort: {},
      populate: [],
    };
  }
}
