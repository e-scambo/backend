import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PasswordValidatorUtil } from './util/password.validator.util';

@ValidatorConstraint({ async: true })
export class IsValidPasswordConstraint implements ValidatorConstraintInterface {
  validate(str: string): boolean {
    return PasswordValidatorUtil.isValidPassword(str);
  }

  defaultMessage?(args?: ValidationArguments): string {
    return `${args.property} must contains letters, numbers and the special characters: !@#$%&*`;
  }
}

export function IsValidPassword(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidPasswordConstraint,
    });
  };
}
