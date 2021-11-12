import { AlphaValidatorUtil } from '../../../../../src/presentation/validator/util/alpha.validator.util';

describe('AlphaValidatorUtil', () => {
  describe('isAlphaWithSpaces()', () => {
    describe('when validate if string is alpha with spaces', () => {
      it('should return true', () => {
        const result = AlphaValidatorUtil.isAlphaWithSpaces('Hello API');
        expect(result).toEqual(true);
      });
    });

    describe('when string is not alpha with spaces', () => {
      it('should return false', () => {
        const result = AlphaValidatorUtil.isAlphaWithSpaces('H3ll0 4P1');
        expect(result).toEqual(false);
      });
    });

    describe('when string is empty', () => {
      it('should return false', () => {
        const result = AlphaValidatorUtil.isAlphaWithSpaces('');
        expect(result).toEqual(false);
      });
    });

    describe('when string is null', () => {
      it('should return false', () => {
        const result = AlphaValidatorUtil.isAlphaWithSpaces(null);
        expect(result).toEqual(false);
      });
    });

    describe('when string is undefined', () => {
      it('should return false', () => {
        const result = AlphaValidatorUtil.isAlphaWithSpaces(undefined);
        expect(result).toEqual(false);
      });
    });
  });

  describe('isValidText()', () => {
    describe('when validate if string is a valid tgext', () => {
      it('should return true', () => {
        const result = AlphaValidatorUtil.isValidText('Hello API');
        expect(result).toEqual(true);
      });
    });

    describe('when string is not a valid text', () => {
      it('should return false', () => {
        const result = AlphaValidatorUtil.isValidText('<H3ll0> 4P1');
        expect(result).toEqual(false);
      });
    });

    describe('when string is empty', () => {
      it('should return false', () => {
        const result = AlphaValidatorUtil.isValidText('');
        expect(result).toEqual(false);
      });
    });

    describe('when string is null', () => {
      it('should return false', () => {
        const result = AlphaValidatorUtil.isValidText(null);
        expect(result).toEqual(false);
      });
    });

    describe('when string is undefined', () => {
      it('should return false', () => {
        const result = AlphaValidatorUtil.isValidText(undefined);
        expect(result).toEqual(false);
      });
    });
  });
});
