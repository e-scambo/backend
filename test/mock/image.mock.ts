import { readFileSync } from 'fs';
import { ReadOnlyMock } from './readonly.mock';

export class ImageMock {
  static get request() {
    const file = readFileSync('test/asset/nestjs.png');
    return {
      mimetype: 'image/jpeg',
      size: file.length,
      buffer: file,
      originalname: 'nestjs.png',
    };
  }

  static get response() {
    return {
      ...ImageMock.request,
      ...ReadOnlyMock.database,
    };
  }
}
