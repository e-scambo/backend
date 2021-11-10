export class ImageUtil {
  static generateImageName(ownerId: string, mimetype: string): string {
    return `IMG_${new Date().getTime()}_${ownerId}.${mimetype.split('/')[1]}`;
  }

  static isImageOwner(ownerId: string, imgName: string): Boolean {
    const owner = imgName.split('_')[2]
    return owner.substring(0, owner.indexOf('.') - 1) === ownerId
  }
}
