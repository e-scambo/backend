import { ValidationArguments } from 'class-validator';
import { IsValidLocalizationConstraint } from '../../../../src/presentation/validator/is.valid.localization.validator';

describe('IsValidLocalizationConstraint', () => {
  let validator: IsValidLocalizationConstraint;

  beforeAll(() => {
    validator = new IsValidLocalizationConstraint();
  });

  describe('validate()', () => {
    describe('when validate is successful', () => {
      it('should return true', () => {
        const result = validator.validate('Campina Grande - Paraíba');
        expect(result).toEqual(true);
      });
    });

    describe('when validate fails', () => {
      it('should return false', () => {
        const result = validator.validate('C4mp1n4 Gr@nd3 - <P4r4ib4>');
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
        'key must contains letters, dashes and a single space between words or dashes';
      expect(result).toBe(expectMessage);
    });
  });
});
