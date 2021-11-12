import { PhoneValidatorUtil } from '../../../../../src/presentation/validator/util/phone.validator.util';

describe('PhoneValidatorUtil', () => {
  describe('isValidPhone()', () => {
    describe('when validate if string is a valid phone', () => {
      it('should return true', () => {
        const result = PhoneValidatorUtil.isValidPhone('(88) 98888-8888');
        expect(result).toEqual(true);
      });
    });

    describe('when string is not a valid phone', () => {
      it('should return false', () => {
        const result = PhoneValidatorUtil.isValidPhone('88988888888');
        expect(result).toEqual(false);
      });
    });

    describe('when string is empty', () => {
      it('should return false', () => {
        const result = PhoneValidatorUtil.isValidPhone('');
        expect(result).toEqual(false);
      });
    });

    describe('when string is null', () => {
      it('should return false', () => {
        const result = PhoneValidatorUtil.isValidPhone(null);
        expect(result).toEqual(false);
      });
    });

    describe('when string is undefined', () => {
      it('should return false', () => {
        const result = PhoneValidatorUtil.isValidPhone(undefined);
        expect(result).toEqual(false);
      });
    });
  });
});
