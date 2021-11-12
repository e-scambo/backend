import {
  Equals,
  IsDefined,
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { AnnouncementTypes } from '../enum/announcement.enum';
import { IsAlphaWithSpace } from '../validator/is.alpha.with.space.validator';
import { IsValidLocalization } from '../validator/is.valid.localization.validator';
import { IsValidText } from '../validator/is.valid.text.validator';
import { UserParamByIdDTO } from './user.dto';

export class CreateAnnouncementDTO {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsValidText()
  @MinLength(1)
  @MaxLength(100)
  title: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsValidText()
  @MinLength(1)
  @MaxLength(400)
  description: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsIn(Object.values(AnnouncementTypes))
  type: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsAlphaWithSpace()
  category: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsValidLocalization()
  localization: string;

  @ValidateIf((dto) => dto.usage_time !== undefined)
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsAlphaWithSpace()
  usage_time: string;

  images: ImageDTO[];
  owner: string;
}

export class FindAnnouncementDto extends UserParamByIdDTO{

  @IsMongoId()
  announcement_id: string;

}

export class UpdateAnnouncementDto {

  @ValidateIf((dto) => dto.title !== undefined)
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsValidText()
  @MinLength(1)
  @MaxLength(100)
  title: string;

  @ValidateIf((dto) => dto.description !== undefined)
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsValidText()
  @MinLength(1)
  @MaxLength(400)
  description: string;

  @ValidateIf((dto) => dto.type !== undefined)
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsIn(Object.values(AnnouncementTypes))
  type: string;

  @ValidateIf((dto) => dto.category !== undefined)
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsAlphaWithSpace()
  category: string;

  @ValidateIf((dto) => dto.localization !== undefined)
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsValidLocalization()
  localization: string;

  @ValidateIf((dto) => dto.usage_time !== undefined)
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsAlphaWithSpace()
  usage_time: string;

  @Equals(undefined, {message: `This parameter can't be update through this path, please use image's controller resource.`})
  images: ImageDTO[];

  owner: string;
}

type ImageDTO = {
  originalname: string;
  buffer: Buffer;
  size: number;
  mimetype: string;
};
