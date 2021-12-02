import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { UserParamByIdDTO } from './user.dto';

export class CreateFavoriteDTO {
  
  @ApiProperty({
    writeOnly: true,
    description: 'Id do anúncio',
    example: '61a8d53d0b06e1827428b042',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  announcement: string;
  
  @ApiProperty({
    writeOnly: true,
    description: 'Id do anúncio',
    example: '61a8d53d0b06e1827428b042',
  })
  owner: string;
}

export class FavoriteParamByIdDTO extends UserParamByIdDTO {
  @IsMongoId()
  favorite_id: string;
}
