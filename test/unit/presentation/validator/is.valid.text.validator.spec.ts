import { ValidationArguments } from 'class-validator';
import { IsValidTextConstraint } from '../../../../src/presentation/validator/is.valid.text.validator';

describe('IsValidTextConstraint', () => {
  let validator: IsValidTextConstraint;

  beforeAll(() => {
    validator = new IsValidTextConstraint();
  });

  describe('validate()', () => {
    describe('when validate is successful', () => {
      it('should return true', () => {
        const result = validator.validate('Hello API');
        expect(result).toEqual(true);
      });
    });

    describe('when validate fails', () => {
      it('should return false', () => {
        const result = validator.validate('<H3ll0> 4P1');
        expect(result).toEqual(false);
      });
    });
  });

  describe('defaultMessage()', () => {
    it('should return the default message', () => {
      const result = validator.defaultMessage({
        property: 'key',
      } as ValidationArguments);
      const expectMessage = `key must contains letters, numbers, space and the special characters: "'?!@#$%-_+*:;,./|\[]{}()`;
      expect(result).toBe(expectMessage);
    });
  });
});
