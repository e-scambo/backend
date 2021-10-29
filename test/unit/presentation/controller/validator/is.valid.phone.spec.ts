import { ValidationArguments } from 'class-validator';
import { IsValidPhoneConstraint } from '../../../../../src/presentation/validator/is.valid.phone';

describe('IsValidPhoneConstraint', () => {
  let validator: IsValidPhoneConstraint;

  beforeAll(() => {
    validator = new IsValidPhoneConstraint();
  });

  describe('validate()', () => {
    describe('when validate is successful', () => {
      it('should return true', () => {
        const result = validator.validate('(88) 98888-8888');
        expect(result).toEqual(true);
      });
    });

    describe('when validate fails', () => {
      it('should return false', () => {
        const result = validator.validate('88988888888');
        expect(result).toEqual(false);
      });
    });
  });

  describe('defaultMessage()', () => {
    it('should return the default message', () => {
      const result = validator.defaultMessage({
        property: 'key',
      } as ValidationArguments);
      const expectMessage =
        'key must follow the pattern (XX) 9XXXX-XXXX or (XX) XXXX-XXXX ' +
        'and the ddd must be betwween 11 and 99';
      expect(result).toBe(expectMessage);
    });
  });
});
