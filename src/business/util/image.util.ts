import { randomBytes } from "crypto";
export class ImageUtil {
  
  static generateImageName(ownerId: string, mimetype: string): string {
    const time = Date.now();
    const randomHash = randomBytes(8).toString('hex');
    const format = mimetype.split('/')[1];

    return `IMG_${time}_${randomHash}_${ownerId}.${format}`;
  }

  static isImageOwner(ownerId: string, imgName: string): Boolean {
    const owner = imgName.split('_')[2]
    return owner.substring(0, owner.indexOf('.') - 1) === ownerId
  }
}
