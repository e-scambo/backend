import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: true })
export class IsValidPasswordConstraint implements ValidatorConstraintInterface {
  message: string = '';
  validate(value: any, args?: ValidationArguments) {
    const relatedValue = args?.object?.[args?.constraints?.[0]];
    const bool = relatedValue
      ? typeof value === 'string' && typeof relatedValue === 'string'
      : typeof value === 'string';
    let isValidPassword = true;

    if (!/(.*[a-z])/.test(value)) {
      this.message +=
        'The password must contain at least one lowercase character. ';
      isValidPassword = false;
    }
    if (!/(.*[A-Z])/.test(value)) {
      this.message +=
        'The password must contain at least one uppercase character. ';
      isValidPassword = false;
    }
    if (!/(.*\d)/.test(value)) {
      this.message += 'The password must contain at least one digit. ';
      isValidPassword = false;
    }
    if (!/(.*[^a-zA-Z0-9])/.test(value)) {
      this.message +=
        'The password must contain at least one non latin character.';
      isValidPassword = false;
    }

    return bool && isValidPassword;
  }
  defaultMessage(args: ValidationArguments) {
    const temp = this.message.trim();
    this.message = '';
    return temp;
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
