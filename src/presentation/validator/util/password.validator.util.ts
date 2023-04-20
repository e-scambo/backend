export class PasswordValidatorUtil {
  static isValidPassword(password: string): boolean {
    if (!password) return false;
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/.test(password);
  }
}
