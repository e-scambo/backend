import { IsValidImageName } from '../validator/is.valid.image.name';

export class FindImageByNameDTO {
  @IsValidImageName()
  name: string;
}
