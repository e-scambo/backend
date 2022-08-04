import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { LocalizationValidatorUtil } from './util/localization.validator.util';

@ValidatorConstraint({ async: true })
export class IsValidLocalizationConstraint
  implements ValidatorConstraintInterface
{
  validate(str: string): boolean {
    return LocalizationValidatorUtil.isValidLocalization(str);
  }

  defaultMessage?(args?: ValidationArguments): string {
    return `${args.property} must contains letters, dashes and a single space between words or dashes`;
  }
}

export function IsValidLocalization(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidLocalizationConstraint,
    });
  };
}
