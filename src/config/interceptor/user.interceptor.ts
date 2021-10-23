import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { UserDocument } from '../../infrastructure/schema/user.schema';

@Injectable()
export class UserInterceptor implements NestInterceptor {
  intercept(
    _: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data: UserDocument | UserDocument[]) => {
        if (data) {
          if (data instanceof Array) {
            return data.map((user) => this.removePassword(user));
          }
          return this.removePassword(data);
        }
      }),
    );
  }

  private removePassword(data: UserDocument) {
    const result = data.toObject();
    delete result.password;
    return result;
  }
}
