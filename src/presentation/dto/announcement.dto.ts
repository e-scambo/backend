import { ApiProperty } from '@nestjs/swagger';
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
import { IsValidImageName } from '../validator/is.valid.image.name.validator';
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
  @ApiProperty({
    writeOnly: true,
    description: 'Título do anúncio.',
    example: 'Curso de Formação - Uso da Plataforma E-Scambo',
  })
  title: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsValidText()
  @MinLength(1)
  @MaxLength(400)
  @ApiProperty({
    writeOnly: true,
    description: 'Descrição do anúncio.',
    example: 'Aprenda como utilizar a plataforma E-Scambo por completo!',
  })
  description: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsIn(Object.values(AnnouncementTypes))
  @ApiProperty({
    writeOnly: true,
    description: 'Tipo do anúncio.',
    enum: Object.values(AnnouncementTypes),
    example: AnnouncementTypes.PRODUCT,
  })
  type: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsAlphaWithSpace()
  @ApiProperty({
    writeOnly: true,
    description: 'Categoria do anúncio.',
    example: 'Cursos',
  })
  category: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsValidLocalization()
  @ApiProperty({
    writeOnly: true,
    description: 'Localização do anúncio.',
    example: 'Campina Grande - PB',
  })
  localization: string;

  @ValidateIf((dto) => dto.usage_time !== undefined)
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsAlphaWithSpace()
  @ApiProperty({
    writeOnly: true,
    required: false,
    nullable: true,
    description:
      'Tempo de uso do produto anunciado. Se for um serviço, esse parâmetro não precisa ser informado.',
    example: 'Novo',
    default: undefined,
  })
  usage_time: string;

  @ApiProperty({
    type: 'array',
    description: 'Imagens do anúncio. Pelo menos uma imagem é requerida.',
    items: {
      type: 'string',
      format: 'binary',
    },
  })
  images: ImageDTO[];
  owner: string;
}

export class FindAnnouncementDto extends UserParamByIdDTO {
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
  @ApiProperty({
    required: false,
    writeOnly: true,
    description: 'Título do anúncio.',
    example: 'Curso de Formação - Uso da Plataforma E-Scambo',
  })
  title: string;

  @ValidateIf((dto) => dto.description !== undefined)
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsValidText()
  @MinLength(1)
  @MaxLength(400)
  @ApiProperty({
    required: false,
    writeOnly: true,
    description: 'Descrição do anúncio.',
    example: 'Aprenda como utilizar a plataforma E-Scambo por completo!',
  })
  description: string;

  @ValidateIf((dto) => dto.type !== undefined)
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsIn(Object.values(AnnouncementTypes))
  @ApiProperty({
    required: false,
    writeOnly: true,
    description: 'Tipo do anúncio.',
    enum: Object.values(AnnouncementTypes),
    example: AnnouncementTypes.PRODUCT,
  })
  type: string;

  @ValidateIf((dto) => dto.category !== undefined)
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsAlphaWithSpace()
  @ApiProperty({
    required: false,
    writeOnly: true,
    description: 'Categoria do anúncio.',
    example: 'Cursos',
  })
  category: string;

  @ValidateIf((dto) => dto.localization !== undefined)
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsValidLocalization()
  @ApiProperty({
    required: false,
    writeOnly: true,
    description: 'Localização do anúncio.',
    example: 'Campina Grande - PB',
  })
  localization: string;

  @ValidateIf((dto) => dto.usage_time !== undefined)
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsAlphaWithSpace()
  @ApiProperty({
    writeOnly: true,
    required: false,
    nullable: true,
    description:
      'Tempo de uso do produto anunciado. Se for um serviço, esse parâmetro não precisa ser informado.',
    example: 'Novo',
    default: undefined,
  })
  usage_time: string;

  @Equals(undefined, {
    message: `This parameter can't be update through this path, please use image's controller resource.`,
  })
  images: ImageDTO[];

  owner: string;
}

export class AnnouncementImageDTO extends UserParamByIdDTO{

  @IsMongoId()
  announcement_id: string;

}

export class DeleteAnnouncementImageDTO extends UserParamByIdDTO{

  @IsMongoId()
  announcement_id: string;

  @IsValidImageName()
  name: string

}

export type ImageDTO = {
  originalname: string;
  buffer: Buffer;
  size: number;
  mimetype: string;
};
