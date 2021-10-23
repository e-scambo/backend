import * as bcrypt from 'bcrypt';

export class PasswordUtil {
  static encrypt(password: string): string {
    if (!password) return undefined;
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  static isSamePassword(password: string, encryptedPassword: string): boolean {
    if (!password || !encryptedPassword) return false;
    return bcrypt.compareSync(password, encryptedPassword);
  }
}
