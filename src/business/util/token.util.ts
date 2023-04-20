import { sign, decode, verify, JwtPayload } from 'jsonwebtoken';

export interface Jwt_Payload extends JwtPayload {
  email: string;
}

export class TokenUtil {
  static generateToken(ownerId: string, key: number): string | undefined {
    const { JWT_SECRET, JWT_RECOVER_PASS, JWT_TOKEN_EXPIRATION } = process.env;
    if (!ownerId) return undefined;
    const secret = () => {
      if (key === 0) return JWT_RECOVER_PASS;

      return JWT_SECRET;
    };
    try {
      return sign(
        {
          sub: ownerId,
        },
        secret(),
        { expiresIn: JWT_TOKEN_EXPIRATION },
      );
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

    switch (key) {
      case 0:
        return verify(token, JWT_RECOVER_PASS);
      default:
        return verify(token, JWT_SECRET);
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
