import { ValidationArguments } from 'class-validator';
import { getId } from 'json-generator';
import { IsValidImageNameConstraint } from '../../../../src/presentation/validator/is.valid.image.name.validator';

describe('IsValidImageNameConstraint', () => {
  let validator: IsValidImageNameConstraint;

  beforeAll(() => {
    validator = new IsValidImageNameConstraint();
  });

  describe('validate()', () => {
    describe('when validate is successful', () => {
      it('should return true', () => {
        const name = `IMG_${new Date().getTime()}_${getId('objectId')}.jpg`;
        const result = validator.validate(name);
        expect(result).toEqual(true);
      });
    });

    describe('when validate fails', () => {
      it('should return false', () => {
        const result = validator.validate('image.jpg');
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
        'key must be like: IMG_[dateTime]_[objectId].[jpg,jpeg,png]';
      expect(result).toBe(expectMessage);
    });
  });
});
