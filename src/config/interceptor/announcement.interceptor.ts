import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import {
  Announcement,
  AnnouncementDocument,
} from '../../infrastructure/schema/announcement.schema';
import { Image } from '../../infrastructure/schema/image.schema';

@Injectable()
export class AnnouncementInterceptor implements NestInterceptor {
  intercept(
    _: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data: AnnouncementDocument | AnnouncementDocument[]) => {
        if (data) {
          if (data instanceof Array) {
            return data.map((user) => this.toObject(user));
          }
          return this.toObject(data);
        }
      }),
    );
  }

  private toObject(data: AnnouncementDocument) {
    const result = data.toObject();
    const images = result.images.map((image: string | Image) => {
      if (typeof image === 'object') {
        delete image.buffer;
      }
      return image;
    });
    return { ...result, images };
  }
}
