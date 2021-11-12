import { IsValidImageName } from '../validator/is.valid.image.name.validator';

export class FindImageByNameDTO {
  @IsValidImageName()
  name: string;
}
