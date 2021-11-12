import {
  Equals,
  IsDefined,
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { IsAlphaWithSpace } from '../validator/is.alpha.with.space.validator';
import { IsValidPassword } from '../validator/is.valid.password.validator';
import { IsValidPhone } from '../validator/is.valid.phone.validator';

export class CreateUserDTO {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsAlphaWithSpace()
  name: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @IsValidPassword()
  password: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsAlphaWithSpace()
  city: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsAlphaWithSpace()
  state: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsValidPhone()
  phone: string;
}

export class UserParamByIdDTO {
  @IsMongoId()
  user_id: string;
}

export class UpdateUserDTO {
  @ValidateIf((dto) => dto.name !== undefined)
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsAlphaWithSpace()
  name: string;

  @ValidateIf((dto) => dto.email !== undefined)
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Equals(undefined, {
    message:
      'password cannot be updated here, please use the proper endpoint for this operation',
  })
  password: string;

  @ValidateIf((dto) => dto.city !== undefined)
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsAlphaWithSpace()
  city: string;

  @ValidateIf((dto) => dto.state !== undefined)
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsAlphaWithSpace()
  state: string;

  @ValidateIf((dto) => dto.phone !== undefined)
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsValidPhone()
  phone: string;
}

export class UpdatePasswordDTO {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @IsValidPassword()
  current_password: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @IsValidPassword()
  new_password: string;
}
