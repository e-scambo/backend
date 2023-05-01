import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class IdsMatchGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const paramsId = req.params.user_id;
    const bodyId = req.user.id;
    if (!paramsId || !bodyId || paramsId !== bodyId) {
      throw new ForbiddenException("A user cannot alter another's user data.");
    }

    return true;
  }
}
