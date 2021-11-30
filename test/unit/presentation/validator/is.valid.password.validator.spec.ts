import { ValidationArguments } from 'class-validator';
import { IsValidPasswordConstraint } from '../../../../src/presentation/validator/is.valid.password.validator';

describe('IsValidPasswordConstraint', () => {
  let validator: IsValidPasswordConstraint;

  beforeAll(() => {
    validator = new IsValidPasswordConstraint();
  });

  describe('validate()', () => {
    describe('when validate is successful', () => {
      it('should return true', () => {
        const result = validator.validate('pass*123');
        expect(result).toEqual(true);
      });
    });

    describe('when validate fails', () => {
      it('should return false', () => {
        const result = validator.validate('`p@@SS`%%<p>w oord</p>');
        expect(result).toEqual(false);
      });
    });
  });

  describe('defaultMessage()', () => {
    it('should return the default message', () => {
      const result = validator.defaultMessage({
        property: 'key',
      } as ValidationArguments);
      expect(result).toBe(
        'key must contains letters, numbers and the special characters: !@#$%&*',
      );
    });
  });
});
