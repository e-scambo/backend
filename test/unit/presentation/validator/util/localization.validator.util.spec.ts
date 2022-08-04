import { LocalizationValidatorUtil } from '../../../../../src/presentation/validator/util/localization.validator.util';

describe('LocalizationValidatorUtil', () => {
  describe('isValidLocalization()', () => {
    describe('when validate if string is a valid phone', () => {
      it('should return true', () => {
        const result = LocalizationValidatorUtil.isValidLocalization(
          'Campina Grande - Paraíba',
        );
        expect(result).toEqual(true);
      });
    });

    describe('when string is not a valid phone', () => {
      it('should return false', () => {
        const result = LocalizationValidatorUtil.isValidLocalization(
          'C4mp1n4 Gr@nd3 - <P4r4ib4>',
        );
        expect(result).toEqual(false);
      });
    });

    describe('when string is empty', () => {
      it('should return false', () => {
        const result = LocalizationValidatorUtil.isValidLocalization('');
        expect(result).toEqual(false);
      });
    });

    describe('when string is null', () => {
      it('should return false', () => {
        const result = LocalizationValidatorUtil.isValidLocalization(null);
        expect(result).toEqual(false);
      });
    });

    describe('when string is undefined', () => {
      it('should return false', () => {
        const result = LocalizationValidatorUtil.isValidLocalization(undefined);
        expect(result).toEqual(false);
      });
    });
  });
});
