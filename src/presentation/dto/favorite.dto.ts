import { IsDefined, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { UserParamByIdDTO } from './user.dto';

export class CreateFavoriteDTO {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  announcement: string;
  
  owner: string;
}

export class FavoriteParamByIdDTO extends UserParamByIdDTO {
  @IsMongoId()
  favorite_id: string;
}
