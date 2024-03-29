import { IsValidPasswordConstraint } from '../../../../src/presentation/validator/is.valid.password.validator';

describe('IsValidPasswordConstraint', () => {
  let validator: IsValidPasswordConstraint;

  beforeAll(() => {
    validator = new IsValidPasswordConstraint();
  });

  describe('validate()', () => {
    describe('when validate is successful', () => {
      it('should return true', () => {
        const result = validator.validate('Dpass*123');
        expect(result).toEqual(true);
      });
    });

    describe('when validate fails', () => {
      it('should return false', () => {
        const result = validator.validate('`p@@SS`%%<p>w oord</p>');
        expect(result).toEqual(false);
      });

      // TODO: Test removed temporarily. Uncomment after integration test with frontend.
      // it('should return false', () => {
      //   const result = validator.validate('lass*123');
      //   expect(result).toEqual(false);
      // });
    });
  });
});
