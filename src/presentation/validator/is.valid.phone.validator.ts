import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PhoneValidatorUtil } from './util/phone.validator.util';

@ValidatorConstraint({ async: true })
export class IsValidPhoneConstraint implements ValidatorConstraintInterface {
  validate(str: string): boolean {
    return PhoneValidatorUtil.isValidPhone(str);
  }

  defaultMessage?(args?: ValidationArguments): string {
    return (
      `${args.property} must follow the pattern (XX) 9XXXX-XXXX or (XX) XXXX-XXXX ` +
      'and the ddd must be betwween 11 and 99'
    );
  }
}

export function IsValidPhone(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidPhoneConstraint,
    });
  };
}
