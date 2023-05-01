import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from '../../business/service/user.service';
import { Jwt_Payload, TokenUtil } from '../../business/util/token.util';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private userService: UserService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.headers.authorization) {
      throw new UnauthorizedException('Lack credentials.');
    }

    const token = request.headers.authorization.replace('Bearer ', '');

    if (!token) {
      throw new UnauthorizedException('Lack credentials.');
    }

    const payload = TokenUtil.verifyToken(token, 1) as Jwt_Payload;

    return this.userService
      .findById(payload.sub)
      .then((user) => {
        request.user = user;

        return true;
      })
      .catch(() => {
        throw new UnauthorizedException('JsonWebTokenError: invalid token.');
      });
  }
}
