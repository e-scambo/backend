export class ImageUtil {
  static generateImageName(ownerId: string, mimetype: string): string {
    return `IMG_${new Date().getTime()}_${ownerId}.${mimetype.split('/')[1]}`;
  }
}
