import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../../infrastructure/repository/user.repository';
import { PasswordUtil } from '../util/password.util';
import { TokenUtil } from '../util/token.util';

@Injectable()
export class AuthService {
  constructor(private readonly _repository: UserRepository) {}

  async auth(credentials: any): Promise<string> {
    const user = await this._repository.findOne({ email: credentials.email });
    if (
      !user ||
      !PasswordUtil.isSamePassword(credentials.password, user.password)
    ) {
      throw new UnauthorizedException(
        'Invalid credentials. Please try again with valid credentials.',
      );
    }
    return TokenUtil.generateAccessToken(user.id);
  }
}
