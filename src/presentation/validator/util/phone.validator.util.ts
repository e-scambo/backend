export class PhoneValidatorUtil {
  static isValidPhone(phone: string): boolean {
    if (!phone) return false;
    return /^(\([1-9][1-9]\)\s((9\d\d\d\d-\d\d\d\d)|(\d\d\d\d-\d\d\d\d)))$/.test(
      phone,
    );
  }
}
