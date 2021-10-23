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

  defaultMessage?(validationArguments?: ValidationArguments): string {
    return `${validationArguments.property} must contains letters, numbers and the special characters: !@#$%&*`;
  }
}

export function IsValidPassword(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidPasswordConstraint,
    });
  };
}
