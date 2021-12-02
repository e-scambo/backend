import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { FavoriteDocument } from '../../infrastructure/schema/favorite.schema';

@Injectable()
export class FavoriteInterceptor implements NestInterceptor {
  intercept(
    _: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data: FavoriteDocument | FavoriteDocument[]) => {
        if (data) {
          if (data instanceof Array) {
            return data.map((favorite) => favorite.toObject());
          }
          return data.toObject();
        }
      }),
    );
  }
}
