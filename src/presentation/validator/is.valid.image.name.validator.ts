import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ImageValidatorUtil } from './util/image.validator.util';

@ValidatorConstraint({ async: true })
export class IsValidImageNameConstraint
  implements ValidatorConstraintInterface
{
  validate(str: string): boolean {
    return ImageValidatorUtil.isValidImageName(str);
  }

  defaultMessage?(args?: ValidationArguments): string {
    return `${args.property} must be like: IMG_[dateTime]_[HexHash]_[objectId].[jpg,jpeg,png]`;
  }
}

export function IsValidImageName(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidImageNameConstraint,
    });
  };
}
