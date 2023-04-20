import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { PasswordUtil } from 'src/business/util/password.util';
import { PasswordValidatorUtil } from './util/password.validator.util';

@ValidatorConstraint({ async: true })
export class IsValidPasswordConstraint implements ValidatorConstraintInterface {
  validate(value: any, args?: ValidationArguments) {
    const relatedValue = args?.object?.[args?.constraints?.[0]];
    const bool = relatedValue
      ? typeof value === 'string' && typeof relatedValue === 'string'
      : typeof value === 'string';

    return bool && PasswordValidatorUtil.isValidPassword(value);
  }
  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return 'key must contains letters, numbers and non latin characters.';
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
