import { PasswordValidatorUtil } from '../../../../../src/presentation/validator/util/password.validator.util';

describe('PasswordValidatorUtil', () => {
  describe('isValidPassword()', () => {
    describe('when validate if string is a valid password', () => {
      it('should return true', () => {
        const result = PasswordValidatorUtil.isValidPassword('pDass*123');
        expect(result).toEqual(true);
      });

      it('should return true', () => {
        const result = PasswordValidatorUtil.isValidPassword('stronG32@3');
        expect(result).toEqual(true);
      });
    });

    describe('when string is not a valid password', () => {
      it('should return false', () => {
        const result = PasswordValidatorUtil.isValidPassword(
          '`p@@SS`%%<p>w oord</p>',
        );
        expect(result).toEqual(false);
      });

      it('should return false', () => {
        const result = PasswordValidatorUtil.isValidPassword('asd');
        expect(result).toEqual(false);
      });
    });

    describe('when string is empty', () => {
      it('should return false', () => {
        const result = PasswordValidatorUtil.isValidPassword('');
        expect(result).toEqual(false);
      });
    });

    describe('when string is null', () => {
      it('should return false', () => {
        const result = PasswordValidatorUtil.isValidPassword(null);
        expect(result).toEqual(false);
      });
    });

    describe('when string is undefined', () => {
      it('should return false', () => {
        const result = PasswordValidatorUtil.isValidPassword(undefined);
        expect(result).toEqual(false);
      });
    });
  });
});
