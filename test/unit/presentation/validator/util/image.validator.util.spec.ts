import { getId } from 'json-generator';
import { ImageValidatorUtil } from '../../../../../src/presentation/validator/util/image.validator.util';

describe('ImageValidatorUtil', () => {
  describe('isValidImageName()', () => {
    describe('when validate if string is a valid phone', () => {
      it('should return true', () => {
        const name = `IMG_${new Date().getTime()}_${getId('objectId')}.jpg`;
        const result = ImageValidatorUtil.isValidImageName(name);
        expect(result).toEqual(true);
      });
    });

    describe('when string is not a valid phone', () => {
      it('should return false', () => {
        const result = ImageValidatorUtil.isValidImageName('image.jpeg');
        expect(result).toEqual(false);
      });
    });

    describe('when string is empty', () => {
      it('should return false', () => {
        const result = ImageValidatorUtil.isValidImageName('');
        expect(result).toEqual(false);
      });
    });

    describe('when string is null', () => {
      it('should return false', () => {
        const result = ImageValidatorUtil.isValidImageName(null);
        expect(result).toEqual(false);
      });
    });

    describe('when string is undefined', () => {
      it('should return false', () => {
        const result = ImageValidatorUtil.isValidImageName(undefined);
        expect(result).toEqual(false);
      });
    });
  });
});
