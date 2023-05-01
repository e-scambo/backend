import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../../infrastructure/repository/user.repository';
import { AuthDTO } from '../../presentation/dto/auth.dto';
import { PasswordUtil } from '../util/password.util';
import { TokenUtil } from '../util/token.util';

@Injectable()
export class AuthService {
  constructor(private readonly _repository: UserRepository) {}

  async auth(credentials: AuthDTO): Promise<string> {
    const user = await this._repository.findOne({ email: credentials.email });
    if (
      !user ||
      !PasswordUtil.isSamePassword(credentials.password, user.password)
    ) {
      throw new UnauthorizedException(
        'Invalid credentials. Please try again with valid credentials.',
      );
    }
    return TokenUtil.generateToken(user.id, 1);
  }
}
