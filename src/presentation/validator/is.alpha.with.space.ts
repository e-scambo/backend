import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { AlphaValidatorUtil } from './util/alpha.validator.util';

@ValidatorConstraint({ async: true })
export class IsAlphaWithSpaceConstraint
  implements ValidatorConstraintInterface
{
  validate(str: string): boolean {
    return AlphaValidatorUtil.isAlphaWithSpaces(str);
  }

  defaultMessage?(args?: ValidationArguments): string {
    return `${args.property} must contains letters and a single space between words`;
  }
}

export function IsAlphaWithSpace(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsAlphaWithSpaceConstraint,
    });
  };
}
