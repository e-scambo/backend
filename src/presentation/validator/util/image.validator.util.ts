export class ImageValidatorUtil {
  static isValidImageName(name: string): boolean {
    if (!name) return false;
    return /IMG_\d{13}_([a-f\d]{24}).(jpg|png|jpeg)$/.test(name);
  }

  static isValidMimetype(mimetype: string): boolean {
    return /image\/(jpg|jpeg|png)/.test(mimetype);
  }
}
