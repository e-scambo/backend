import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { AlphaValidatorUtil } from './util/alpha.validator.util';

@ValidatorConstraint({ async: true })
export class IsValidTextConstraint implements ValidatorConstraintInterface {
  validate(str: string): boolean {
    return AlphaValidatorUtil.isValidText(str);
  }

  defaultMessage?(args?: ValidationArguments): string {
    return `${args.property} must contains letters, numbers, space and the special characters: "'?!@#$%-_+*:;,./|\[]{}()`;
  }
}

export function IsValidText(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidTextConstraint,
    });
  };
}
