export class LocalizationValidatorUtil {
  static isValidLocalization(str: string): boolean {
    if (!str) return false;
    return /^([A-ZÀ-Üa-zà-ü\-]+\s?)*(?<! )$/.test(str);
  }
}
