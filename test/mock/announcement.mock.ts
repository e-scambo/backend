import { ImageMock } from './image.mock';
import { ReadOnlyMock } from './readonly.mock';
import { UserMock } from './user.mock';

export class AnnouncementMock {
  static get request() {
    return {
      owner: ReadOnlyMock.database._id,
      images: [ImageMock.request],
      localization: 'Test Platform',
      category: 'Test',
      type: 'service',
      description: 'This is a mock from test',
      title: 'Mock Test',
      usage_time: undefined,
    };
  }

  static get response() {
    return {
      ...AnnouncementMock.request,
      ...ReadOnlyMock.database,
    };
  }

  static get populatedResponse() {
    return {
      ...AnnouncementMock.request,
      ...ReadOnlyMock.database,
      owner: UserMock.response,
      images: [ImageMock.response],
    };
  }
}
