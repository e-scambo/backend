import { UnauthorizedException } from '@nestjs/common';
import { sign, decode, verify, JwtPayload } from 'jsonwebtoken';
import { Types } from 'mongoose';

export interface Jwt_Payload extends JwtPayload {
  id: Types.ObjectId;
}

export class TokenUtil {
  static generateToken(ownerId: string, key: number): string | undefined {
    const {
      JWT_SECRET,
      JWT_RECOVER_PASS,
      JWT_TOKEN_EXPIRATION,
      JWT_RECOVER_PASS_EXPIRATION,
    } = process.env;
    if (!ownerId) return undefined;

    try {
      switch (key) {
        case 0:
          return sign(
            {
              sub: ownerId,
            },
            JWT_RECOVER_PASS,
            { expiresIn: JWT_RECOVER_PASS_EXPIRATION },
          );
        default:
          return sign(
            {
              sub: ownerId,
            },
            JWT_SECRET,
            { expiresIn: JWT_TOKEN_EXPIRATION },
          );
      }
    } catch (err) {
      return undefined;
    }
  }

  static verifyToken(
    token: string,
    key: number,
  ): string | JwtPayload | undefined {
    const { JWT_SECRET, JWT_RECOVER_PASS } = process.env;
    if (!token) return undefined;

    try {
      switch (key) {
        case 0:
          return verify(token, JWT_RECOVER_PASS);
        default:
          return verify(token, JWT_SECRET);
      }
    } catch (err) {
      throw new UnauthorizedException('JsonWebTokenError: invalid token.');
    }
  }

  static getTokenPayloadSub(token: string): string | undefined {
    try {
      const payload = decode(token, { json: true });
      return payload.sub ?? undefined;
    } catch (err) {
      return undefined;
    }
  }

  static getTokenPayloadExp(token: string): number | undefined {
    try {
      const payload = decode(token, { json: true });
      return payload.exp ?? undefined;
    } catch (err) {
      return undefined;
    }
  }
}
