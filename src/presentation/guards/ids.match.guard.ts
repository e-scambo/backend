import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Types } from 'mongoose';

@Injectable()
export class IdsMatchGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const paramsId = req.params.user_id;
    const bodyId = req.user.id;
    if (!paramsId || !bodyId) {
      return false;
    }
    return paramsId === bodyId;
  }
}
