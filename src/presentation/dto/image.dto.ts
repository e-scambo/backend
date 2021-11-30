import { IsMongoId } from 'class-validator';
import { IsValidImageName } from '../validator/is.valid.image.name.validator';

export class FindImageByNameDTO {
  @IsValidImageName()
  name: string;
}

export class DeleteImageDTO {
  @IsMongoId()
  image_id: string;

  @IsMongoId()
  announcement_id: string;

  @IsMongoId()
  user_id: string;
}
