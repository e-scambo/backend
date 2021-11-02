import {
  IsDefined,
  IsIn,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { AnnouncementTypes } from '../enum/announcement.enum';
import { IsAlphaWithSpace } from '../validator/is.alpha.with.space';
import { IsValidLocalization } from '../validator/is.valid.localization';
import { IsValidText } from '../validator/is.valid.text';

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

type ImageDTO = {
  originalname: string;
  buffer: Buffer;
  size: number;
  mimetype: string;
};
