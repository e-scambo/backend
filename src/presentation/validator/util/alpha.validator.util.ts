export class AlphaValidatorUtil {
  static isValidText(str: string): boolean {
    if (!str) return false;
    return /^([A-ZÀ-Üa-zà-ü0-9!?@#$%\-_+*\\|\/"'\[\]\{\}\(\)]+\s?)*(?<! )$/.test(
      str,
    );
  }
  static isAlphaWithSpaces(str: string): boolean {
    if (!str) return false;
    return /^([A-ZÀ-Üa-zà-ü]+\s?)*(?<! )$/.test(str);
  }
}
