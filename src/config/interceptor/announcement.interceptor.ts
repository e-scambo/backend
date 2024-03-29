import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { AnnouncementDocument } from '../../infrastructure/schema/announcement.schema';

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
            return data.map((announcement) => announcement.toObject());
          }
          return data.toObject();
        }
      }),
    );
  }
}
